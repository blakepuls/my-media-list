import React, { useState } from "react";
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

import { arrayMove, insertAtIndex, removeAtIndex } from "./utils/array";

type Series = Database["public"]["Tables"]["series"]["Row"];

interface SeriesRowProps {
  // series: Array<Series>;
  // setSeries: (series: Array<Series>) => void;
  // children?: React.ReactNode;
  // id: string;
}

const SeriesContainer: React.FC<SeriesRowProps> = (
  {
    // series,
    // id,
    // children,
    // setSeries,
  }
) => {
  const [items, setItems] = useState({
    watching: ["1", "2", "3"],
    idle: ["4", "5", "6"],
    dropped: ["7", "8", "9"],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragOver = ({ over, active }: any) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId;

    if (!overContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;

        return moveBetweenContainers(
          items,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id
        );
      });
    }
  };

  const moveBetweenContainers = (
    items: any,
    activeContainer: any,
    activeIndex: any,
    overContainer: any,
    overIndex: any,
    item: any
  ) => {
    return {
      ...items,
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, item),
    };
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
        } else {
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
      <div className="flex flex-col gap-5  p-3">
        {Object.keys(items).map((group) => (
          <Droppable
            id={group}
            items={items[group as "watching" | "idle" | "dropped"]}
            key={group}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default SeriesContainer;
