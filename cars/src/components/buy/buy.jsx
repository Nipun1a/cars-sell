import React, { useState } from "react";
import Navbar from "../Navbar";

import car5 from "./../../assets/car5.png";
import car6 from "./../../assets/car6.png";
import car7 from "./../../assets/car7.png";
import car8 from "./../../assets/car8.png";

const cars = [
  {
    id: 1,
    name: "Maruti Swift",
    image: car5,
  },
  {
    id: 2,
    name: "Honda City",
    image: car6,
  },
  {
    id: 3,
    name: "Tata Punch",
    image: car7,
  },
  {
    id: 4,
    name: "Mercedes-Benz E-Class",
    image: car8,
  },
];

const Buy = () => {
  const [message, setMessage] = useState("");

  const handleBooking = (carName) => {
    setMessage(`✅ Test drive booked for ${carName}`);
    setTimeout(() => setMessage(""), 3000); // hide after 3 seconds
  };

  return (
    <div>
      <Navbar user={JSON.parse(localStorage.getItem("user"))} />

      <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-16 px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
          All Listings
        </h1>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition duration-300 text-center"
            >
              <img
                src={car.image}
                alt={car.name}
                className="h-[220px] mx-auto mb-4 hover:scale-105 transition duration-500"
              />

              <h2 className="text-xl font-semibold mb-4">
                {car.name}
              </h2>

              <button
                onClick={() => handleBooking(car.name)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition duration-300"
              >
                Book Test Drive
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        {message && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300">
            {message}
          </div>
        )}
      </section>
    </div>
  );
};

export default Buy;
