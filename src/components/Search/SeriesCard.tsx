import { addSeriesList, removeSeriesList } from "@/utils";
import { IAnimeResult, IMovieResult, IMangaResult } from "@consumet/extensions";
import { useState } from "react";
import { AiFillTrophy, AiFillStar } from "react-icons/ai";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { toast } from "react-toastify";
import Skeleton from "../Skeleton";

export function SeriesCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 w-52">
      <Skeleton className="w-full h-72 !rounded-sm" />
      <div className="h-12 w-full flex flex-col gap-2">
        <Skeleton className="w-2/3 h-4 !rounded-sm" />
        <Skeleton className="w-1/3 h-4 !rounded-sm" />
      </div>
    </div>
  );
}

interface MediaResultProps {
  result: IAnimeResult | IMovieResult | IMangaResult;
  type: "Anime" | "Movie" | "Manga";
  onList: boolean;
  seriesId: number;
}

export default function SeriesCard({ result, type, onList }: MediaResultProps) {
  const [isOnList, setIsOnList] = useState(onList);
  const [seriesId, setSeriesId] = useState(result.seriesId);

  function listAdd() {
    const promise =
      type === "Manga"
        ? addSeriesList(result.id, "manga")
        : addSeriesList(result.id, result.type === "Movie" ? "movie" : "tv");

    toast
      .promise(promise, {
        pending: "Adding to watchlist...",
        success: "Added to watchlist!",
        error: {
          render({ data }: any) {
            if (data.message.includes("Series already")) {
              setIsOnList(true);
            }
            return data.message;
          },
        },
      })
      .then((data) => {
        setSeriesId(data.data.series_id);
        setIsOnList(true);
      })
      .catch(() => {});
  }

  function listRemove() {
    const promise =
      type === "Manga"
        ? removeSeriesList(seriesId, "manga")
        : removeSeriesList(seriesId, result.type === "Movie" ? "movie" : "tv");

    toast
      .promise(promise, {
        pending: "Removing from watchlist...",
        success: "Removed from watchlist!",
        error: {
          render({ data }: any) {
            return data.message;
          },
        },
      })
      .then(() => setIsOnList(false))
      .catch(() => {});
  }

  return (
    <div
      className="relative flex flex-col  rounded-md w-52 "
      onClick={() => console.log(result)}
    >
      <img
        src={result.image}
        alt={result.title.toString()}
        className="w-full h-72 rounded-sm shadow-md object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-72 rounded-sm bg-black bg-opacity-80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer">
        {isOnList ? (
          <button
            className="m-2 outline-none flex items-center gap-1 rounded-md hover:scale-125 transition-transform p-1"
            onClick={listRemove}
          >
            <BsFillBookmarkPlusFill className="text-yellow-500" />
            Remove
          </button>
        ) : (
          <button
            className="m-2 flex outline-none items-center gap-1 rounded-md hover:scale-125 transition-transform p-1"
            onClick={listAdd}
          >
            <BsFillBookmarkPlusFill />
            {["Movie", "TV Series"].includes(type) ? "Watchlist" : "Readlist"}
          </button>
        )}
        <button className="m-2 flex items-center gap-1 rounded-md hover:scale-125 transition-transform p-1">
          <AiFillTrophy />
          Rank
        </button>
      </div>

      <div className="flex flex-col gap-0.5 overflow-hidden h-14 p-1">
        <h1 className="whitespace-nowrap text-left font-semibold overflow-hidden">
          {result.title.toString()}
        </h1>

        <section className="flex items-center  text-gray-300">
          <span>
            {/* @ts-ignore */}
            {type == "Movie" ? result.type : type}
          </span>

          {result.releaseDate && (
            <>
              <span className="text-gray-700 mx-1">•</span>
              <span>{result.releaseDate}</span>
            </>
          )}

          <Rating
            rating={typeof result.rating == "number" ? result.rating : 0}
          />
        </section>
      </div>
    </div>
  );
}

interface RatingProps {
  rating: number;
}

const Rating = ({ rating }: RatingProps) => {
  return (
    <div className="ml-auto flex items-center gap-0.5  text-white bg-opacity-80 rounded-md">
      <AiFillStar className="text-yellow-500" />
      <span className="text-yellow-500">{rating == 0 ? "?" : rating}</span>
    </div>
  );
};
