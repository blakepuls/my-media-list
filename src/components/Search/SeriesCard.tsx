import { addSeriesList, removeSeriesList } from "@/utils";
import { IAnimeResult, IMovieResult, IMangaResult } from "@consumet/extensions";
import { useEffect, useState } from "react";
import { AiFillTrophy, AiFillStar } from "react-icons/ai";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { toast } from "react-toastify";
import Skeleton from "../Skeleton";
import { RankModal } from "../Ranking/RankModal";
import { Ranking, Series } from "@/types/database";
import supabase from "@/utils/supabase-browser";
import { useAuth } from "@/hooks/auth";
import Tooltip from "../Tooltip";

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
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const [ranking, setRanking] = useState<Ranking | undefined>(undefined);
  // Series record in the database (Has more info than the result)
  const [dbSeries, setDbSeries] = useState<Series | undefined>(undefined);

  function listAdd(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.stopPropagation();
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

  function listRemove(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.stopPropagation();
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

  async function openRankModal(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.stopPropagation();
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) return;

    let seriesType = type.toLowerCase();
    if (seriesType === "movie") {
      seriesType = result.type === "Movie" ? "movie" : "tv";
    }

    console.log("series type is", seriesType);

    // Get series from series list
    const res = await fetch(`/api/series/${seriesType}/${result.id}`);
    const data = await res.json();

    console.log(res, data);

    //If it fails to get the series, return
    if (res.status !== 200) {
      toast.error("Failed to get series");
      return;
    }

    setDbSeries(data);

    // Get ranking from rankings list
    const { data: rankingData } = await supabase
      .from("profile_rankings")
      .select("*")
      .eq("profile_id", user.user.id)
      .eq("series_id", data.id)
      .single();

    console.log("the ranking data is", rankingData);

    setRanking(rankingData || undefined);

    setRankModalOpen(true);
  }

  return (
    <div
      className="relative flex flex-col  rounded-md w-52 group"
      onClick={() => console.log(result)}
    >
      {dbSeries && (
        <RankModal
          isOpen={rankModalOpen}
          series={{
            banner: dbSeries.banner || "",
            id: dbSeries.id,
            title: dbSeries.title,
          }}
          setOpen={setRankModalOpen}
          onSubmit={() => {}}
          ranking={ranking}
        />
      )}
      <img
        src={result.image}
        alt={result.title.toString()}
        className="w-full h-72 rounded-sm shadow-md object-cover group-hover:blur-sm group-hover:opacity-40"
      />
      <div className="absolute top-0 left-0 w-full h-72 rounded-sm bg-transparent bg-opacity-80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer">
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
        <button
          className="m-2 flex items-center group gap-1 rounded-md hover:scale-125 transition-transform p-1"
          onClick={openRankModal}
        >
          <AiFillTrophy className="  transition-colors" />
          Rank
        </button>
      </div>

      <div className="flex flex-col gap-0.5  h-14 p-1">
        {/* <h1 className="whitespace-nowrap text-left font-semibold overflow-hidden">
          {result.title.toString()}
        </h1> */}
        <Tooltip text={result.title.toString()} length={20} />

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
