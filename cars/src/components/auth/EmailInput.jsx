import React from "react";

const EmailInput = ({
  label,
  name,
  placeholder = "",
  value,
  onChange,
  disabled = false,
}) => {
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

      <input
        id={name}
        name={name}
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="
          w-full h-[50px]
          px-4
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
    </div>
  );
};

export default EmailInput;
