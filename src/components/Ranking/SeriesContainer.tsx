import React, { Dispatch, SetStateAction, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  rectIntersection,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Database } from "@/types/database.types";
import { CSS } from "@dnd-kit/utilities";
import { SortableItem } from "./SortableItem";
import Droppable from "./Droppable";

import { arrayMove, insertAtIndex, removeAtIndex } from "@/utils/array";
import { ItemsState, RankingData } from "./RankingEditor";
import { Ranking, RankingTiers, Series } from "@/types/database";

// type Ranking = Database["public"]["Tables"]["series"]["Row"];

interface SeriesRowProps {
  // series: Array<Series>;
  // setSeries: (series: Array<Series>) => void;
  // children?: React.ReactNode;
  // id: string;
}

interface SeriesContainerProps {
  list: RankingData[];
  items: ItemsState;

  setItems: Dispatch<SetStateAction<ItemsState>>;
}

const SeriesContainer: React.FC<SeriesContainerProps> = ({
  list,
  items,
  setItems,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragOver = ({ over, active }: any) => {};

  const handleDragEnd = ({ active, over }: any) => {
    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const activeContainer = active.data.current.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId || over.id;
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index || 0;

      setItems((items) => {
        let newItems;
        if (activeContainer === overContainer) {
          newItems = {
            ...items,
            [overContainer]: arrayMove(
              items[overContainer as RankingTiers],
              activeIndex,
              overIndex
            ),
          };
          // Update the priority of each item in the overContainer to match its index
          newItems[overContainer as RankingTiers] = newItems[
            overContainer as RankingTiers
          ].map((item, index) => ({
            ...item,
            priority: index + 1, // since priority starts from 1
          }));
        } else {
          // Replace active.id with the itemToMove
          newItems = moveBetweenContainers(
            items,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            active.id
          );
        }

        return newItems;
      });
    }
  };

  const containerStyle = { display: "flex" };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex flex-col gap-5  p-3 w-full">
        {Object.keys(items).map((key) => {
          return (
            <div key={key} className="flex flex-col gap-5 w-full ">
              <h2 className="text-3xl font-bold text-gray-100">{key}</h2>
              <Droppable
                items={items}
                setItems={setItems}
                id={key}
                rankings={items[key as RankingTiers]}
                // series={items[key as RankingTiers].map((item) => item.series)}
                key={key}
              />
            </div>
          );
        })}
      </div>
    </DndContext>
  );
};

export const moveBetweenContainers = (
  items: ItemsState,
  activeContainer: keyof ItemsState,
  activeIndex: number,
  overContainer: keyof ItemsState,
  overIndex: number,
  itemId: string
) => {
  const itemToMove = items[activeContainer][activeIndex];

  let newItems = {
    ...items,
    [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
    [overContainer]: insertAtIndex(items[overContainer], overIndex, itemToMove),
  };

  newItems[overContainer] = newItems[overContainer].map((item, index) => ({
    ...item,
    status: overContainer as RankingTiers,
    priority: index + 1, // update the priority to match the index
  }));

  return newItems;
};

export default SeriesContainer;
