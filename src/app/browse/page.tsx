"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/auth";
import { usePathname } from "next/navigation";
import Search, { ISearchState } from "@/components/Search";
import SeriesCard, { SeriesCardSkeleton } from "@/components/Search/SeriesCard";

export default function Browse() {
  const [search, setSearch] = useState<ISearchState>();

  return (
    <main className="flex flex-col items-center gap-3 w-full">
      <Search autoSearch={true} onChange={setSearch} />
      <section className="flex justify-center items-center flex-wrap gap-5 overflow-y-auto p-3 mt-2x">
        {search?.status === "loading" && (
          <>
            {Array.from({ length: 25 }).map((_, i) => (
              <SeriesCardSkeleton />
            ))}
          </>
        )}
        {search?.status === "error" && <div>{search.error}</div>}
        {search?.status === "success" && (
          <>
            {search?.results?.movies?.results?.map((result: any) => {
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

            {search?.results?.mangas?.results?.map((result: any) => {
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
          </>
        )}
      </section>
    </main>
  );
}
