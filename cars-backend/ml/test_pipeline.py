import unittest
from copy import deepcopy
from app import app
from price_predict import predict_car_price, artifact

VALID = {"name": "Maruti Swift Dzire VDI", "year": 2014, "kms_driven": 60000,
         "fuel_type": "Diesel", "transmission": "Manual", "owner": "First Owner",
         "seller_type": "Individual", "engine": 1248, "mileage": 23.4, "max_power": 74, "seats": 5}

class PipelineTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_prediction_and_range(self):
        first = predict_car_price(VALID)
        self.assertEqual(first, predict_car_price(VALID))
        self.assertGreater(first["predicted_price"], 0)
        self.assertLess(first["price_range"]["lower"], first["predicted_price"])
        self.assertGreater(first["price_range"]["upper"], first["predicted_price"])
        self.assertEqual(first["currency"], "INR")

    def test_optional_specs_are_json_safe(self):
        data = deepcopy(VALID)
        for field in ["engine", "mileage", "max_power", "seats"]:
            data.pop(field)
        result = self.client.post("/predict-price", json=data)
        self.assertEqual(result.status_code, 200)
        self.assertIsNone(result.json["inputs"]["engine"])
        self.assertGreater(len(result.json["warnings"]), 1)

    def test_invalid_inputs(self):
        for field, value in [("year", 3000), ("kms_driven", -1), ("kms_driven", True),
                             ("kms_driven", "NaN"), ("year", 2014.5), ("fuel_type", "Electric"),
                             ("name", "unsupported model"), ("engine", 0)]:
            with self.subTest(field=field, value=value):
                self.assertEqual(self.client.post("/predict-price", json={**VALID, field: value}).status_code, 400)

    def test_missing_and_malformed_json(self):
        self.assertEqual(self.client.post("/predict-price", json={}).status_code, 400)
        self.assertEqual(self.client.post("/predict-price", json=[]).status_code, 400)
        self.assertEqual(self.client.post("/predict-price", data="{", content_type="application/json").status_code, 400)
        self.assertEqual(self.client.post("/predict-price", data="text").status_code, 415)

    def test_options_and_health(self):
        self.assertEqual(self.client.get("/health").status_code, 200)
        self.assertIn(VALID["name"], self.client.get("/options").json["models"])

    def test_model_beats_baseline_on_held_out_test(self):
        meta = artifact()["metadata"]
        self.assertLess(meta["test"]["mae_inr"], meta["baseline_test"]["mae_inr"])
        self.assertEqual(meta["split"]["test"], 1005)

    def test_duplicate_feature_rows_removed(self):
        from train import load_data, FEATURES
        frame = load_data()
        self.assertFalse(frame.duplicated(FEATURES).any())

if __name__ == "__main__":
    unittest.main()
