import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Ranking, Series } from "@/types/database";
import { ItemsState, RankingData } from "./RankingEditor";
import RankingItem from "./Ranking";
import RichSeriesCard from "../RichSeriesCard";
import supabase from "@/utils/supabase-browser";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { addSeriesList } from "@/utils";
import { toast } from "react-toastify";

interface SortableItemProps {
  id: string;
  rank: RankingData;
  items: ItemsState;
  setItems: React.Dispatch<React.SetStateAction<ItemsState>>;
}

export const SortableItem = ({
  id,
  rank,
  items,
  setItems,
}: SortableItemProps) => {
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const usernameSlug = usePathname().split("/")[2];
  const { profile } = useAuth();
  const editable = usernameSlug == profile?.username;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id, disabled: rankModalOpen || !editable });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function onSubmit(updatedRanking: Ranking) {
    console.log("UPDATED RANKING", updatedRanking);
    setItems((prevItems) => {
      // Create a deep copy of the previous state
      let newState = JSON.parse(JSON.stringify(prevItems));

      // Remove old ranking from its tier
      newState[rank.tier] = newState[rank.tier].filter(
        (item: any) => item.id !== rank.id
      );

      // Add the updated ranking to its new tier
      newState[updatedRanking.tier] = [
        ...newState[updatedRanking.tier],
        updatedRanking,
      ];

      return newState;
    });
  }

  async function onDelete() {
    await supabase.from("profile_rankings").delete().eq("id", rank.id);

    setItems((prevItems) => {
      // Create a deep copy of the previous state
      let newState = JSON.parse(JSON.stringify(prevItems));

      // Remove old ranking from its tier
      newState[rank.tier] = newState[rank.tier].filter(
        (item: any) => item.id !== rank.id
      );

      return newState;
    });
  }

  async function onWatching() {
    if (!profile) return;

    const listType = rank.series.type === "manga" ? "readlist" : "watchlist";

    const promise = async () =>
      supabase.from(`profile_${listType}s`).insert([
        {
          priority: 0,
          profile_id: profile.id,
          series_id: rank.series.id,
          ranking_id: rank.id,
          status: "watching",
        },
      ]);

    await toast.promise(promise, {
      pending: "Adding to watchlist...",
      success: "Added to watchlist!",
      error: "Error adding to watchlist",
    });
  }

  return (
    <div
      style={itemStyle as any}
      ref={setNodeRef}
      className="w-full sm:w-auto touch-none "
      {...attributes}
      {...listeners}
    >
      {/* <RichSeriesCard
        id={rank.id}
        items={items}
        setItems={setItems}
        rank={rank}
      /> */}
      <RichSeriesCard
        setModalOpen={setRankModalOpen}
        onDelete={onDelete}
        editable={editable}
        onWatching={onWatching}
        ranking={rank}
        series={rank.series}
        onSubmit={onSubmit}
        id={id}
      />
    </div>
  );
};

export default SortableItem;
