// "use client";

import SeriesCard from "@/components/Series/SeriesCard";
import SeriesEditor from "@/components/Series/SeriesEditor";
import SeriesContainer from "@/components/Series/SeriesContainer";
import Test from "@/components/Test";
import { Database } from "@/types/database.types";
import supabase from "@/utils/supabase-server";
import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import RankingEditor, { RankingData } from "@/components/Ranking/RankingEditor";

// Revalidate on every request
export const revalidate = 0;

export default async function Rankings({
  params,
}: {
  params: { username: string };
}) {
  // const { status } = useAuth();
  // if (status === "loading") return <div>Loading...</div>;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single();

  // Select every rankings row that belongs to the user
  const { data: rankingsData } = await supabase
    .from("profile_rankings")
    .select("*, series:series_id(*)")
    .eq("profile_id", profile?.id);

  const rankings = rankingsData as unknown as RankingData[];

  return (
    <main className="flex flex-col items-center gap-3 mt-10 w-full">
      <section className="flex flex-wrap gap-5 w-full">
        <RankingEditor list={rankings} />
      </section>
    </main>
  );
}
