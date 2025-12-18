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

  const handleregister = async () => {
    try{
      const response = await api.post("auth/register",{
        username,
        email,
        password,
      });

      console.log("Registration Succesfull:", response.data);
      

      //Save the user to the LoacalStorage

      localStorage.setItem("user", JSON.stringify(response.data.user));
      alert("Registration Succesfull");
      navigate("/login");
    }catch(error){
      console.error("Registration failed:", error)
      alert("Registration failed. Please try again");
    }
      
    };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      {/* Card */}
      <div className="flex w-full max-w-1152px min-h-[600px] h- bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Left Form */}
        <div className="w-full md:w-1/2 px-10 py-12 flex flex-col justify-center align-middle">
          
          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 mx-auto mt-0.5 mb-4"
          />

          {/* Heading */}
          <h1 className="text-3xl font-bold  mb- text-center">
            Create Account
          </h1>

          <p className="text-gray-600 mt-2 mb-10 text-center">
            Join us to buy and sell cars easily
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

          {/* Email */}
          <div className="w-full  
                px-6 sm:px-5 py-10 sm:py-12 
                flex items-center justify-center">
            <EmailInput
              label="Email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="w-full  
                px-6 sm:px-5 py-10 sm:py-12 
                flex items-center justify-center">
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Register Button */}
          <div className="w-full  
                px-6 sm:px-6 py-10 sm:py-12 
                flex items-center justify-center">
            <Button onClick={handleregister} type="submit" className="w-full">
              Create Account
            </Button>
          </div>

          {/* Footer */}
          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <span className="text-blue-500 cursor-pointer font-medium hover:underline">
              <a href="/login">
                Login
              </a>
            </span>
          </p>

        </div>

        {/* Right Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={car2}
            alt="Cars"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default Register;
