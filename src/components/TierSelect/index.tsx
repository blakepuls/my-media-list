import { RankingTiers } from "@/types/database";

interface TierSelectProps {
  setTier: React.Dispatch<React.SetStateAction<RankingTiers>>;
  tier: RankingTiers;
}

export function TierSelect({ tier, setTier }: TierSelectProps) {
  function nextTier() {
    const keys = Object.keys(Tiers);
    const index = keys.indexOf(Tiers[tier].letter);
    if (index === keys.length - 1) {
      setTier(Tiers[keys[0]].letter);
    } else {
      setTier(Tiers[keys[index + 1]].letter);
    }
  }

  return (
    <div
      className={`relative flex gap-3 items-center bg-gray-900 w-[5.6rem] rounded-md shadow-md  cursor-pointer select-none`}
      onMouseDown={nextTier}
    >
      <h1 className="text-xl ml-3">Tier</h1>
      <div
        className={`rounded-r-md ${Tiers[tier].color} font-semibold text-gray-800 text-xl flex items-center justify-center p-1.5`}
      >
        {Tiers[tier].letter}
      </div>
    </div>
  );
}

interface Tier {
  color: string;
  letter: RankingTiers;
}

export const Tiers: Record<string, Tier> = {
  S: { color: "bg-primary-500", letter: "S" },
  A: { color: "bg-yellow-500", letter: "A" },
  B: { color: "bg-green-500", letter: "B" },
  C: { color: "bg-blue-500", letter: "C" },
  D: { color: "bg-red-500", letter: "D" },
  E: { color: "bg-gray-500", letter: "E" },
};
