import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Ranking, Series } from "@/types/database";
import { ItemsState, RankingData } from "@/components/Ranking/RankingEditor";
import { Tiers } from "../TierSelect";
import RatingNumber from "../RatingNumber";
import {
  AiFillStar,
  AiFillTrophy,
  AiOutlineClose,
  AiOutlineEllipsis,
  AiOutlineEye,
  AiOutlineStop,
} from "react-icons/ai";
import ProgressBar from "../Progress";
import { BsThreeDots } from "react-icons/bs";
import { RankModal } from "../Ranking/RankModal";
import ThreeDots from "../ThreeDots";
// import { RankModal } from "./RankModal";

interface RichSeriesCardProps {
  id: string;
  ranking?: Ranking;
  series: Series;
  onSubmit: (updatedRanking: Ranking) => void;
}

export const RichSeriesCard = ({
  id,
  series,
  ranking,
  onSubmit,
}: RichSeriesCardProps) => {
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const tier = Tiers[ranking?.tier || "S"];

  function editRanking() {
    setRankModalOpen(true);
  }

  // function onSubmit(updatedRanking: Ranking) {
  //   setItems((prevItems) => {
  //     // Create a deep copy of the previous state
  //     let newState = JSON.parse(JSON.stringify(prevItems));

  //     // Remove old ranking from its tier
  //     newState[ranking.tier] = newState[ranking.tier].filter(
  //       (item: any) => item.id !== ranking.id
  //     );

  //     // Add the updated ranking to its new tier
  //     newState[updatedRanking.tier] = [
  //       ...newState[updatedRanking.tier],
  //       updatedRanking,
  //     ];

  //     return newState;
  //   });
  // }

  return (
    <div className="w-96 flex flex-col relative overflow-hidden rounded-t-sm bg-gray-900 ">
      <RankModal
        isOpen={rankModalOpen}
        setOpen={setRankModalOpen}
        onSubmit={onSubmit}
        series={series}
        ranking={ranking}
        // onClose={() => setRankModalOpen(false)}
      />
      <div className="absolute bottom-0 w-full bg-red-500">
        <ProgressBar progress={ranking?.progress || 0} />
      </div>
      <section className="relative">
        <div className="w-full h-28 relative shadow-glow">
          <img
            src={series.banner || ""}
            alt={series.title}
            className="w-full h-full object-cover opacity-40 absolute"
          />
        </div>

        <img
          src={series.image}
          className="w-28 absolute top-3 left-3 rounded-sm shadow-md h-40 "
        />
        <section className="absolute bottom-0 left-0 ml-[8.1rem] w-auto flex ">
          <h1 className=" text-2xl font-bold text-white">{series.title}</h1>
        </section>
        <ThreeDots
          onMouseDown={editRanking}
          className="absolute top-3 right-3 text-white text-5xl transition hover:text-primary-500"
        />
      </section>
      <section className="bg-gray-900 h-[4.5rem] w-full ">
        <div className="absolute top-5 left-5 flex"></div>
        {ranking && (
          <section className="ml-[7.75rem] p-2 flex gap-3 ">
            <h1
              className={`text-2xl w-7 text-center rounded-sm p-1 font-bold text-white ${tier.color}`}
            >
              {tier.letter}
            </h1>
            <div className=" flex items-center gap-0.5 text-xl text-white bg-opacity-80 rounded-md">
              <AiFillStar className="text-yellow-500" />
              <span className="text-yellow-500">
                {typeof ranking?.rating === "number" && ranking?.rating !== 0
                  ? ranking?.rating
                  : "?"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xl ml-auto">
              <AiOutlineEye className="text-white" />
              <span className="text-white">{ranking?.watch_count || 0}</span>
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default RichSeriesCard;
