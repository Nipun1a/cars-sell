"""Reproducible training: deduplicate before splitting; select on validation, evaluate once on test."""
import json
import hashlib
from datetime import datetime, timezone
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
import sklearn
from sklearn.compose import ColumnTransformer, TransformedTargetRegressor
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import ExtraTreesRegressor, RandomForestRegressor, HistGradientBoostingRegressor
from sklearn.dummy import DummyRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

BASE = Path(__file__).resolve().parent
DATA = BASE.parent.parent / "cars-dataset" / "Car details v3.csv"
CATEGORICAL = ["name", "brand", "fuel_type", "seller_type", "transmission", "owner"]
NUMERIC = ["car_age", "kms_driven", "mileage", "engine", "max_power", "seats"]
FEATURES = CATEGORICAL + NUMERIC
REFERENCE_YEAR = 2020  # The supplied historical CarDekho dataset ends in 2020.

def load_data():
    raw = pd.read_csv(DATA).drop_duplicates()
    frame = pd.DataFrame()
    frame["name"] = raw["name"].str.strip()
    frame["brand"] = frame["name"].str.split().str[0]
    frame["fuel_type"] = raw["fuel"]
    frame["seller_type"] = raw["seller_type"]
    frame["transmission"] = raw["transmission"]
    frame["owner"] = raw["owner"]
    frame["car_age"] = REFERENCE_YEAR - raw["year"]
    frame["kms_driven"] = raw["km_driven"]
    for field in ["mileage", "engine", "max_power", "seats"]:
        frame[field] = pd.to_numeric(raw[field].astype(str).str.extract(r"(\d+\.?\d*)", expand=False), errors="coerce")
    frame["target"] = raw["selling_price"]
    frame = frame[(frame.target > 10000) & (frame.car_age >= 0) & (frame.kms_driven >= 0)]
    # Identical features cannot cross splits even when advertised prices differ.
    return frame.groupby(FEATURES, dropna=False, as_index=False).target.median()

def pipeline(estimator):
    preprocess = ColumnTransformer([
        ("categorical", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL),
        ("numeric", SimpleImputer(strategy="median"), NUMERIC),
    ])
    return TransformedTargetRegressor(regressor=Pipeline([("preprocess", preprocess), ("model", estimator)]),
                                      func=np.log1p, inverse_func=np.expm1)

def metrics(y, predicted):
    return {"mae_inr": round(float(mean_absolute_error(y, predicted)), 2),
            "rmse_inr": round(float(np.sqrt(mean_squared_error(y, predicted))), 2),
            "r2": round(float(r2_score(y, predicted)), 4),
            "median_absolute_percentage_error": round(float(np.median(np.abs((y - predicted) / y)) * 100), 2)}

def train():
    frame = load_data()
    train_frame, test = train_test_split(frame, test_size=0.15, random_state=42)
    train_set, validation = train_test_split(train_frame, test_size=0.1764705882, random_state=42)
    candidates = {
        "extra_trees": ExtraTreesRegressor(n_estimators=250, min_samples_leaf=2, max_features=0.9, n_jobs=-1, random_state=42),
        "random_forest": RandomForestRegressor(n_estimators=200, min_samples_leaf=2, n_jobs=-1, random_state=42),
        "gradient_boosting": HistGradientBoostingRegressor(max_iter=220, max_leaf_nodes=25, l2_regularization=2, random_state=42),
    }
    scores, fitted = {}, {}
    for name, estimator in candidates.items():
        model = pipeline(estimator)
        model.fit(train_set[FEATURES], train_set.target)
        scores[name] = metrics(validation.target, model.predict(validation[FEATURES]))
        fitted[name] = model
        print(name, scores[name], flush=True)
    winner = min(scores, key=lambda name: scores[name]["mae_inr"])
    # Keep validation untouched for empirical residual calibration; no refit on it.
    model = fitted[winner]
    residuals = np.abs(np.log1p(validation.target) - np.log1p(model.predict(validation[FEATURES])))
    radius = float(np.quantile(residuals, min(1, np.ceil((len(residuals) + 1) * 0.9) / len(residuals)), method="higher"))
    predictions = model.predict(test[FEATURES])
    baseline = DummyRegressor(strategy="median").fit(train_set[FEATURES], train_set.target)
    version = hashlib.sha256(DATA.read_bytes()).hexdigest()[:12] + "-v2"
    metadata = {
        "model_version": version, "trained_at": datetime.now(timezone.utc).isoformat(),
        "sklearn_version": sklearn.__version__, "dataset": DATA.name, "dataset_reference_year": REFERENCE_YEAR,
        "currency": "INR", "selected_model": winner,
        "split": {"train": len(train_set), "validation": len(validation), "test": len(test), "seed": 42},
        "validation": scores, "test": metrics(test.target, predictions),
        "baseline_test": metrics(test.target, baseline.predict(test[FEATURES])),
        "test_range_coverage": round(float(np.mean(np.abs(np.log1p(test.target) - np.log1p(predictions)) <= radius)), 4),
        "range_note": "90% empirical log-residual range; calibration shares model-selection validation data. Not a guaranteed confidence interval.",
        "limitations": "Historical 2020 listings, not current transaction prices. No inspection, condition, region, inflation or EV coverage. Random held-out split is not a future-market test.",
        "models": sorted(frame.name.unique().tolist()),
        "categories": {key: sorted(frame[key].unique().tolist()) for key in ["fuel_type", "seller_type", "transmission", "owner"]},
        "age_bounds": [int(frame.car_age.min()), int(frame.car_age.max())],
    }
    artifact = {"pipeline": model, "metadata": metadata, "log_residual_radius": radius}
    target = BASE / "valuation_pipeline.joblib"
    temporary = BASE / "valuation_pipeline.tmp"
    joblib.dump(artifact, temporary, compress=3)
    temporary.replace(target)
    (BASE / "model_metrics.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(json.dumps({key: metadata[key] for key in ["selected_model", "split", "test", "baseline_test", "test_range_coverage"]}, indent=2), flush=True)

if __name__ == "__main__":
    train()
