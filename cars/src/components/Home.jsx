import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

import car3 from "./../assets/car3.png";
import car4 from "./../assets/car4.png";
import car5 from "./../assets/car5.png";
import car6 from "./../assets/car6.png";
import car7 from "./../assets/car7.png";
import car8 from "./../assets/car8.png";

import sedan from "./../assets/sedan.png";
import suv from "./../assets/suv.png";
import luxury from "./../assets/luxury.png";
import mini from "./../assets/mini.png";

import buyer from "./../assets/buyer.png";
import seller from "./../assets/seller.png";

const Home = () => {
  return (
    <>
      <Navbar user={JSON.parse(localStorage.getItem("user"))} />

      <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden text-white">

  {/* Floating Effects */}
  <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
  <div className="absolute top-60 right-40 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl"></div>

  <div className="relative z-10 max-w-7xl mx-auto px-8 pt-28 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

    {/* LEFT CONTENT */}
    <div className="space-y-8">

      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
        Find Your <br />
        <span className="text-blue-500">Dream Car</span>
      </h1>

      <p className="text-gray-300 max-w-md">
        AI-powered car marketplace to buy, sell, and predict car prices with confidence.
      </p>

      {/* Feature Pills */}
      <div className="flex flex-wrap gap-3">
        {["AI Price Prediction", "Verified Listings", "Secure Payments"].map(
          (item, i) => (
            <span
              key={i}
              className="px-4 py-1 text-sm rounded-full bg-white/10 backdrop-blur border border-white/10"
            >
              ✔ {item}
            </span>
          )
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-lg">
          Predict Price
        </button>
        <button className="px-6 py-3 border border-white/30 rounded-lg hover:bg-white/10 transition">
          Browse Cars
        </button>
      </div>

      {/* Social Proof */}
      <div className="flex items-center gap-6 text-sm text-gray-400">
        <div>⭐ 4.9 Rating</div>
        <div>🚗 10,000+ Cars Listed</div>
        <div>😊 5,000+ Happy Users</div>
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="relative flex justify-center md:justify-end">
      <div className="absolute -inset-24 bg-blue-600/20 blur-[120px] rounded-full"></div>

      <img
        src={car4}
        alt="Car"
        className="h-[260px] md:h-[320px] drop-shadow-[0_60px_80px_rgba(0,0,0,0.85)] hover:scale-105 transition duration-500"
      />
    </div>

  </div>
</section>


      <section className="bg-gradient-to-br from-black via-gray-900 to-black py-16">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          
          {/* Sedan */}
          <Link
            to="/buy"
            className="group bg-white rounded-xl p-5 flex flex-col items-center justify-center hover:scale-105 transition"
          >
            <img src={sedan} alt="Sedan" className="w-14 mb-3" />
            <p className="text-sm font-semibold text-gray-800">Sedan</p>
          </Link>

          {/* SUV */}
          <Link
            to="/buy"
            className="group bg-white rounded-xl p-5 flex flex-col items-center justify-center hover:scale-105 transition"
          >
            <img src={suv} alt="SUV" className="w-14 mb-3" />
            <p className="text-sm font-semibold text-gray-800">SUV</p>
          </Link>

          {/* Luxury */}
          <Link
            to="/buy"
            className="group bg-white rounded-xl p-5 flex flex-col items-center justify-center hover:scale-105 transition"
          >
            <img src={luxury} alt="Luxury" className="w-14 mb-3" />
            <p className="text-sm font-semibold text-gray-800">Luxury</p>
          </Link>

          {/* Mini */}
          <Link
            to="/buy"
            className="group bg-white rounded-xl p-5 flex flex-col items-center justify-center hover:scale-105 transition"
          >
            <img src={mini} alt="Mini" className="w-14 mb-3" />
            <p className="text-sm font-semibold text-gray-800">Mini</p>
          </Link>
</div>
      </div>
          <div className="bg-gradient-to-b from-[#0b0f1a] to-[#020617] py-20">

  {/* Section Heading */}
  
  <h1 className="text-4xl md:text-6xl font-extrabold text-center text-white mb-16 tracking-wide">
    TOP SELLING
  </h1>

  {/* Featured Car */}
  <div className="max-w-7xl mx-auto mb-20 px-6">
    <div className="relative grid md:grid-cols-2 items-center rounded-3xl overflow-hidden bg-gradient-to-r from-[#111827] to-[#020617] shadow-2xl">

      {/* Text */}
      <div className="p-10 space-y-6">
        <span className="uppercase tracking-widest text-blue-500 text-sm">
          Featured
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Mercedes-Benz E-Class
        </h2>
        <p className="text-gray-400 max-w-md">
          Experience luxury, performance, and cutting-edge technology in one premium sedan.
        </p>
        <Link to="/buy">
        <button className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 shadow-lg">
          View Details
        </button>
        </Link>
      </div>

      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={car8}
          alt="Mercedes-Benz E-Class"
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />
      </div>
    </div>
  </div>

  {/* Cards Grid */}
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

    {/* Card */}
    {[ 
      { img: car7, name: "Tata Punch" },
      { img: car6, name: "Honda City" },
      { img: car5, name: "Maruti Swift" },
      { img: car3, name: "More Cars" }
    ].map((car, index) => (
      <div
        key={index}
        className="group bg-[#0f172a]/80 backdrop-blur rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
      >
        <div className="overflow-hidden">
          <img
            src={car.img}
            alt={car.name}
            className="h-44 w-full object-cover group-hover:scale-110 transition duration-500"
          />
        </div>

        <div className="p-5 space-y-3">
          <h3 className="text-white font-semibold text-lg">
            {car.name}
          </h3>
          <Link to= "/buy">
          <button  className="text-blue-500 text-sm font-medium hover:underline">
            View More →
          </button>
          </Link>
        </div>
      </div>
    ))}

  </div>
</div>

    </section>

      {/* OUR SERVICES */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black py-24 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-white mb-20">
          OUR SERVICES
        </h1>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-[#0f172a] rounded-3xl p-10 text-white">
            <h2 className="text-3xl font-bold mb-4">Happy Buyers</h2>
            <p className="text-gray-400">
              Industry standard dummy text ever since.
            </p>
          </div>

          <img src={buyer} alt="buyers" className="rounded-3xl" />
          <img src={seller} alt="sellers" className="rounded-3xl" />

          <div className="bg-[#0f172a] rounded-3xl p-10 text-white">
            <h2 className="text-3xl font-bold mb-4">Happy Customers</h2>
            <p className="text-gray-400">
              Industry standard dummy text ever since.
            </p>
          </div>
        </div>
      </section>

      {/*fotter section */}
    <footer className="bg-gradient-to-br from-black via-gray-900 to-black text-gray-300">
  <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
    
    {/* Brand */}
    <div>
      <h2 className="text-2xl font-bold text-white">
        Car<span className="text-blue-500">Lo</span>
      </h2>
      <p className="mt-4 text-sm leading-relaxed">
        CarLo is a modern car marketplace platform designed to help users
        explore, buy, sell, and predict car prices with ease.
      </p>
    </div>

    {/* Important Info */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">
        Project Info
      </h3>
      <ul className="space-y-2 text-sm">
        <li>🚗 Buy & Sell Cars</li>
        <li>📊 AI-based Price Prediction</li>
        <li>🔒 Secure User Authentication</li>
        <li>⚡ Fast & Responsive UI</li>
      </ul>
    </div>

    {/* Contact */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">
        Contact
      </h3>
      <p className="text-sm">Developer: <span className="text-white">Nipun</span></p>
      <p className="text-sm mt-2">
        Email:{" "}
        <a
          href="mailto:nipun7abc@gmail.com"
          className="text-blue-500 hover:underline"
        >
          nipun7abc@gmail.com
        </a>
      </p>
    </div>

  </div>

  {/* Bottom Bar */}
  <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-400">
    © {new Date().getFullYear()} CarLo. Built by Nipun.
  </div>
</footer>
    </>
  );
};

export default Home;
