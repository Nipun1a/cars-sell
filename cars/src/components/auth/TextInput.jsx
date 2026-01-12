import React from "react";

const TextInput = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  name,
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
        type={type}
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

          hover:border-[#2F80ED]

          focus:border-[#38B9FA]
          focus:shadow-[0_0_0_3px_rgba(56,185,250,0.25)]

          disabled:opacity-40
          disabled:cursor-not-allowed
        "
      />
    </div>
  );
};

export default TextInput;
