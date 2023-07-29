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
  closestCorners,
  TouchSensor,
  MouseSensor,
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
import { Tiers } from "../TierSelect";

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
    useSensor(MouseSensor),
    useSensor(TouchSensor),

    // useSensor(PointerSensor),
    // useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function findContainer(
    id: string,
    items: ItemsState
  ): keyof ItemsState | null {
    console.log("FIND CONTAINER", id, items);

    for (const key in items) {
      if (items[key as keyof ItemsState].some((item) => item.id === id)) {
        return key as keyof ItemsState;
      }
    }

    return null;
  }

  const handleDragOver = ({ active, over, draggingRect }: any) => {
    if (!over) return;

    const { id: activeId } = active;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = findContainer(activeId, items);
    const overContainer = over.data.current?.sortable.containerId || over.id;
    console.log("AID ", activeContainer, "\n", "OID ", overContainer);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer as keyof ItemsState];

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex((item) => item.id === activeId);
      const overIndex = overItems.findIndex((item) => item.id === overId);

      console.log("AIDX ", activeIndex, "\n", "OIDX ", overIndex);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect &&
          draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;
        const modifier = isBelowLastItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return moveBetweenContainers(
        prev,
        activeContainer,
        activeIndex,
        overContainer as keyof ItemsState,
        newIndex,
        activeId
      );
    });
  };

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
            // priority: index + 1, // since priority starts from 1
            tier_rank: index + 1,
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
      // collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex flex-col gap-5  p-3 w-full">
        {Object.keys(items).map((key) => {
          const tier = Tiers[key];
          return (
            <div
              key={key}
              className={`flex gap-10 w-full ${tier.color} bg-opacity-10`}
            >
              <h2
                className={`text-3xl font-bold text-gray-100  p-3 rounded-sm shadow-md ${tier.color}`}
              >
                {key}
              </h2>
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
    // status: overContainer as RankingTiers,
    tier: overContainer as RankingTiers,

    tier_rank: index + 1, // update the priority to match the index
  }));

  return newItems;
};

export default SeriesContainer;
