import { Rankings, Series } from "@/types/database";
import Modal from "../Modal";
import Slider from "../Slider";
import { useState } from "react";
import { TierSelect, Tiers } from "../TierSelect";
import supabase from "@/utils/supabase-browser";

export interface SubmitResponse {
  tier: Rankings["tier"];
  rating: number;
}

interface RankModalProps {
  tier?: Rankings["tier"];
  rating?: number;
  series: Series;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (SubmitResponse: SubmitResponse) => void;
}

export function RankModal({
  series,
  isOpen,
  setOpen,
  onSubmit,
}: RankModalProps) {
  const [tier, setTier] = useState<Rankings["tier"]>("S");
  const [rating, setRating] = useState(0);

  function submit() {
    if (onSubmit) {
      onSubmit({ tier, rating });
    }
    setOpen(false);
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
          <TierSelect setTier={setTier} tier={tier} />
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
