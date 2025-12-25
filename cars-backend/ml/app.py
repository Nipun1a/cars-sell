from flask import Flask, request, jsonify
from price_predict import predict_car_price
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow requests from frontend/backend

@app.route("/predict-price", methods=["POST"])
def predict_price():
    data = request.json
    price = predict_car_price(data)

    return jsonify({
        "predicted_price": price
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
