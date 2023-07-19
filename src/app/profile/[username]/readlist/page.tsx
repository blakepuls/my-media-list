// "use client";

import SeriesCard from "@/components/Series/SeriesCard";
import SeriesEditor from "@/components/Series/SeriesEditor";
import SeriesContainer from "@/components/Series/SeriesContainer";
import Test from "@/components/Test";
import { Database } from "@/types/database.types";
import supabase from "@/utils/supabase-server";
import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";

// Revalidate on every request
export const revalidate = 0;

// type TSeries = Database["public"]["Tables"]["series"]["Row"];
// type TWatchlist = (Database["public"]["Tables"]["profile_watchlists"]["Row"] & {
//   series: TSeries;
// })[];

export default async function Watchlist({
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

  // Select every watchlist row that belongs to the user
  const { data: readlistData } = await supabase
    .from("profile_readlists")
    .select("*, series:series_id(*), ranking:ranking_id(*)")
    .eq("profile_id", profile?.id);

  const readlist = readlistData as any;

  if (!readlist.length) {
    return (
      <main className="flex flex-col items-center gap-3 mt-10 w-full">
        <h1 className="text-2xl">
          {/* They got nothing in their watchlist, nice message telling them so and to go to the browse page */}
          You don't have anything in your readlist yet.{" "}
          <a href="/browse" className="text-primary-500 hover:underline">
            Browse
          </a>{" "}
        </h1>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center gap-3 mt-10 w-full">
      <section className="flex flex-wrap gap-5 w-full">
        {/* <Test data={readlistData} /> */}
        <SeriesEditor list={readlist} listType="readlist" />
      </section>
    </main>
  );
}
