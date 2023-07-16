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
import SeriesCard from "./SeriesCard";
import { Database } from "@/types/database.types";
import { CSS } from "@dnd-kit/utilities";
import { SortableItem } from "./SortableItem";
import Droppable from "./Droppable";

import { arrayMove, insertAtIndex, removeAtIndex } from "../../utils/array";
import { ItemsState, Readlist, Watchlist } from "./SeriesEditor";

type Series = Database["public"]["Tables"]["series"]["Row"];

interface SeriesRowProps {
  // series: Array<Series>;
  // setSeries: (series: Array<Series>) => void;
  // children?: React.ReactNode;
  // id: string;
}

interface SeriesContainerProps {
  list: Watchlist[] | Readlist[];
  listType: "watchlist" | "readlist";
  items: ItemsState;

  setItems: Dispatch<SetStateAction<ItemsState>>;
}

const SeriesContainer: React.FC<SeriesContainerProps> = ({
  listType,
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

  function findContainer(
    id: string,
    items: ItemsState
  ): keyof ItemsState | null {
    console.log("FIND CONTAINER", id, items);
    for (const key in items) {
      if (
        items[key as keyof ItemsState].some((item) => item.series_id === id)
      ) {
        return key as keyof ItemsState;
      }
    }

    return null;
  }

  const handleDragOver = ({ active, over, draggingRect }: any) => {
    if (!over) return;

    const { id: activeId } = active;
    const { id: overId } = over;

    console.log("ACTIVE ", activeId, "\n", "OVER ", overId);

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
      const activeIndex = activeItems.findIndex(
        (item) => item.series_id === activeId
      );
      const overIndex = overItems.findIndex(
        (item) => item.series_id === overId
      );

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
        newIndex
      );

      return prev;
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
              items[overContainer as "watching" | "idle" | "dropped"],
              activeIndex,
              overIndex
            ),
          };
          // Update the priority of each item in the overContainer to match its index
          newItems[overContainer as "watching" | "idle" | "dropped"] = newItems[
            overContainer as "watching" | "idle" | "dropped"
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
            overIndex
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
      <div className="flex flex-col gap-5 w-full  p-3">
        {items.watching.length > 0 && (
          <>
            <h2 className="text-3xl font-bold text-gray-100">
              Currently {listType == "watchlist" ? "Watching" : "Reading"}
            </h2>
            <Droppable
              listType={listType}
              items={items}
              setItems={setItems}
              id="watching"
              series={items.watching.map((item) => item.series)}
              key="watching"
            />
          </>
        )}

        {items.idle.length > 0 && (
          <>
            <h2 className="text-3xl font-bold text-gray-100">
              {listType == "watchlist" ? "Watchlist" : "Readlist"}
            </h2>
            <Droppable
              listType={listType}
              items={items}
              setItems={setItems}
              id="idle"
              series={items.idle.map((item) => item.series)}
              key="idle"
            />
          </>
        )}

        {items.dropped.length > 0 && (
          <>
            <h2 className="text-3xl font-bold text-gray-100">Dropped</h2>
            <Droppable
              listType={listType}
              items={items}
              setItems={setItems}
              id="dropped"
              series={items.dropped.map((item) => item.series)}
              key="dropped"
            />
          </>
        )}
      </div>
    </DndContext>
  );
};

export function findItemById(
  items: ItemsState,
  id: string
): { container: keyof ItemsState; index: number } | null {
  for (const container in items) {
    const index = items[container as keyof ItemsState].findIndex(
      (item: Watchlist | Readlist) => item.series.id === id
    );
    if (index !== -1) {
      return { container: container as keyof ItemsState, index };
    }
  }
  return null;
}

export const moveBetweenContainers = (
  items: ItemsState,
  activeContainer: keyof ItemsState,
  activeIndex: number,
  overContainer: keyof ItemsState,
  overIndex: number
) => {
  const itemToMove = items[activeContainer][activeIndex];

  let newItems = {
    ...items,
    [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
    [overContainer]: insertAtIndex(items[overContainer], overIndex, itemToMove),
  };

  newItems[overContainer] = newItems[overContainer].map((item, index) => ({
    ...item,
    status: overContainer as "watching" | "idle" | "dropped",
    priority: index + 1, // update the priority to match the index
  }));

  return newItems;
};

export default SeriesContainer;
