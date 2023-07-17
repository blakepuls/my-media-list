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

  return (
    <div
      style={itemStyle as any}
      ref={setNodeRef}
      className="w-full sm:w-auto "
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
        ranking={rank}
        series={rank.series}
        onSubmit={onSubmit}
        id={id}
      />
    </div>
  );
};

export default SortableItem;
