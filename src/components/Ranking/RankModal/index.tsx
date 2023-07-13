import { Ranking as Ranking, Series } from "@/types/database";
import Modal from "../../Modal";
import Slider from "../../Slider";
import { useState } from "react";
import { TierSelect, Tiers } from "../../TierSelect";
import supabase from "@/utils/supabase-browser";
import { toast } from "react-toastify";
import Counter from "@/components/Counter";

export interface RankingResult {
  tier: Ranking["tier"];
  rating: number;
  tier_rank: number;
  watch_count: number;
  progress: number;
}

interface RankModalProps {
  // tier?: Ranking["tier"];
  // rating?: number;
  ranking?: Ranking;
  series: Series;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (SubmitResponse: RankingResult) => void;
}

async function updateRanking(
  seriesId: string,
  { rating, tier, tier_rank }: RankingResult
) {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) return;

  const { data, error } = await supabase
    .from("profile_rankings")
    .upsert({
      profile_id: userData.user.id,
      series_id: seriesId,
      tier,
      rating,
      tier_rank: 0,
    })
    .eq("series_id", seriesId)
    .eq("profile_id", userData.user.id);

  if (error) {
    throw error;
  }
}

export function RankModal({
  ranking,
  series,
  isOpen,
  setOpen,
  onSubmit,
}: RankModalProps) {
  const [tier, setTier] = useState<Ranking["tier"]>(ranking?.tier || "S");
  const [rating, setRating] = useState(ranking?.rating || 5);
  const [watch_count, setWatchCount] = useState(ranking?.watch_count || 1);

  async function submit() {
    if (onSubmit) {
      toast
        .promise(
          updateRanking(series.id, {
            rating,
            tier,
            watch_count,
            tier_rank: 0,
            progress: 0,
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
          onSubmit({ tier, rating, tier_rank: 0, watch_count, progress: 0 });
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
          <div className="mt-auto flex gap-3 w-full ml-auto">
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
