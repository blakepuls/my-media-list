import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Series } from "@/types/database";
import { ItemsState, RankingData } from "./RankingEditor";
import Ranking from "./Ranking";

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
    useSortable({ id: id, disabled: rankModalOpen });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      style={itemStyle as any}
      ref={setNodeRef}
      className="w-full"
      {...attributes}
      {...listeners}
    >
      <Ranking id={rank.id} items={items} setItems={setItems} rank={rank} />
    </div>
  );
};

export default SortableItem;
