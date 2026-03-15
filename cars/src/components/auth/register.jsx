import React, { useState } from "react";
import logo from "../../assets/logo.png";
import car2 from "../../assets/car2.jpg";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import TextInput from "./TextInput";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import Button from "./Button";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#020617] to-[#020617] px-4">
      
      {/* Glass Card */}
      <div className="relative flex w-full max-w-5xl rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">

        {/* Left Form */}
        <div className="w-full md:w-1/2 px-10 py-14 flex flex-col justify-center">

          {/* Logo */}
          <img
            src={logo}
            alt="CarLo"
            className="w-10 h-10 mx-auto mb-4"
          />

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white text-center">
            Create Account
          </h1>

          <p className="text-[#94A3B8] text-center mt-2 mb-10">
            Join CarLo to buy, sell & predict car prices
          </p>

          {/* Form */}
          <div className="flex flex-col gap-6 items-center">
            <TextInput
              label="Username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <EmailInput
              label="Email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              label="Password"
              name="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={handleRegister}>
              Create Account
            </Button>
          </div>

          {/* Footer */}
          <p className="text-sm text-center mt-8 text-[#94A3B8]">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#38B9FA] font-medium hover:underline"
            >
              Login
            </a>
          </p>

        </div>

        {/* Right Image */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src={car2}
            alt="Car"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent" />
        </div>

      </div>
    </div>
  );
};

export default Register;
