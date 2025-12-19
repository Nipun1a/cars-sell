import React from 'react'
import logo from "../assets/logo.png";

const Navbar = ({ user }) => {
  return (
    <nav className="bg-black text-white px-8 py-4 flex items-center justify-between shadow-lg">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="logo"
          className="h-12 w-12 object-contain"
        />
        <h1 className="text-2xl font-bold tracking-wide">
          Car<span className="text-blue-500">Lo</span>
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-8">
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

        {/* User Section */}
        {user && (
          <div className="flex items-center gap-3 ml-4">
            {user.photo ? (
              <img
                src={user.photo}
                alt="profile"
                className="w-10 h-10 rounded-full border border-gray-600 shadow"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <p className="font-medium">{user.username}</p>
          </div>
        )}
      </div>

    </nav>
  )
}

export default Navbar
