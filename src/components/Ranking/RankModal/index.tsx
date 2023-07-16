import { Ranking as Ranking, Series } from "@/types/database";
import Modal from "../../Modal";
import Slider from "../../Slider";
import { useState } from "react";
import { TierSelect, Tiers } from "../../TierSelect";
import supabase from "@/utils/supabase-browser";
import { toast } from "react-toastify";
import Counter from "@/components/Counter";
import { updateRanking } from "@/utils/rankings";
import { AiFillEye, AiOutlineCheck, AiOutlineStop } from "react-icons/ai";
import { BsFillBookmarkPlusFill } from "react-icons/bs";

export interface RankingResult {
  tier: Ranking["tier"];
  rating: number;
  tier_rank: number;
  watch_count: number;
  progress: number;
}

interface RankModalProps {
  fromList?: boolean;
  onComplete?: (result: RankingResult) => void;
  onWatchlist?: (result: RankingResult) => void;
  onDrop?: (result: RankingResult) => void;
  ranking?: Ranking;
  series: Series;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (SubmitResponse: Ranking) => void;
}

export function RankModal({
  ranking,
  series,
  isOpen,
  onWatchlist,
  onDrop,
  onComplete,
  setOpen,
  onSubmit,
}: RankModalProps) {
  const [tier, setTier] = useState<Ranking["tier"]>(ranking?.tier || "S");
  const [rating, setRating] = useState(ranking?.rating || 5);
  const [watch_count, setWatchCount] = useState(ranking?.watch_count || 1);
  const [progress, setProgress] = useState(ranking?.progress || 1);

  async function submit() {
    if (onSubmit) {
      toast
        .promise(
          updateRanking(series.id, {
            ...ranking,
            rating,
            tier,
            watch_count,
            progress,
          }),
          {
            pending: "Adding to rankings...",
            success: "Added to rankings!",
            error: {
              render({ data }: any) {
                return data.message;
              },
            },
          }
        )
        .then((data) => {
          onSubmit(data as any);
          setOpen(false);
        })
        .catch(() => {});
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      className="bg-gray-800 flex flex-col gap-1 outline-none rounded-md  m-auto items-center justify-center "
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onAfterClose={() => {}}
      onRequestClose={() => setOpen(false)}
    >
      <section className="flex h-auto outline-none ">
        <img
          className="w-80 rounded-l-md"
          src={series.image}
          alt={series.title}
        />
        <div className="flex flex-col gap-3 flex-grow p-3 w-80">
          <h1 className="font-bold text-xl">{series.title}</h1>
          <Slider
            label="Progress"
            min={0}
            max={100}
            step={1}
            initialValue={progress}
            onChange={setProgress}
          />
          <Slider
            label="Overall Rating"
            min={0}
            max={10}
            step={0.25}
            initialValue={rating}
            onChange={setRating}
          />
          <section className="flex justify-between">
            <TierSelect setTier={setTier} tier={tier} />
            <Counter onChange={setWatchCount} value={watch_count} />
          </section>
          <section className="mt-auto flex justify-between ">
            {onDrop && (
              <button
                onMouseUp={() =>
                  onDrop({ tier, tier_rank: 0, rating, watch_count, progress })
                }
                className="flex items-center gap-1 rounded-md hover:text-red-400 transition-colors p-1"
              >
                <AiOutlineStop />
                Drop
              </button>
            )}
            {onWatchlist && (
              <button
                onMouseUp={() =>
                  onWatchlist({
                    tier,
                    tier_rank: 0,
                    rating,
                    watch_count,
                    progress,
                  })
                }
                className=" flex items-center gap-1 rounded-md hover:text-yellow-500 transition-colors p-1"
              >
                <BsFillBookmarkPlusFill />
                Watchlist
              </button>
            )}
            {onComplete && (
              <button
                onMouseUp={() =>
                  onComplete({
                    tier,
                    tier_rank: 0,
                    rating,
                    watch_count,
                    progress,
                  })
                }
                className="flex items-center gap-1 rounded-md hover:text-primary-400 transition-colors p-1"
              >
                <AiOutlineCheck />
                Complete
              </button>
            )}
          </section>
          <div className=" flex gap-3 w-full ml-auto">
            <button
              className="btn-secondary w-1/3"
              onMouseDown={() => setOpen(false)}
            >
              Cancel
            </button>
            <button className="btn-primary w-2/3" onMouseDown={submit}>
              Submit
            </button>
          </div>
        </div>
      </section>
    </Modal>
  );
}
