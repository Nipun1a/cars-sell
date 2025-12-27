import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "car_price_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))

def predict_car_price(data):
    features = np.array([[ 
        data["present_price"],
        data["kms_driven"],
        data["fuel_type"],
        data["seller_type"],
        data["transmission"],
        data["owner"],
        data["car_age"]
    ]])

    # scale numeric features
    features[:, [0, 1, 6]] = scaler.transform(
        features[:, [0, 1, 6]]
    )

    prediction = model.predict(features)[0]
    return round(float(prediction), 2)
