import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import React from "react";
import { Watchlist, Readlist } from "@/types/database";

interface DroppableProps {
  id: string;
  items: Array<string>;
  seriesList: Watchlist[] | Readlist;
}

const Droppable = ({ id, items }: DroppableProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
      <div
        ref={setNodeRef}
        className="bg-gray-900 p-3 rounded-md shadow-md flex gap-3 w-96 flex-wrap"
      >
        {items.map((item) => (
          <SortableItem key={item} id={item} />
        ))}
      </div>
    </SortableContext>
  );
};

export default Droppable;
