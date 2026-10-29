import api from "../api/axios";
export const predictCarPrice = async (carData) => {
  const response = await api.post("/predict-price", carData);
  return response.data.valuation;
};
