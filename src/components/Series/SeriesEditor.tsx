"use client";

import { Database } from "@/types/database.types";
import SeriesContainer from "./SeriesContainer";
import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import SeriesCard from "./SeriesCard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type Series = Database["public"]["Tables"]["series"]["Row"];
type Watchlist = (Database["public"]["Tables"]["profile_watchlists"]["Row"] & {
  series: Series;
})[];
type Readlist = (Database["public"]["Tables"]["profile_readlists"]["Row"] & {
  series: Series;
})[];

interface SeriesEditorProps {
  list: Watchlist | Readlist;
}

export default function SeriesEditor({ list }: SeriesEditorProps) {
  // const [series, setSeries] = useState<Series[]>(
  //   list?.map((item) => item.series)
  // );

  // const containers = ["A", "B", "C"];
  // const [parent, setParent] = useState(null);
  // const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;

  // function handleDragEnd(event: any) {
  //   const { over } = event;

  //   // If the item is dropped over a container, set it as the parent
  //   // otherwise reset the parent to `null`
  //   setParent(over ? over.id : null);
  // }

  return <SeriesContainer />;
}
