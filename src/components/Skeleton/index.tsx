import "./animation.css";
interface SkeletonProps {
  animationDelay?: number;
  width?: number | string;
  height?: number | string;
  circle?: boolean;
  className?: string;
}

export default function Skeleton({
  className = "",
  animationDelay,
}: SkeletonProps) {
  return (
    <div
      className={`shimmer rounded-md shadow-md ${className}`}
      style={{ animationDelay: `${animationDelay}s` }}
    />
  );
}
