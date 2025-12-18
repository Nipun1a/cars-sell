import React, { useState } from "react";
import logo from "../../assets/logo.png";
import car1 from "../../assets/car1.jpg";

import TextInput from "./TextInput";
import PasswordInput from "./PasswordInput";
import Button from "./Button";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      {/* Card */}
      <div className="flex w-full max-w-1152px h-600px bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* Left Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={car1}
            alt="Cars"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 px-10 py-12 flex flex-col justify-center align-middle">
          
          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 mx-auto mb-4"
          />

          {/* Heading */}
          <h1 className="text-3xl font-bold mt-1 mb- text-center">
            Welcome Back
          </h1>

          <p className="text-gray-600 mt-2 mb-10 text-center">
            Enter your credentials to access your account
          </p>

          {/* Username */}
          <div className="w-full  
                px-6 sm:px-5 py-10 sm:py-12 
                flex items-center justify-center">
          <TextInput
            label="Username"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          </div>

          {/* Password */}
          <div className="w-full  
                px-4 sm:px-10 py-10 sm:py-12 
                flex items-center justify-center">
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <div className="w-full  
                px-6 sm:px-6 py-10 sm:py-12 
                flex items-center justify-center">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>

          {/* Footer */}
          <p className="text-sm text-center mt-6 ">
            Don’t have an account?{" "}
            <span className="text-blue-500 cursor-pointer font-medium hover:underline">
              Register
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
