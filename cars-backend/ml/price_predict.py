import joblib
import numpy as np
import os

# Get current file directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "car_price_model.pkl")
scaler_path = os.path.join(BASE_DIR, "scaler.pkl")

model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

def predict_car_price(data):
    features = np.array([[
        data["Present_Price"],
        data["Kms_Driven"],
        data["Fuel_Type"],
        data["Seller_Type"],
        data["Transmission"],
        data["Owner"],
        data["Car_Age"]
    ]])

    # scale numeric features
    features[:, [0, 1, 6]] = scaler.transform(features[:, [0, 1, 6]])

    prediction = model.predict(features)[0]
    return round(float(prediction), 2)
