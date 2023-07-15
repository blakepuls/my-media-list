"use client";

import { Database } from "@/types/database.types";
import SeriesContainer from "./SeriesContainer";
import { useEffect, useRef, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import SeriesCard from "./SeriesCard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Test from "../Test";
import supabase from "@/utils/supabase-browser";
import { Ranking } from "@/types/database";

type Series = Database["public"]["Tables"]["series"]["Row"];
export type Watchlist =
  Database["public"]["Tables"]["profile_watchlists"]["Row"] & {
    series: Series;
    ranking: Ranking;
  };
export type Readlist =
  Database["public"]["Tables"]["profile_readlists"]["Row"] & {
    series: Series;
    ranking: Ranking;
  };

export interface ItemsState {
  watching: Watchlist[] | Readlist[];
  idle: Watchlist[] | Readlist[];
  dropped: Watchlist[] | Readlist[];
}

interface SeriesEditorProps {
  list: Watchlist[] | Readlist[];
  listType: "watchlist" | "readlist";
}

export default function SeriesEditor({ list, listType }: SeriesEditorProps) {
  const [items, setItems] = useState<ItemsState>({
    watching: list
      ?.filter((item) => item.status === "watching")
      .sort((a, b) => a.priority - b.priority),
    idle: list
      ?.filter((item) => item.status === "idle")
      .sort((a, b) => a.priority - b.priority),
    dropped: list
      ?.filter((item) => item.status === "dropped")
      .sort((a, b) => a.priority - b.priority),
  });

  const updateTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If there's an existing timeout, clear it
    if (updateTimeout.current !== null) {
      clearTimeout(updateTimeout.current);
    }

    // Set a new timeout
    updateTimeout.current = setTimeout(async () => {
      // Map the items to the correct format
      const itemsData = Object.entries(items).map(
        ([status, containerItems]) => {
          return containerItems.map((item: any) => {
            const { ranking, series, ...rest } = item; // Here, we are excluding the `series` property by destructuring it separately
            return rest;
          });
        }
      );

      // Merge arrays into a single one
      const flattenedItemsData = itemsData.flat();
      console.log("itemsData", flattenedItemsData);

      const test = await supabase
        .from(`profile_${listType}s`)
        .upsert(flattenedItemsData);
      // .then(console.log);

      console.log("test", test);
    }, 3000);

    // Clear the timeout when the component unmounts
    return () => {
      if (updateTimeout.current) clearTimeout(updateTimeout.current);
    };
  }, [items]);

  // if (!list) return null;

  return (
    <SeriesContainer
      items={items}
      setItems={setItems}
      list={list}
      listType={listType}
    />
  );
}
