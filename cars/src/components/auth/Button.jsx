import React from "react";

const Button = ({
  children,
  type = "button",
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="
        relative
        w-[340px] h-[48px]
        flex items-center justify-center
        rounded-xl
        font-inter
        text-[15px] font-semibold
        text-white

        bg-gradient-to-r from-[#2F80ED] to-[#38B9FA]
        shadow-[0_8px_30px_rgba(56,185,250,0.35)]

        transition-all duration-300 ease-out
        hover:scale-[1.03]
        hover:shadow-[0_12px_40px_rgba(56,185,250,0.55)]

        active:scale-[0.97]

        disabled:opacity-40
        disabled:cursor-not-allowed
        cursor-pointer
      "
    >
      {children}
    </button>
  );
};

export default Button;
