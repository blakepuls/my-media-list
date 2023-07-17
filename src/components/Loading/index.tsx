import React from "react";
import "./animation.css";

interface LoadingAnimationProps {
  className?: string;
}

const LoadingAnimation = ({ className }: LoadingAnimationProps) => {
  return (
    <div className={`boxes ${className}`}>
      <div className="box ">
        <div className="bg-primary-500"></div>
        <div className="bg-primary-600"></div>
        <div className="bg-primary-700"></div>
        <div className="bg-gray-900 shadow-lg"></div>
      </div>
      <div className="box">
        <div className="bg-primary-500"></div>
        <div className="bg-primary-600"></div>
        <div className="bg-primary-700"></div>
        <div className="bg-gray-900 shadow-lg"></div>
      </div>
      <div className="box">
        <div className="bg-primary-500"></div>
        <div className="bg-primary-600"></div>
        <div className="bg-primary-700"></div>
        <div className="bg-gray-900 shadow-lg"></div>
      </div>
      <div className="box ">
        <div className="bg-primary-500"></div>
        <div className="bg-primary-600"></div>
        <div className="bg-primary-700"></div>
        <div className="bg-gray-900 shadow-lg"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
