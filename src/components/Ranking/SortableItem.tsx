import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Ranking, Series } from "@/types/database";
import { ItemsState, RankingData } from "./RankingEditor";
import RankingItem from "./Ranking";
import RichSeriesCard from "../RichSeriesCard";

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

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id, disabled: true });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function onSubmit(updatedRanking: Ranking) {
    setItems((prevItems) => {
      // Create a deep copy of the previous state
      let newState = JSON.parse(JSON.stringify(prevItems));

      // Find the ranking that was updated
      const ranking = newState[updatedRanking.tier].find(
        (item: any) => item.id === updatedRanking.id
      );

      // Remove old ranking from its tier
      newState[ranking.tier] = newState[ranking.tier].filter(
        (item: any) => item.id !== ranking.id
      );

      // Add the updated ranking to its new tier
      newState[updatedRanking.tier] = [
        ...newState[updatedRanking.tier],
        updatedRanking,
      ];

      return newState;
    });
  }

  return (
    <div
      style={itemStyle as any}
      ref={setNodeRef}
      className="h-52"
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
        ranking={rank}
        series={rank.series}
        onSubmit={onSubmit}
        id={id}
      />
    </div>
  );
};

export default SortableItem;
