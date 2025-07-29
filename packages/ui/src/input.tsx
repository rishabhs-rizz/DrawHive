import React from "react";

interface Inputprop {
  placeHolder: string;
  type?: string;
  className?: string;
  onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconRight?: React.ReactNode;
}

export const Input = ({
  placeHolder,
  type = "text",
  className = "",
  onchange,
  iconRight,
}: Inputprop) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        placeholder={placeHolder}
        onChange={onchange}
        className="w-full border border-gray-300 rounded-lg text-gray-400 pr-10 p-3"
      />
      {iconRight && <div className="absolute cursor-pointer">{iconRight}</div>}
    </div>
  );
};
