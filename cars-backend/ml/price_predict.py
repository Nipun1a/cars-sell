from datetime import date
from functools import lru_cache
from pathlib import Path
import math
import joblib
import numpy as np
import pandas as pd

BASE = Path(__file__).resolve().parent

@lru_cache(maxsize=1)
def artifact():
    path = BASE / "valuation_pipeline.joblib"
    if not path.exists():
        raise RuntimeError("Model unavailable. Run python train.py before starting the ML service.")
    return joblib.load(path)

def options():
    meta = artifact()["metadata"]
    return {key: meta[key] for key in ["models", "categories", "model_version", "dataset_reference_year", "test", "limitations"]}

def number(data, key, low, high, optional=False):
    value = data.get(key)
    if optional and (value is None or value == ""):
        return np.nan
    if isinstance(value, bool):
        raise ValueError(f"{key} must be a number.")
    try:
        value = float(value)
    except (ValueError, TypeError):
        raise ValueError(f"{key} must be a number.") from None
    if not math.isfinite(value) or not low <= value <= high:
        raise ValueError(f"{key} must be between {low} and {high}.")
    return value

def predict_car_price(data):
    if not isinstance(data, dict):
        raise ValueError("Send a JSON object with vehicle details.")
    bundle = artifact()
    meta = bundle["metadata"]
    name = data.get("name")
    if not isinstance(name, str) or name not in meta["models"]:
        raise ValueError("Choose a supported vehicle model.")
    year = number(data, "year", 1980, date.today().year)
    if not year.is_integer():
        raise ValueError("Year must be a whole number.")
    row = {"name": name, "brand": name.split()[0], "car_age": date.today().year - year,
           "kms_driven": number(data, "kms_driven", 0, 2000000)}
    for key, choices in meta["categories"].items():
        if data.get(key) not in choices:
            raise ValueError(f"Choose a valid {key}.")
        row[key] = data[key]
    for key, limits in {"mileage": (1, 60), "engine": (300, 8000), "max_power": (10, 1500), "seats": (2, 14)}.items():
        row[key] = number(data, key, *limits, optional=True)
    missing = [key for key in ["mileage", "engine", "max_power", "seats"] if np.isnan(row[key])]
    value = float(bundle["pipeline"].predict(pd.DataFrame([row]))[0])
    if not math.isfinite(value) or value <= 0:
        raise RuntimeError("Model returned an invalid price.")
    radius = bundle["log_residual_radius"]
    warnings = ["This estimate uses historical 2020 listings; it is not a live market quote. Condition, location and service history can materially change value."]
    if missing:
        warnings.append("Some specifications were omitted and filled using training-set medians. Add specifications for a more informed estimate.")
    if row["car_age"] > meta["age_bounds"][1]:
        warnings.append("Vehicle age is outside the training range; this estimate may be unreliable.")
    if year > meta["dataset_reference_year"]:
        warnings.append("This vehicle year is newer than the source dataset. A current market appraisal is recommended.")
    return {
        "predicted_price": round(value),
        "price_range": {"lower": max(0, round(np.expm1(np.log1p(value) - radius))), "upper": round(np.expm1(np.log1p(value) + radius))},
        "currency": "INR", "model_version": meta["model_version"],
        "inputs": {**{key: (None if isinstance(val, float) and np.isnan(val) else val) for key, val in row.items()}, "year": int(year)},
        "warnings": warnings,
    }
