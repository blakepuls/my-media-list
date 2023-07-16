import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import React from "react";
import { Series } from "@/types/database";
import { ItemsState, RankingData } from "./RankingEditor";

interface DroppableProps {
  id: string;
  rankings: RankingData[];
  items: ItemsState;
  setItems: React.Dispatch<React.SetStateAction<ItemsState>>;
}

const Droppable = ({ id, rankings, setItems, items }: DroppableProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext id={id} items={rankings} strategy={rectSortingStrategy}>
      <div
        ref={setNodeRef}
        className="rounded-md flex gap-3 w-full min-h-[11.5rem] flex-wrap  "
      >
        {rankings.map((item) => (
          <SortableItem
            items={items}
            setItems={setItems}
            rank={item}
            key={item.id}
            id={item.id}
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default Droppable;
