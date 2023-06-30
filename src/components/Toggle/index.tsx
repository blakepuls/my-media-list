"use client";

import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import "./animation.css"; // Import the CSS file

interface ToggleProps {
  label: string;
  className?: string;
  value?: boolean;
  inverted?: boolean;
  onChange?: (value: boolean) => void;
}

export default function Toggle(props: ToggleProps) {
  const [value, setValue] = useState(props.value || false);

  useEffect(() => {
    setValue(props.value || false);
  }, [props.value]);

  const stateStyle = value
    ? "bg-primary-500"
    : `mr-auto ${props.inverted ? "bg-gray-800" : "bg-gray-700"}`;

  return (
    <div className={`flex items-center gap-1.5 ${props.className}`}>
      <span className="">{props.label}</span>
      <div
        className={`h-6 w-10 p-1 flex items-center justify-center cursor-pointer rounded-md shadow-md ${
          props.inverted ? "bg-gray-700" : "bg-gray-800"
        }`}
        onClick={() => {
          setValue(!value);
          props.onChange?.(!value);
        }}
      >
        <div
          className={`flex items-center gap-2 w-4 h-4 rounded-md drop-shadow-md ${stateStyle} toggle-dot ${
            value ? "toggle-dot-on" : ""
          }`}
        />
      </div>
    </div>
  );
}
