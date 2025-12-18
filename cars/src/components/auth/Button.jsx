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
        absolute top-380px left-24px
        w-[336px] h-40px
        px-3
        flex items-center justify-center
        font-inter
        text-sm leading-[22px] font-semibold
        text-[#19191F]
        bg-[#38B9FA]
        opacity-100
        rounded-6px
        border-0
        shadow-0px_0px_0px_#00000000,_0px_2px_4px_#38B9FA80

        hover:text-[#19191F]
        hover:bg-[#38B9FA]

        active:text-[#19191F]
        active:bg-[#38B9FA]

        disabled:opacity-40
      "
    >
      {children}
    </button>
  );
};

export default Button;
