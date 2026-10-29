import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  timeout: 30000,
});
export const apiError = (error) =>
  error.response?.data?.message ||
  (error.code === "ECONNABORTED"
    ? "This took longer than expected. Please try again."
    : "Unable to connect. Please try again shortly.");
export const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
export const photoUrl = (path) => {
  if (!path?.startsWith("/uploads/")) return "";
  const base = import.meta.env.VITE_API_URL;
  return (base && /^https?:\/\//.test(base) ? new URL(base).origin : "") + path;
};
export default api;
