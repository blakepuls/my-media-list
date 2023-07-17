import { useState, useEffect } from "react";
import "./animation.css";

const actions = ["Discover", "Track", "Rate"];

export default function Headline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const nextIndex = (index + 1) % actions.length;
    const timer = setTimeout(() => setIndex(nextIndex), 3000);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="text-container">
      <h1 className="text-7xl font-bold mb-10">
        <div>One Place to</div>
        <div className="text-action">{actions[index]}</div>
      </h1>
      <h1 className="text-7xl font-bold mb-10">Your Entertainment.</h1>
    </div>
  );
}
