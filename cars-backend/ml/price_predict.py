import joblib
import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "car_price_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))

def predict_car_price(data):
    row = {
        "Present_Price": data["present_price"],
        "Kms_Driven": data["kms_driven"],
        "Fuel_Type": data["fuel_type"],
        "Seller_Type": data["seller_type"],
        "Transmission": data["transmission"],
        "Owner": data["owner"],
        "Car_Age": data["car_age"],
    }

    # Build a DataFrame with feature names to match training
    features = pd.DataFrame([row], columns=[
        "Present_Price",
        "Kms_Driven",
        "Fuel_Type",
        "Seller_Type",
        "Transmission",
        "Owner",
        "Car_Age",
    ])

    # scale numeric features
    numeric_cols = ["Present_Price", "Kms_Driven", "Car_Age"]
    features[numeric_cols] = scaler.transform(features[numeric_cols])

    prediction = model.predict(features)[0]
    return round(float(prediction), 2)
