import { AiFillStar } from "react-icons/ai";

interface RatingProps {
  rating: number;
}

export default ({ rating }: RatingProps) => {
  return (
    <div className=" flex items-center gap-0.5  text-white bg-opacity-80 rounded-md">
      <AiFillStar className="text-yellow-500" />
      <span className="text-yellow-500">{rating == 0 ? "?" : rating}</span>
    </div>
  );
};
