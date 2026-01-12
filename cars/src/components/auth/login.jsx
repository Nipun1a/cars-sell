import React, { useState } from "react";
import logo from "../../assets/logo.png";
import car1 from "../../assets/car1.jpg";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import Button from "./Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#020617] to-[#020617] px-4">
      
      {/* Glass Card */}
      <div className="relative flex w-full max-w-5xl rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">

        {/* Left Image */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src={car1}
            alt="Car"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 px-10 py-14 flex flex-col justify-center">

          {/* Logo */}
          <img
            src={logo}
            alt="CarLo"
            className="w-10 h-10 mx-auto mb-4"
          />

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white text-center">
            Welcome Back
          </h1>

          <p className="text-[#94A3B8] text-center mt-2 mb-10">
            Sign in to continue to CarLo
          </p>

          {/* Form */}
          <div className="flex flex-col gap-6 items-center">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={handleLogin}>
              Login
            </Button>
          </div>

          {/* Footer */}
          <p className="text-sm text-center mt-8 text-[#94A3B8]">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-[#38B9FA] font-medium hover:underline"
            >
              Register
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
