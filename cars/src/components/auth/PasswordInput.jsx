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
    <div className="absolute top-288px left-24px opacity-100">
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 font-inter text-sm leading-[22px] font-medium"
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
            w-[336px]
            h-[49px]
            px-3
            pr-10
            font-inter
            text-sm
            leading-[22px]
            font-normal
            bg-white
            rounded-6px
            border
            border-[#DEE1E6]
            outline-none

            hover:text-[#565D6D]
            hover:bg-white
            hover:border-[#DEE1E6]

            focus:text-[#565D6D]
            focus:bg-white
            focus:border-[#DEE1E6]

            disabled:text-[#565D6D]
            disabled:bg-white
            disabled:border-[#DEE1E6]
          "
        />

        {/* Toggle Icon */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowPassword(!showPassword)}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-[#565D6D]
            disabled:text-[#565D6D]
          "
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
