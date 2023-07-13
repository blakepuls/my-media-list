import React from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
}

const Counter: React.FC<CounterProps> = ({ value, onChange }) => {
  return (
    <div className="flex bg-gray-900 h-12 w-20 overflow-hidden rounded-md shadow-md">
      <span className="w-full text-xl bg-transparent p-3">{value}</span>
      <section className="ml-auto mr-0.5 select-none">
        <AiFillCaretUp
          className="text-2xl transition-colors hover:text-primary-500 cursor-pointer"
          onMouseDown={() => onChange(value + 1)}
        />
        <AiFillCaretDown
          className="text-2xl transition hover:text-primary-500 cursor-pointer"
          onMouseDown={() => onChange(value - 1)}
        />
      </section>
    </div>
  );
};

export default Counter;
