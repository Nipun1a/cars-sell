import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from price_predict import predict_car_price

app = Flask(__name__)
CORS(app)

# Home route
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "ok",
        "message": "Carlo ML API is running"
    })

# Prediction route
@app.route("/predict-price", methods=["POST"])
def predict_price():
    try:
        data = request.get_json()

        if data is None:
            return jsonify({"error": "No JSON data received"}), 400

        price = predict_car_price(data)

        return jsonify({
            "predicted_price": price
        })

    except KeyError as e:
        return jsonify({
            "error": f"Missing field: {str(e)}"
        }), 400

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
