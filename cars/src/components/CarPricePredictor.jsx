import React, { useState } from "react";

const CarPricePredictor = () => {
  const [formData, setFormData] = useState({
    present_price: "",
    kms_driven: "",
    fuel_type: "0",
    seller_type: "0",
    transmission: "0",
    owner: "0",
    car_age: ""
  });

  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrice(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          present_price: Number(formData.present_price),
          kms_driven: Number(formData.kms_driven),
          car_age: Number(formData.car_age),
          fuel_type: Number(formData.fuel_type),
          seller_type: Number(formData.seller_type),
          transmission: Number(formData.transmission),
          owner: Number(formData.owner)
        })
      });

      const data = await res.json();
      setPrice(data.predicted_price);
    } catch (err) {
      alert("Prediction failed. Check backend.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-[#0b1c3d] to-black text-white px-4">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/10">
        <h2 className="text-3xl font-bold mb-2">
          AI <span className="text-blue-500">Car Price Prediction</span>
        </h2>
        <p className="text-gray-400 mb-6">
          Enter car details to get an instant AI-powered price estimate.
        </p>

        <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <input
            type="number"
            name="present_price"
            placeholder="Current Showroom Price (₹  In Lakhs)"
            value={formData.present_price}
            onChange={handleChange}
            required
            className="input"
          />

          <input
            type="number"
            name="kms_driven"
            placeholder="Kilometers Driven"
            value={formData.kms_driven}
            onChange={handleChange}
            required
            className="input"
          />

          <select name="fuel_type" onChange={handleChange} className="input">
            <option value="0">Petrol</option>
            <option value="1">Diesel</option>
            <option value="2">CNG</option>
          </select>

          <select name="seller_type" onChange={handleChange} className="input">
            <option value="0">Dealer</option>
            <option value="1">Individual</option>
          </select>

          <select name="transmission" onChange={handleChange} className="input">
            <option value="0">Manual</option>
            <option value="1">Automatic</option>
          </select>

          <select name="owner" onChange={handleChange} className="input">
            <option value="0">First Owner</option>
            <option value="1">Second Owner</option>
            <option value="2">Third Owner or More</option>
          </select>

          <input
            type="number"
            name="car_age"
            placeholder="Car Age (years)"
            value={formData.car_age}
            onChange={handleChange}
            required
            className="input md:col-span-2"
          />

          <button
            type="submit"
            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-semibold text-lg"
          >
            {loading ? "Predicting..." : "Predict Price"}
          </button>
        </form>

        {price !== null && (
          <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
            <p className="text-lg text-gray-300">Estimated Selling Price</p>
            <h3 className="text-3xl font-bold text-blue-400">
              ₹ {price} Lakhs
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarPricePredictor;
