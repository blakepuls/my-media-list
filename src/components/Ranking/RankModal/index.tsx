import { Ranking as Ranking, Series } from "@/types/database";
import Modal from "../../Modal";
import Slider from "../../Slider";
import { useEffect, useState } from "react";
import { TierSelect, Tiers } from "../../TierSelect";
import supabase from "@/utils/supabase-browser";
import { toast } from "react-toastify";
import Counter from "@/components/Counter";
import { updateRanking } from "@/utils/rankings";
import {
  AiFillEye,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineStop,
} from "react-icons/ai";
import { BsFillBookmarkPlusFill, BsFillTrashFill } from "react-icons/bs";
import { GoTrash } from "react-icons/go";

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
  onWatching?: (result: RankingResult) => void;
  onDrop?: (result: RankingResult) => void;
  onDelete?: () => void;
  ranking?: Ranking;
  series:
    | Series
    | {
        id: string;
        title: string;
        banner: string;
      };
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (SubmitResponse: Ranking) => void;
}

export function RankModal({
  ranking,
  series,
  isOpen,
  onWatching,
  onWatchlist,
  onDelete,
  onDrop,
  onComplete,
  setOpen,
  onSubmit,
}: RankModalProps) {
  const [tier, setTier] = useState<Ranking["tier"]>(ranking?.tier || "S");
  const [rating, setRating] = useState(ranking?.rating || 5);
  const [watch_count, setWatchCount] = useState(ranking?.watch_count || 1);
  const [progress, setProgress] = useState(ranking?.progress || 1);

  useEffect(() => {
    setTier(ranking?.tier || "S");
    setRating(ranking?.rating || 5);
    setWatchCount(ranking?.watch_count || 1);
    setProgress(ranking?.progress || 1);
  }, [ranking]);

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

  async function complete() {
    // await submit();
    if (onComplete) {
      onComplete({
        tier,
        rating,
        tier_rank: 0,
        watch_count,
        progress,
      });
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
      <section className="flex flex-col h-auto outline-none ">
        <section className="">
          <div className="h-20">
            {series.banner && (
              <img
                className="w-80 h-20 opacity-40 object-cover"
                src={series.banner || ""}
              />
            )}
          </div>
          <h1 className="absolute top-0 align-text-bottom p-1.5 font-bold text-xl">
            {series.title}
          </h1>
        </section>
        {/* <img
          className="w-40 sm:w-80 rounded-l-md"
          src={series.image}
          alt={series.title}
        /> */}
        <div className="flex flex-col gap-3 flex-grow p-3 w-80">
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
            <div className="flex gap-2 items-center">
              <AiOutlineEye className="text-3xl" />
              <Counter onChange={setWatchCount} value={watch_count} />
            </div>
          </section>
          <section className="mt-auto flex justify-between ">
            {onDelete && (
              <button
                onMouseUp={() => onDelete()}
                className="flex items-center gap-1 rounded-md hover:text-red-400 transition-colors p-1"
              >
                <GoTrash className="text-xl" />
                Delete
              </button>
            )}
            {onWatching && (
              <button
                onMouseUp={() =>
                  onWatching({
                    tier,
                    tier_rank: 0,
                    rating,
                    watch_count,
                    progress,
                  })
                }
                className=" flex items-center gap-1 rounded-md hover:text-primary-500 transition-colors p-1"
              >
                <AiOutlineEye />
                Watching
              </button>
            )}
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
                onMouseUp={complete}
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
