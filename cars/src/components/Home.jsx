import React from "react";
import Navbar from "./Navbar";
import car4 from "./../assets/car4.png";
import sedan from "./../assets/sedan.png";
import suv from "./../assets/suv.png";
import luxury from "./../assets/luxury.png";
import mini from "./../assets/mini.png";

import { Link } from "react-router-dom"




const Home = () => {
  return (
    <>
      <Navbar user={JSON.parse(localStorage.getItem("user"))} />

      {/* HERO SECTION */}
      <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden text-white">
        
        {/* Floating Circles */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gray-700/30 rounded-full blur-2xl"></div>
        <div className="absolute top-60 right-40 w-56 h-56 bg-gray-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/3 w-32 h-32 bg-gray-500/20 rounded-full blur-2xl"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 pt-28 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Find Your <br />
              <span className="text-blue-500">Dream Car</span>
            </h1>

            <p className="mt-6 text-gray-300 max-w-md">
              Lorem ipsum has been the industry’s standard dummy text ever since
              the 1500s.
            </p>

            <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold shadow-lg">
              Predict Price of Car
            </button>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center md:justify-end">
  
  
  
  {/* Glow behind car */}
  <div className="absolute -inset-20 bg-blue-600/20 blur-[120px] rounded-full"></div>

      {/* Car Image */}
      <img
        src={car4}
        alt="Car"
        className="h-200px w-200px drop-shadow-[0_60px_80px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform duration-500"
      />
    </div>


        </div>
      </section>
      {/* END OF HERO SECTION */}
      {/* cars SECTION */}

  

    <section className="bg-gradient-to-br from-black via-gray-900 to-black py-16">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          
          {/* Sedan */}
          <Link
            to="/buy?type=sedan"
            className="group bg-white rounded-xl p-5 flex flex-col items-center justify-center hover:scale-105 transition"
          >
            <img src={sedan} alt="Sedan" className="w-14 mb-3" />
            <p className="text-sm font-semibold text-gray-800">Sedan</p>
          </Link>

          {/* SUV */}
          <Link
            to="/buy?type=suv"
            className="group bg-white rounded-xl p-5 flex flex-col items-center justify-center hover:scale-105 transition"
          >
            <img src={suv} alt="SUV" className="w-14 mb-3" />
            <p className="text-sm font-semibold text-gray-800">SUV</p>
          </Link>

          {/* Luxury */}
          <Link
            to="/buy?type=luxury"
            className="group bg-white rounded-xl p-5 flex flex-col items-center justify-center hover:scale-105 transition"
          >
            <img src={luxury} alt="Luxury" className="w-14 mb-3" />
            <p className="text-sm font-semibold text-gray-800">Luxury</p>
          </Link>

          {/* Mini */}
          <Link
            to="/buy?type=mini"
            className="group bg-white rounded-xl p-5 flex flex-col items-center justify-center hover:scale-105 transition"
          >
            <img src={mini} alt="Mini" className="w-14 mb-3" />
            <p className="text-sm font-semibold text-gray-800">Mini</p>
          </Link>

        </div>
      </div>

      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-center mt-10 text-white">TOP SELLING</h1>


      </div>
    </section>

    {/*customer and buyer section */}

    <section className="bg-gradient-to-br from-black via-gray-900 to-black py-16">
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-center mt-10 text-white">OUR SERVICES</h1>
      <div>
        <div>
          <h1>Happy Buyers</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis nam dolore modi, molestias natus magnam tempora. Laboriosam doloremque, perspiciatis quas reprehenderit mollitia accusantium eos tenetur excepturi voluptates iste, ut fuga?</p>
        </div>
        <div>
          {/*Image lagayio */}
        </div>
      </div>

      <div>
        <div>
          <h1>Happy Customers</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis nam dolore modi, molestias natus magnam tempora. Laboriosam doloremque, perspiciatis quas reprehenderit mollitia accusantium eos tenetur excepturi voluptates iste, ut fuga?</p>
        </div>
        <div>
          {/*Image lagayio */}
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
