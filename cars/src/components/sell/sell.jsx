import React, { useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";

const Sell = () => {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    car_name: "",
    model: "",
    price: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("car_name", formData.car_name);
      data.append("model", formData.model);
      data.append("price", formData.price);
      data.append("description", formData.description);

      images.forEach((img) => data.append("photos", img));

      await axios.post(
        "http://localhost:3000/api/sell",
        data
      );

      setMessage("✅ Car listed successfully");
      setShowForm(false);
      setFormData({ car_name: "", model: "", price: "", description: "" });
      setImages([]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit");
    }

    setTimeout(() => setMessage(""), 3000);
  };


  return (
    <div>
      <Navbar user={JSON.parse(localStorage.getItem("user"))} />

      <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-6 text-white">

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-600 hover:bg-red-700 px-10 py-4 rounded-full text-lg font-semibold shadow-xl transition"
          >
            Sell Your Car
          </button>
        )}

        {showForm && (
          <div className="bg-gray-900/90 backdrop-blur-xl w-full max-w-2xl rounded-3xl shadow-2xl p-10">
            <h2 className="text-3xl font-bold text-center mb-8">
              Sell Your Car
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Car Name */}
              <div>
                <label className="text-sm text-gray-300">Car Name</label>
                <input
                  type="text"
                  name="car_name"
                  value={formData.car_name}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-800 focus:ring-2 focus:ring-red-600 outline-none"
                  required
                />
              </div>

              {/* Model */}
              <div>
                <label className="text-sm text-gray-300">Model Year</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-800 focus:ring-2 focus:ring-red-600 outline-none"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-sm text-gray-300">Price (₹)</label>
                <input
                  type="text"
                  name="price"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 850000"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-800 focus:ring-2 focus:ring-red-600 outline-none"
                  required
                />
              </div>

              {/* Images */}
              <div>
                <label className="text-sm text-gray-300">Upload Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full mt-1 text-sm text-gray-300 file:bg-red-600 file:border-none file:px-4 file:py-2 file:rounded-full file:text-white cursor-pointer"
                  required
                />
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="md:col-span-2 flex gap-3 flex-wrap">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="h-20 w-28 object-cover rounded-lg border border-gray-700"
                    />
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-300">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-800 focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-4 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-full font-semibold transition"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-full transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Toast Message */}
        {message && (
          <div className="fixed bottom-6 bg-black/80 px-6 py-3 rounded-full shadow-xl">
            {message}
          </div>
        )}
      </section>
    </div>
  );
};

export default Sell;
