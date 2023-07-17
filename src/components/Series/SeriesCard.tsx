import { addSeriesList, removeSeriesList } from "@/utils";
import { IAnimeResult, IMovieResult, IMangaResult } from "@consumet/extensions";
import { useState } from "react";
import {
  AiFillTrophy,
  AiFillStar,
  AiOutlineStop,
  AiFillEye,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { toast } from "react-toastify";
import Skeleton from "../Skeleton";
import { Database } from "@/types/database.types";
import { Series } from "@/types/database";
import { ItemsState, Readlist, Watchlist } from "./SeriesEditor";
import { findItemById, moveBetweenContainers } from "./SeriesContainer";
import { RankModal } from "../Ranking/RankModal";
import RatingNumber from "../RatingNumber";

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
  isDragging?: boolean;
  style?: React.CSSProperties;
  listType: "readlist" | "watchlist";
  editable?: boolean;
  rankModalOpen: boolean;
  setRankModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  overlay: React.ReactNode;
  // item: Watchlist | Readlist;
  items: ItemsState;
  setItems: React.Dispatch<React.SetStateAction<ItemsState>>;
}

// interface OverlayProps {
//   moveC
// }

// function DroppedOverlay () {

// }

export default function SeriesCard({
  series,
  style,
  setItems,
  rankModalOpen,
  editable,
  setRankModalOpen,
  // item,
  overlay,
  items,
  isDragging,
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
      items[newContainer].length
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
      {!isDragging && editable && (
        <div className="absolute outline-none top-0 left-0 w-full h-72 rounded-sm bg-black bg-opacity-80 flex items-center flex-col justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer">
          {overlay}
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
