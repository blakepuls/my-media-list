"use client";

import SeriesContainer from "./SeriesContainer";
import { useEffect, useRef, useState } from "react";
import { Ranking, Series } from "@/types/database";
import Test from "../Test";
import supabase from "@/utils/supabase-browser";

export type RankingData = Ranking & {
  series: Series;
};

export interface ItemsState {
  S: RankingData[];
  A: RankingData[];
  B: RankingData[];
  C: RankingData[];
  D: RankingData[];
  E: RankingData[];
}

interface SeriesEditorProps {
  list: RankingData[];
}

export default function RankingEditor({ list }: SeriesEditorProps) {
  const tiers: ItemsState = { S: [], A: [], B: [], C: [], D: [], E: [] };

  // Initialize the state
  const [items, setItems] = useState<ItemsState>(
    Object.keys(tiers).reduce((accumulator, key) => {
      const keyOfItemsState = key as keyof ItemsState;
      // Filter the items in the `list` for the ones in the current tier.
      const itemsInCurrentTier = list.filter(
        (item) => item.tier === keyOfItemsState
      );
      // Sort the items in the current tier by `tier_rank`.
      const sortedItemsInCurrentTier = itemsInCurrentTier.sort(
        (a, b) => a.tier_rank - b.tier_rank
      );
      // Add the sorted items to the accumulator under the current key.
      accumulator[keyOfItemsState] = sortedItemsInCurrentTier;
      return accumulator;
    }, tiers)
  );

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
            const { priority, series, ...rest } = item; // Here, we are excluding the `series` property by destructuring it separately
            return rest;
          });
        }
      );

      // Merge arrays into a single one
      const flattenedItemsData = itemsData.flat();
      console.log("itemsData", flattenedItemsData);

      console.log("flat", flattenedItemsData);

      const test = await supabase
        .from(`profile_rankings`)
        .upsert(flattenedItemsData);
    }, 3000);

    // Clear the timeout when the component unmounts
    return () => {
      if (updateTimeout.current) clearTimeout(updateTimeout.current);
    };
  }, [items]);

  return (
    <>
      <Test data={items} />
      <SeriesContainer items={items} setItems={setItems} list={list} />;
    </>
  );
}
