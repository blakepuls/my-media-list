import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SeriesCard from "./SeriesCard";
import { Series } from "@/types/database";

interface SortableItemProps {
  id: string;
  series: Series;
}

export const SortableItem = (props: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      style={itemStyle as any}
      ref={setNodeRef}
      className="bg-gray-950 p-3 rounded-md shadow-md"
      {...attributes}
      {...listeners}
    >
      <SeriesCard series={props.series} />
    </div>
  );
};

export default SortableItem;
