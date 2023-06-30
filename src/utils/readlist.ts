import { useAuth } from "@/hooks/auth";
import supabase from "./supabase";

// Add series to readlist
export const addToReadlist = async (id: string, provider: string) => {
  const { user } = useAuth();

  if (!user) {
    return;
  }

  const { data: readlist } = await supabase
    .from("profile_readlists")
    .select("*")
    .eq("id", id)
    .eq("provider", provider);

  // Using supabase add to readlist
  const { data, error } = await supabase.from("profile_readlists").insert([
    {
      profile_id: user?.id,
      series_id: id,
      provider: provider,
      priority: readlist ? readlist[0].priority + 1 : 1,
    },
  ]);

  if (error) {
    console.log(error);
  }

  return data;
};

// Remove series from readlist
export const removeFromReadlist = async (id: string, provider: string) => {
  const { user } = useAuth();

  if (!user) {
    return;
  }

  const { data, error } = await supabase
    .from("profile_readlists")
    .delete()
    .eq("profile_id", user?.id)
    .eq("series_id", id)
    .eq("provider", provider);

  if (error) {
    console.log(error);
  }

  return data;
};
