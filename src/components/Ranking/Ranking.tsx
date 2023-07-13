import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Series } from "@/types/database";
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

export const Ranking = ({ id, rank }: RankingItemProps) => {
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const tier = Tiers[rank.tier];

  function editRanking() {
    setRankModalOpen(true);
  }

  return (
    <div className="w-96 flex flex-col relative overflow-hidden rounded-t-sm bg-gray-900">
      <RankModal
        isOpen={rankModalOpen}
        setOpen={setRankModalOpen}
        onSubmit={() => {}}
        series={rank.series}
        ranking={rank}
        // onClose={() => setRankModalOpen(false)}
      />
      <section className="relative">
        <img
          src={rank.series.banner || ""}
          alt={rank.series.title}
          className="w-full h-28 object-cover opacity-40 "
        />
        <img src={rank.series.image} className="w-28 absolute top-5 left-5" />
        <section className="absolute bottom-0 left-0 ml-[9.25rem] w-auto flex ">
          <h1 className=" text-2xl font-bold text-white">
            {rank.series.title}
          </h1>
        </section>
        <BsThreeDots
          onMouseDown={editRanking}
          className="absolute top-1 right-3 text-white text-3xl transition hover:text-primary-500"
        />
      </section>
      <section className="bg-gray-900 h-[5.5rem] w-full ">
        <div className="absolute top-5 left-5 flex"></div>
        <section className="ml-[8.3rem] p-4 flex gap-3 ">
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
      <ProgressBar progress={rank.progress} />
    </div>
  );
};

export default Ranking;
