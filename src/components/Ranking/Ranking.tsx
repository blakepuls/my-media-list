import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Ranking, Series } from "@/types/database";
import { ItemsState, RankingData } from "./RankingEditor";
import "./Ranking.css";
import { Tiers } from "../TierSelect";
import RatingNumber from "../RatingNumber";
import { AiFillStar, AiOutlineEye } from "react-icons/ai";
import ProgressBar from "../Progress";
import { BsThreeDots } from "react-icons/bs";
import { RankModal } from "./RankModal";

interface RankingItemProps {
  id: string;
  rank: RankingData;
  items: ItemsState;
  setItems: React.Dispatch<React.SetStateAction<ItemsState>>;
}

export const RankingItem = ({
  id,
  rank,
  items,
  setItems,
}: RankingItemProps) => {
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const tier = Tiers[rank.tier];

  function editRanking() {
    setRankModalOpen(true);
  }

  function onSubmit(updatedRanking: Ranking) {
    setItems((prevItems) => {
      // Create a deep copy of the previous state
      let newState = JSON.parse(JSON.stringify(prevItems));

      // Remove old ranking from its tier
      newState[rank.tier] = newState[rank.tier].filter(
        (item: any) => item.id !== rank.id
      );

      // Add the updated ranking to its new tier
      newState[updatedRanking.tier] = [
        ...newState[updatedRanking.tier],
        updatedRanking,
      ];

      return newState;
    });
  }

  return (
    <div className="w-96 flex flex-col relative overflow-hidden rounded-t-sm bg-gray-900">
      <RankModal
        isOpen={rankModalOpen}
        setOpen={setRankModalOpen}
        onSubmit={onSubmit}
        series={rank.series}
        ranking={rank}
        // onClose={() => setRankModalOpen(false)}
      />
      <section className="relative">
        <img
          src={rank.series.banner || ""}
          alt={rank.series.title}
          className="w-full h-28 object-cover opacity-40"
        />
        <img
          src={rank.series.image}
          className="w-28 z-10 absolute top-3 left-3 rounded-sm shadow-md"
        />
        <section className="absolute bottom-0 left-0 ml-[8.5rem] w-auto flex ">
          <h1 className=" text-2xl font-bold text-white">
            {rank.series.title}
          </h1>
        </section>
        <BsThreeDots
          onMouseDown={editRanking}
          className="absolute top-1 right-3 text-white text-3xl transition hover:text-primary-500"
        />
      </section>
      <section className="bg-gray-900 h-[5.05rem] w-full ">
        <div className="absolute top-5 left-5 flex"></div>
        <section className="ml-[7.75rem] p-3 flex gap-3 ">
          <h1
            className={`text-2xl w-7 text-center rounded-sm p-1 font-bold text-white ${tier.color}`}
          >
            {tier.letter}
          </h1>
          <div className=" flex items-center gap-0.5 text-xl text-white bg-opacity-80 rounded-md">
            <AiFillStar className="text-yellow-500" />
            <span className="text-yellow-500">
              {rank.rating == 0 ? "?" : rank.rating}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xl ml-auto">
            <AiOutlineEye className="text-white" />
            <span className="text-white">{rank.watch_count}</span>
          </div>
        </section>
      </section>
      <div className="absolute bottom-0 w-full">
        <ProgressBar progress={rank.progress} />
      </div>
    </div>
  );
};

export default RankingItem;
