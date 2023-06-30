"use client";

import { useEffect, useState } from "react";
import { BsCheck } from "react-icons/bs";

interface CheckboxProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function Checkbox(props: CheckboxProps) {
  return (
    <div
      className={`flex items-center gap-1.5 cursor-pointer select-none`}
      onClick={() => {
        props.onChange(!props.value);
      }}
    >
      <div className="bg-gray-700 rounded shadow-md w-5 h-5 p-[0.20rem]">
        {/* {props.value && <BsCheck className="text-xl text-primary-500" />} */}
        {props.value && (
          <div className="bg-primary-500 rounded w-full h-full" />
        )}
      </div>

      <span className="text-sm whitespace-nowrap">{props.label}</span>
    </div>
  );
}
