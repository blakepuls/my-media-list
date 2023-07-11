"use client";

import { useEffect, useState } from "react";
import "./slider.css";

interface SliderProps {
  label?: string;
  min: number;
  max: number;
  initialValue?: number;
  step?: number;
  onChange?: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  min,
  max,
  initialValue = min,
  step = 0.01,
  onChange,
}) => {
  const [value, setValue] = useState<number>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full relative w-32 h-12">
      <div className="flex pb-1 justify-between">
        <label className="">{label}</label>
        <span className="">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="slider !bg-gray-900 absolute"
      />
    </div>
  );
};

export default Slider;
