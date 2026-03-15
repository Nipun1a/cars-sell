import React, { useEffect, useState } from 'react'
import logo from "../assets/logo.png";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user: userProp }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(userProp || null);

  useEffect(() => {
    // Initialize from localStorage if prop not provided
    if (!userProp) {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    }
  }, [userProp]);

  useEffect(() => {
    const onStorage = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // Even if the request fails, clear local state to force logout UI
      console.error(err);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <nav className="bg-black text-white px-8 py-4 flex items-center shadow-lg">
      
      {/* Left Section */}
      <div className="flex items-center gap-3 flex-none">
        <img
          src={logo}
          alt="logo"
          className="h-12 w-12 object-contain"
        />
        <h1 className="text-2xl font-bold tracking-wide">
          Car<span className="text-blue-500">Lo</span>
        </h1>
      </div>

      {/* Center Section */}
      <div className="flex-1 flex items-center justify-center gap-8">
        {user ? (
          <>
            <a
              href="/"
              className="hover:text-blue-500 transition duration-200 font-medium"
            >
              HOME
            </a>
            <a
              href="/sell"
              className="hover:text-blue-500 transition duration-200 font-medium"
            >
              SELL
            </a>
            <a
              href="/buy"
              className="hover:text-blue-500 transition duration-200 font-medium"
            >
              BUY
            </a>
            <a
              href="/predict"
              className="hover:text-blue-500 transition duration-200 font-medium"
            >
              PREDICT
            </a>
          </>
        ) : (
          <>
            <a
              href="/login"
              className="px-4 py-2 rounded-md border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition duration-200 font-medium"
            >
              Login
            </a>
            <a
              href="/register"
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-200 font-medium"
            >
              Register
            </a>
          </>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 flex-none">
        {user && (
          <>
            {user.photo ? (
              <img
                src={user.photo}
                alt="profile"
                className="w-10 h-10 rounded-full border border-gray-600 shadow"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
                {user.username?.charAt(0).toUpperCase()}
              </div>
            )}
            <p className="font-medium">{user.username}</p>
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 rounded-md border border-gray-600 text-gray-200 hover:bg-gray-800 transition duration-200 text-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>

    </nav>
  )
}

export default Navbar
