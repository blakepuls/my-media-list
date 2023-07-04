"use client";

import { Database } from "@/utils/database.types";
import SeriesRow from "./SeriesRow";
import { useState } from "react";

type Series = Database["public"]["Tables"]["series"]["Row"];
type Watchlist = (Database["public"]["Tables"]["profile_watchlists"]["Row"] & {
  series: Series;
})[];
type Readlist = (Database["public"]["Tables"]["profile_readlists"]["Row"] & {
  series: Series;
})[];

interface SeriesEditorProps {
  list: Watchlist | Readlist;
}

export default function SeriesEditor({ list }: SeriesEditorProps) {
  const [series, setSeries] = useState<Series[]>(
    list?.map((item) => item.series)
  );

  return <SeriesRow setSeries={setSeries} series={series} />;
}
