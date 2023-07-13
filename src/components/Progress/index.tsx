import React from "react";

interface ProgressProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressProps> = ({ progress }) => {
  const progressStyle = {
    width: `${progress}%`,
  };

  return (
    <div className="relative bg-gray-900 h-4 overflow-hidden">
      <div
        style={progressStyle}
        className="h-full absolute shadow-md bg-gradient-to-r rounded-b-sm from-primary-500 to-primary-900"
      />
    </div>
  );
};

export default ProgressBar;
