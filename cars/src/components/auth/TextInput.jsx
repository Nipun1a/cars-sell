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
    <div className="absolute top-192px left-24px opacity-100">
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 font-inter text-sm leading-[22px] font-medium"
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
          w-[336px]
          h-[49px]
          px-3
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
    </div>
  );
};

export default TextInput;
