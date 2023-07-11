import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SeriesCard from "./SeriesCard";
import { Series } from "@/types/database";
import { ItemsState, Readlist, Watchlist } from "./SeriesEditor";

interface SortableItemProps {
  id: string;
  series: Series;
  items: ItemsState;
  setItems: React.Dispatch<React.SetStateAction<ItemsState>>;
  listType: "readlist" | "watchlist";
}

export const SortableItem = (props: SortableItemProps) => {
  const [rankModalOpen, setRankModalOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id, disabled: rankModalOpen });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      style={itemStyle as any}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <SeriesCard
        setRankModalOpen={setRankModalOpen}
        rankModalOpen={rankModalOpen}
        listType={props.listType}
        items={props.items}
        setItems={props.setItems}
        series={props.series}
      />
    </div>
  );
};

export default SortableItem;
