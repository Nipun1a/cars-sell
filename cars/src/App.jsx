import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/Home";
import Buy from "./components/buy/buy";
import Sell from "./components/sell/sell";

import CarPricePredictor from "./components/CarPricePredictor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />

        {/* Prediction page */}
        <Route path="/predict" element={<CarPricePredictor />} />

        {/* Optional: keep Predict page if you already designed UI */}
        {/* <Route path="/predict" element={<Predict />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
