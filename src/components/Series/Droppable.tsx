import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import React from "react";
import { Series } from "@/types/database";
import { ItemsState } from "./SeriesEditor";

interface DroppableProps {
  id: string;
  series: Series[];
  items: ItemsState;
  setItems: React.Dispatch<React.SetStateAction<ItemsState>>;
  listType: "readlist" | "watchlist";
}

const Droppable = ({
  listType,
  id,
  series,
  setItems,
  items,
}: DroppableProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext id={id} items={series} strategy={rectSortingStrategy}>
      <div
        ref={setNodeRef}
        className="rounded-md flex gap-3 w-full min-h-[20rem] flex-wrap"
      >
        {series.map((item) => (
          <SortableItem
            listType={listType}
            items={items}
            setItems={setItems}
            series={item}
            key={item.id}
            id={item.id}
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default Droppable;
