import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

interface TooltipProps {
  text: string;
  length: number;
}

const Tooltip: React.FC<TooltipProps> = ({ text, length }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const textElementRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  let tooltipTimeout: NodeJS.Timeout;

  const tooltipElement = useRef(document.createElement("div"));

  useEffect(() => {
    document.body.appendChild(tooltipElement.current);
    return () => {
      document.body.removeChild(tooltipElement.current);
    };
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      const currentEl = textElementRef.current;
      if (currentEl) {
        setIsOverflowing(currentEl.offsetWidth < currentEl.scrollWidth);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  const handleMouseEnter = (event: React.MouseEvent) => {
    tooltipTimeout = setTimeout(() => {
      if (isOverflowing) {
        const rect = textElementRef.current!.getBoundingClientRect();
        setTooltipPosition({
          x: rect.left,
          y: rect.bottom, // Render tooltip below the mouse
        });
        setShowTooltip(true);
      }
    }, 500); // Adjust this value for the delay in milliseconds
  };

  const handleMouseLeave = () => {
    clearTimeout(tooltipTimeout); // clear the timeout if the mouse leaves before the delay
    setShowTooltip(false);
  };

  return (
    <div className="relative inline-block w-full cursor-pointer">
      <div
        ref={textElementRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="truncate"
        style={{ width: `${length}ch` }}
      >
        {text}
      </div>
      {showTooltip &&
        ReactDOM.createPortal(
          <div
            className="p-0.5 px-1.5 shadow-md z-10 rounded-sm bg-gray-950"
            style={{
              position: "absolute",
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
          >
            {text}
          </div>,
          tooltipElement.current
        )}
    </div>
  );
};

export default Tooltip;
