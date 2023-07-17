import React, { useEffect, useState } from "react";
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
import { RankModal, RankingResult } from "../Ranking/RankModal";
import ThreeDots from "../ThreeDots";
// import { RankModal } from "./RankModal";

interface RichSeriesCardProps {
  id: string;
  ranking?: Ranking;
  series: Series;
  editable?: boolean;
  onSubmit: (updatedRanking: Ranking) => void;
  onComplete?: (result: RankingResult) => void;
  onWatching?: (result: RankingResult) => void;
  onWatchlist?: (result: RankingResult) => void;
  onDelete?: () => void;
  onDrop?: (result: RankingResult) => void;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RichSeriesCard = ({
  id,
  series,
  ranking,
  onSubmit,
  onComplete,
  editable,
  onWatchlist,
  onWatching,
  setModalOpen,
  onDelete,
  onDrop,
}: RichSeriesCardProps) => {
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const tier = Tiers[ranking?.tier || "S"];

  useEffect(() => {
    setModalOpen && setModalOpen(rankModalOpen);
  }, [rankModalOpen]);

  function editRanking() {
    setRankModalOpen(true);
  }

  function onRankingDelete() {
    if (onDelete) onDelete();
    setRankModalOpen(false);
  }

  async function onRankingWatching(result: RankingResult) {
    if (onWatching) await onWatching(result);
    setRankModalOpen(false);
  }

  return (
    <div className="w-full sm:w-96 flex flex-col relative overflow-hidden rounded-t-sm bg-gray-900 ">
      <RankModal
        isOpen={rankModalOpen}
        setOpen={setRankModalOpen}
        onSubmit={onSubmit}
        onComplete={onComplete}
        onWatchlist={onWatchlist}
        onWatching={onWatching && onRankingWatching}
        onDelete={onDelete && onRankingDelete}
        onDrop={onDrop}
        series={series}
        ranking={ranking}
        // onClose={() => setRankModalOpen(false)}
      />
      <div className="absolute bottom-0 w-full">
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
        {editable && (
          <ThreeDots
            onMouseDown={editRanking}
            className="absolute top-1 right-1 text-white text-5xl transition hover:text-primary-500"
          />
        )}
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
