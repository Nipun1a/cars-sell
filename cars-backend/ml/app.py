import os
from flask import Flask, request, jsonify
from werkzeug.exceptions import BadRequest
from price_predict import predict_car_price, options, artifact

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 32768

@app.get("/health")
@app.get("/")
def health():
    try:
        return jsonify(status="ok", model_version=artifact()["metadata"]["model_version"])
    except RuntimeError:
        return jsonify(status="model-unavailable"), 503

@app.get("/options")
def model_options():
    try:
        return jsonify(options())
    except RuntimeError as error:
        return jsonify(message=str(error)), 503

@app.post("/predict-price")
def predict_price():
    try:
        if not request.is_json:
            return jsonify(message="Content-Type must be application/json."), 415
        return jsonify(predict_car_price(request.get_json()))
    except (ValueError, BadRequest) as error:
        return jsonify(message=str(error)), 400
    except RuntimeError as error:
        return jsonify(message=str(error)), 503
    except Exception:
        app.logger.exception("Prediction failed")
        return jsonify(message="Prediction failed. Please try again later."), 500

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="127.0.0.1" if os.getenv("NODE_ENV") != "production" else "0.0.0.0",
          port=int(os.getenv("PORT", "5000")))
