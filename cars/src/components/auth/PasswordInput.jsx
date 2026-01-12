import React, { useState } from "react";

const PasswordInput = ({
  label,
  name,
  placeholder = "",
  value,
  onChange,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-[340px]">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-[#AAB2C8]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="
            w-full h-[50px]
            px-4 pr-12
            rounded-xl
            bg-[#0F172A]
            text-white
            placeholder:text-[#6B7280]

            border border-[#1E293B]
            outline-none

            transition-all duration-300 ease-out

            focus:border-[#38B9FA]
            focus:shadow-[0_0_0_3px_rgba(56,185,250,0.25)]

            hover:border-[#2F80ED]

            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        />

        {/* Show / Hide Password */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowPassword(!showPassword)}
          className="
            absolute right-4 top-1/2 -translate-y-1/2
            text-[#6B7280]
            hover:text-[#38B9FA]
            transition-colors
            disabled:opacity-40
            cursor-pointer
          "
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
