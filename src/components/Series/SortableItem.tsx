import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SeriesCard from "./SeriesCard";
import { Ranking, Series } from "@/types/database";
import { ItemsState, Readlist, Watchlist } from "./SeriesEditor";
import RichSeriesCard from "../RichSeriesCard";
import Test from "../Test";

interface SortableItemProps {
  id: string;
  key: string;
  series: Series;
  items: ItemsState;
  setItems: React.Dispatch<React.SetStateAction<ItemsState>>;
  listType: "readlist" | "watchlist";
}

export const SortableItem = ({
  id,
  key,
  series,
  items,
  setItems,
  listType,
}: SortableItemProps) => {
  const [rankModalOpen, setRankModalOpen] = useState(false);

  const item = items["watching"].find((item) => item.series.id === series.id);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id, disabled: rankModalOpen });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function onSubmit(updatedRanking: Ranking) {
    setItems((prevItems) => {
      // console.log(prevItems["idle"]);
      // const oldItem = Object.values(prevItems).find((item) =>
      //   item.find((item: any) => item.series.id === series.id)
      // )[0];
      // console.log("THIS IS A TEST", oldItem);
      // return prevItems;

      // // Create a deep copy of the previous state
      let newState = JSON.parse(JSON.stringify(prevItems));

      // // Find the series in the list that was updated, look through every key in the itemstate
      const oldItem = Object.values(prevItems).find((item) =>
        item.find((item: any) => item.series.id === series.id)
      )[0];

      // // Update the item in the list with the new .ranking
      newState[oldItem.status] = newState[oldItem.status].map((item: any) => {
        if (item.id === oldItem.id) {
          item.ranking = updatedRanking;
          return item;
        } else {
          return item;
        }
      });

      // Remove old item from its container
      // newState[oldItem.status] = newState[oldItem.status].filter(
      //   (item: any) => item.id !== oldItem.id
      // );

      return newState;
    });
  }

  return (
    <div
      style={itemStyle as any}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {item ? (
        <RichSeriesCard
          id={id}
          onSubmit={onSubmit}
          series={item.series}
          ranking={item.ranking}
        />
      ) : (
        <SeriesCard
          setRankModalOpen={setRankModalOpen}
          rankModalOpen={rankModalOpen}
          listType={listType}
          items={items}
          setItems={setItems}
          series={series}
        />
      )}
    </div>
  );
};

export default SortableItem;
