import { addSeriesList, removeSeriesList } from "@/utils";
import { IAnimeResult, IMovieResult, IMangaResult } from "@consumet/extensions";
import { useState } from "react";
import { AiFillTrophy, AiFillStar } from "react-icons/ai";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { toast } from "react-toastify";

interface MediaResultProps {
  result: IAnimeResult | IMovieResult | IMangaResult;
  type: "Anime" | "Movie" | "Manga";
  onList: boolean;
  seriesId: number;
}

export function SeriesCard({
  result,
  type,
  onList,
  seriesId,
}: MediaResultProps) {
  const [isOnList, setIsOnList] = useState(onList);

  async function listAdd() {
    try {
      type === "Manga"
        ? await addSeriesList(result.id, "manga")
        : await addSeriesList(
            result.id,
            result.type === "Movie" ? "movie" : "tv"
          );
      setIsOnList(true);
      toast.success("Added to watchlist!");
    } catch (error: any) {
      if (error.message.includes("Series already")) {
        setIsOnList(true);
      }

      toast.error(error?.message);
    }
  }

  async function listRemove() {
    try {
      type === "Manga"
        ? await removeSeriesList(result.seriesId, "manga")
        : await removeSeriesList(
            result.seriesId,
            result.type === "Movie" ? "movie" : "tv"
          );
      setIsOnList(false);
      toast.success("Removed from watchlist!");
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  return (
    <div className="relative flex flex-col gap-0.5 rounded-md w-52 ">
      <img
        src={result.image}
        alt={result.title.toString()}
        className="w-full h-72 rounded-sm shadow-md object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-72 rounded-sm bg-black bg-opacity-80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer">
        {isOnList ? (
          <button
            className="m-2 flex items-center gap-1 rounded-md hover:scale-125 transition-transform p-1"
            onClick={listRemove}
          >
            <BsFillBookmarkPlusFill className="text-yellow-500" />
            Remove
          </button>
        ) : (
          <button
            className="m-2 flex items-center gap-1 rounded-md hover:scale-125 transition-transform p-1"
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

      <div className="flex flex-col gap-0.5 overflow-hidden h-14 ">
        <h1 className="whitespace-nowrap text-left font-semibold overflow-hidden">
          {type == "Movie"
            ? result.title.toString()
            : // @ts-ignore
              result.title.english || result.title.romaji}
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

          {typeof result.rating == "number" && (
            <Rating rating={result.rating} type={type} />
          )}
        </section>
      </div>
    </div>
  );
}

interface RatingProps {
  rating: number;
  type: "Movie" | "Anime" | "Manga";
}

interface RatingProps {
  rating: number;
  type: "Movie" | "Anime" | "Manga";
}

const Rating = ({ rating, type }: RatingProps) => {
  const formatRating = {
    Anime: (rating: number) => rating / 10,
    Manga: (rating: number) => rating / 10,
    Movie: (rating: number) => Math.round(rating * 10) / 10,
  };

  const formattedRating = formatRating[type]
    ? formatRating[type](rating)
    : rating;

  if (rating == 0) return null;

  return (
    <div className="ml-auto flex items-center gap-0.5  text-white bg-opacity-80 rounded-md">
      <AiFillStar className="text-yellow-500" />
      <span className="text-yellow-500">{formattedRating}</span>
    </div>
  );
};
