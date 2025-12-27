import axios from "axios";

export const predictCarPrice = async (carData) => {
  const response = await axios.post(
    "http://localhost:3000/api/predict-price",
    carData
  );
  return response.data.predicted_price;
};
