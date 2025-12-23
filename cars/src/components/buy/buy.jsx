import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";

import car5 from "./../../assets/car5.png";
import car6 from "./../../assets/car6.png";
import car7 from "./../../assets/car7.png";
import car8 from "./../../assets/car8.png";

// Hardcoded cars
const staticCars = [
  { id: "static-1", name: "Maruti Swift", image: car5 },
  { id: "static-2", name: "Honda City", image: car6 },
  { id: "static-3", name: "Tata Punch", image: car7 },
  { id: "static-4", name: "Mercedes-Benz E-Class", image: car8 },
];

const Buy = () => {
  const [dynamicCars, setDynamicCars] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/sell");
        setDynamicCars(res.data);
      } catch (err) {
        console.error("Failed to fetch cars", err);
      }
    };

    fetchCars();
  }, []);

  const handleBooking = (carName) => {
    setMessage(`✅ Test drive booked for ${carName}`);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <Navbar user={JSON.parse(localStorage.getItem("user"))} />

      <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-16 px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
          All Listings
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Hardcoded cars */}
          {staticCars.map((car) => (
            <div
              key={car.id}
              className="bg-gray-900 rounded-2xl p-6 shadow-lg text-center"
            >
              <img
                src={car.image}
                alt={car.name}
                className="h-[220px] mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold mb-4">{car.name}</h2>
              <button
                onClick={() => handleBooking(car.name)}
                className="bg-red-600 px-4 py-2 rounded-full"
              >
                Book Test Drive
              </button>
            </div>
          ))}

          {/* Newly listed cars */}
          {dynamicCars.map((car) => (
            <div
              key={car._id}
              className="bg-gray-900 rounded-2xl p-6 shadow-lg text-center"
            >
              <img
                src={`http://localhost:3000/${car.photos[0]}`}
                alt={car.car_name}
                className="h-[220px] mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold mb-2">
                {car.car_name}
              </h2>
              <p className="text-gray-400 mb-4">₹ {car.price}</p>
              <button
                onClick={() => handleBooking(car.car_name)}
                className="bg-red-600 px-4 py-2 rounded-full"
              >
                Book Test Drive
              </button>
            </div>
          ))}

        </div>

        {message && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 px-6 py-3 rounded-full">
            {message}
          </div>
        )}
      </section>
    </div>
  );
};

export default Buy;
