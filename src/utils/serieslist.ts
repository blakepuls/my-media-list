import { useAuth } from "@/hooks/auth";
import supabase from "./supabase";

type ListType = "watchlist" | "readlist";

// Add series to watchlist
export const addSeriesList = async (
  type: ListType,
  id: string,
  provider: string
) => {
  const { data: user } = await supabase.auth.getUser();

  if (!user?.user) {
    throw new Error("User not authenticated");
  }

  const { data: watchlist } = await supabase
    .from(`profile_${type}s`)
    .select("*")
    .eq("profile_id", user?.user?.id);

  // Check if watchlist contains series
  const { data: watchlistContains } = await supabase
    .from(`profile_${type}s`)
    .select("*")
    .eq("profile_id", user?.user?.id)
    .eq("series_id", id)
    .eq("provider", provider);

  if ((watchlistContains?.length || 0) > 0) {
    throw new Error("Series already in watchlist");
  }

  // Using supabase add to watchlist
  const { error } = await supabase.from(`profile_${type}s`).insert([
    {
      profile_id: user?.user?.id,
      series_id: id,
      provider: provider,
      priority: watchlist ? watchlist.length + 1 : 1,
    },
  ]);

  if (error) {
    throw new Error(`Failed to add to watchlist`);
  }

  return true;
};

// Remove series from watchlist
export const removeSeriesList = async (
  type: ListType,
  id: string,
  provider: string
) => {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return;
  }

  const { data, error } = await supabase
    .from(`profile_${type}s`)
    .delete()
    .eq("profile_id", user?.user?.id)
    .eq("series_id", id)
    .eq("provider", provider);

  if (error) {
    throw new Error(`Failed to remove from watchlist`);
  }

  return data;
};
