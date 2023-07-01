import { useAuth } from "@/hooks/auth";
import supabase from "./supabase-browser";

type ListType = "watchlist" | "readlist";

// Add series to watchlist
export const addSeriesList = async (
  id: string,
  // provider: string,
  type: "tv" | "movie" | "manga"
) => {
  let provider = "tmdb";
  if (type === "manga") {
    provider = "anilist-manga";
  }

  const res = await fetch(`/api/seriesList/${provider}/${id}`, {
    method: "POST",
    body: JSON.stringify({
      priority: 1,
      type: type,
    }),
  });

  const data = await res.json();

  //If status isn't 200, throw error
  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data;
};

// Remove series from watchlist
export const removeSeriesList = async (
  id: string,
  // provider: string,
  type: "tv" | "movie" | "manga"
) => {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return;
  }

  let provider = "tmdb";
  if (type === "manga") {
    provider = "anilist-manga";
  }

  const { data, error } = await supabase
    .from(`profile_${type}s`)
    .delete()
    .eq("profile_id", user?.user?.id)
    .eq("series_id", id);

  if (error) {
    console.error(error);
    throw new Error(`Failed to remove from watchlist ${id}`);
  }

  return data;
};
