import { addSeriesList, removeSeriesList } from "@/utils";
import { IAnimeResult, IMovieResult, IMangaResult } from "@consumet/extensions";
import { useState } from "react";
import {
  AiFillTrophy,
  AiFillStar,
  AiOutlineStop,
  AiFillEye,
  AiOutlineCheck,
} from "react-icons/ai";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { toast } from "react-toastify";
import Skeleton from "../Skeleton";
import { Database } from "@/types/database.types";
import { Series } from "@/types/database";
import { ItemsState, Readlist, Watchlist } from "./SeriesEditor";
import { moveBetweenContainers } from "./SeriesContainer";
import { RankModal } from "../Ranking/RankModal";
import RatingNumber from "../RatingNumber";

function findItemById(
  items: ItemsState,
  id: string
): { container: keyof ItemsState; index: number } | null {
  for (const container in items) {
    const index = items[container as keyof ItemsState].findIndex(
      (item: Watchlist | Readlist) => item.series.id === id
    );
    if (index !== -1) {
      return { container: container as keyof ItemsState, index };
    }
  }
  return null;
}

export const insertAtIndex = (
  array: (Watchlist | Readlist)[],
  index: number,
  item: Watchlist | Readlist
): (Watchlist | Readlist)[] => {
  if (index < 0 || index > array.length) {
    console.error(`Cannot insert at index ${index}`);
    return array;
  }
  return [...array.slice(0, index), item, ...array.slice(index)];
};

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

interface SeriesCardProps {
  series: Database["public"]["Tables"]["series"]["Row"];
  dragging?: boolean;
  style?: React.CSSProperties;
  listType: "readlist" | "watchlist";
  rankModalOpen: boolean;
  setRankModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // item: Watchlist | Readlist;
  items: ItemsState;
  setItems: React.Dispatch<React.SetStateAction<ItemsState>>;
}

export default function SeriesCard({
  series,
  style,
  setItems,
  rankModalOpen,
  setRankModalOpen,
  // item,
  items,
  dragging: isDragging,
}: SeriesCardProps) {
  function moveToContainer(id: string, newContainer: keyof ItemsState) {
    const itemLocation = findItemById(items, id);
    if (!itemLocation) {
      console.error(`Could not find item with id ${id}`);
      return;
    }
    const newItems = moveBetweenContainers(
      items,
      itemLocation.container,
      itemLocation.index,
      newContainer,
      items[newContainer].length,
      id
    );
    setItems(newItems);
  }

  const item = Object.values(items)
    .flat()
    .find((s: any) => s?.series?.id == series?.id) as any | undefined;

  return (
    <div
      className={`cursor-pointer relative flex flex-col rounded-md w-52 select-none outline-none`}
      style={style}
    >
      <img
        src={series.image!}
        alt={series.title.toString()}
        className="w-full h-72 rounded-sm shadow-md object-cover"
      />
      {!isDragging && (
        <div className="absolute outline-none top-0 left-0 w-full h-72 rounded-sm bg-black bg-opacity-80 flex items-center flex-col justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer">
          <button
            onMouseUp={() => setRankModalOpen(true)}
            className="m-2 flex items-center gap-1 rounded-md hover:scale-125 transition-transform p-1"
          >
            <AiOutlineCheck />
            Complete
          </button>

          {item?.status != "watching" && (
            <button
              onMouseUp={() => moveToContainer(series.id, "watching")}
              className="m-2 flex items-center gap-1 rounded-md hover:scale-125 transition-transform p-1"
            >
              <AiFillEye />
              Watching
            </button>
          )}

          {item?.status != "idle" && (
            <button
              onMouseUp={() => moveToContainer(series.id, "idle")}
              className="m-2 flex items-center gap-1 rounded-md hover:scale-125 transition-transform p-1"
            >
              <BsFillBookmarkPlusFill />
              Watchlist
            </button>
          )}

          {item?.status != "dropped" && (
            <button
              onMouseUp={() => moveToContainer(series.id, "dropped")}
              className="m-2 flex items-center gap-1 rounded-md hover:scale-125 transition-transform p-1"
            >
              <AiOutlineStop />
              Dropped
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-0.5 overflow-hidden h-14 p-1 pb-0">
        <h1 className="whitespace-nowrap text-left font-semibold overflow-hidden">
          {series.title.toString()}
        </h1>

        <section className="flex items-center  text-gray-300">
          <span>
            {/* @ts-ignore */}
            {formatType(series.type)}
          </span>

          {series.release_date && (
            <>
              <span className="text-gray-700 mx-1">•</span>
              <span>{series.release_date.split("-")[0]}</span>
            </>
          )}

          <div className="ml-auto">
            <RatingNumber
              rating={typeof series.rating == "number" ? series.rating : 0}
            />
          </div>
        </section>
      </div>

      <RankModal
        series={series}
        isOpen={rankModalOpen}
        setOpen={setRankModalOpen}
        onSubmit={(e) => console.log(e)}
      />
    </div>
  );
}

function formatType(type: "movie" | "tv" | "manga") {
  // Extract year from date string
  if (type == "movie") return "Movie";
  if (type == "tv") return "TV Series";
  if (type == "manga") return "Manga";
}
