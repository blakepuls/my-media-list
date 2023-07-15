import { useAuth } from "@/hooks/auth";
import supabase from "./supabase-browser";
import { Ranking, RankingUpdate } from "@/types/database";
import { RankingData } from "@/components/Ranking/RankingEditor";

interface RankingList {
  seriesId: string;
  data: Ranking;
}

// Remove series from watchlist
export const updateRanking = async (seriesId: string, data: RankingUpdate) => {
  const { data: userData } = await supabase.auth.getSession();

  if (!userData.session?.user) return;

  const { data: updateData, error } = await supabase
    .from("profile_rankings")
    .upsert({
      ...(data as any),
      profile_id: userData.session.user.id,
      series_id: seriesId,
      tier_rank: 0,
      series: undefined,
    })
    .select("*");

  //If status isn't 200, throw error
  if (error) {
    throw new Error(error.message);
  }

  if (!updateData) {
    throw new Error("Failed to add ranking");
  }

  return data;
};
