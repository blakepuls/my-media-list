import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SeriesCard from "./SeriesCard";
import { Ranking, Series, SeriesListStatus } from "@/types/database";
import { ItemsState, Readlist, Watchlist } from "./SeriesEditor";
import RichSeriesCard from "../RichSeriesCard";
import Test from "../Test";
import { findItemById, moveBetweenContainers } from "./SeriesContainer";
import {
  AiFillEye,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineStop,
} from "react-icons/ai";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import supabase from "@/utils/supabase-browser";
import { RankingResult } from "../Ranking/RankModal";
import { useAuth } from "@/hooks/auth";
import { usePathname } from "next/navigation";

interface SortableItemProps {
  id: string;
  key: string;
  series: Series;
  items: ItemsState;
  setItems: React.Dispatch<React.SetStateAction<ItemsState>>;
  listType: "readlist" | "watchlist";
  container: SeriesListStatus;
}

interface SeriesCardOverlayProps {
  container: SeriesListStatus;
  onDelete: () => void;
  moveToContainer: (container: SeriesListStatus) => void;
}

function SeriesCardOverlay({
  container,
  moveToContainer,
  onDelete,
}: SeriesCardOverlayProps) {
  const className =
    "m-2 flex items-center gap-1 rounded-md hover:scale-125 transition-transform p-1";

  if (container == "idle")
    return (
      <>
        <button
          onMouseUp={(e) => {
            e.stopPropagation();
            moveToContainer("watching");
          }}
          className={className}
        >
          <AiOutlineEye />
          Watching
        </button>
        <button
          onMouseUp={(e) => {
            e.stopPropagation();
            moveToContainer("dropped");
          }}
          className={className}
        >
          <AiOutlineStop />
          Dropped
        </button>
        <button
          onMouseUp={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={className}
        >
          <AiOutlineClose />
          Delete
        </button>
      </>
    );

  if (container == "dropped")
    return (
      <>
        <button
          onMouseUp={() => moveToContainer("watching")}
          className={className}
        >
          <AiFillEye />
          Watching
        </button>
        <button onMouseUp={() => moveToContainer("idle")} className={className}>
          <BsFillBookmarkPlusFill />
          Watchlist
        </button>
        <button onMouseUp={onDelete} className={className}>
          <AiOutlineClose />
          Delete
        </button>
      </>
    );
}

export const SortableItem = ({
  id,
  key,
  container,
  series,
  items,
  setItems,
  listType,
}: SortableItemProps) => {
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const usernameSlug = usePathname().split("/")[2];
  const { profile } = useAuth();
  const editable = usernameSlug == profile?.username;
  const item = items["watching"].find((item) => item.series.id === series.id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    disabled: rankModalOpen || !editable,
  });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function moveToContainer(newContainer: keyof ItemsState) {
    const itemLocation = findItemById(items, id);
    if (!itemLocation || itemLocation.container === newContainer) return;

    const newItems = moveBetweenContainers(
      items,
      itemLocation.container,
      itemLocation.index,
      newContainer,
      items[newContainer].length
    );
    setItems(newItems);
  }

  function onWatchlist() {
    // Move the item from it's current container to the watchlist container
    moveToContainer("idle");
  }

  function onDrop() {
    // Move the item from it's current container to the dropped container
    moveToContainer("dropped");
  }

  async function onDelete() {
    // Delete the item from the database
    await supabase.from(`profile_${listType}s`).delete().eq("series_id", id);
    // Delete the item from the items state
    setItems((prevItems) => {
      let newState = JSON.parse(JSON.stringify(prevItems));
      for (let key in newState) {
        newState[key] = newState[key].filter(
          (item: any) => item.series.id !== series.id
        );
      }
      return newState;
    });
  }

  async function onComplete(ranking: RankingResult) {
    // Remove the item from the watchlist
    await supabase.from(`profile_${listType}s`).delete().eq("series_id", id);
    setItems((prevItems) => {
      let newState = JSON.parse(JSON.stringify(prevItems));
      for (let key in newState) {
        newState[key] = newState[key].filter(
          (item: any) => item.series.id !== series.id
        );
      }
      return newState;
    });
  }

  function onSubmit(updatedRanking: Ranking) {
    setItems((prevItems) => {
      let newState = JSON.parse(JSON.stringify(prevItems));

      // Find oldItem in the items state, each key is an array and the item is in
      const flattenedItems = Object.values(prevItems).flat();
      const oldItem = flattenedItems.find(
        (item: any) => item.series.id === series.id
      );

      newState[oldItem.status] = newState[oldItem.status].map((item: any) => {
        if (item.id === oldItem.id) {
          item.ranking = updatedRanking;
          return item;
        } else {
          return item;
        }
      });

      return newState;
    });
  }

  return (
    <div
      style={itemStyle as any}
      className={`touch-none ${container == "watching" && "w-full sm:w-auto"}`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {item ? (
        <RichSeriesCard
          id={id}
          editable={editable}
          setModalOpen={setRankModalOpen}
          onComplete={onComplete}
          onDrop={onDrop}
          onWatchlist={onWatchlist}
          onSubmit={onSubmit}
          series={item.series}
          ranking={item.ranking}
        />
      ) : (
        <SeriesCard
          editable={editable}
          setRankModalOpen={setRankModalOpen}
          rankModalOpen={rankModalOpen}
          isDragging={isDragging}
          overlay={
            <SeriesCardOverlay
              onDelete={onDelete}
              container={container}
              moveToContainer={moveToContainer}
            />
          }
          listType={listType}
          items={items}
          setItems={setItems}
          series={series}
        />
      )}
    </div>
  );
};

export default SortableItem;
