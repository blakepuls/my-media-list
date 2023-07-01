"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/auth";
import { usePathname } from "next/navigation";
import Search, { ISearchResult } from "@/components/Search";
import { SeriesCard } from "@/components/SeriesCard";

export default function Browse() {
  const [results, setResults] = useState<ISearchResult>();

  return (
    <main className="flex flex-col items-center gap-3 w-full">
      <Search onChange={setResults} />
      <section className="flex justify-center items-center flex-wrap gap-5 overflow-y-auto">
        {results?.movies?.results?.map((result: any) => {
          return (
            <SeriesCard
              key={result.id}
              result={result}
              type="Movie"
              seriesId={result.id}
              onList={result.onList}
            />
          );
        })}

        {results?.mangas?.results?.map((result: any) => {
          return (
            <SeriesCard
              key={result.id}
              result={result}
              type="Manga"
              seriesId={result.id}
              onList={result.onList}
            />
          );
        })}
      </section>
    </main>
  );
}
