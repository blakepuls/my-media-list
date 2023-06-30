import { NextResponse } from "next/server";
import { ANIME, MOVIES, MANGA } from "@consumet/extensions";

async function universalSearch(query: string) {
  const movies = new MOVIES.FlixHQ();
  const movieResults = await movies.search(query);

  const animes = new ANIME.Zoro();
  const animeResults = await animes.search(query);

  const manga = new MANGA.MangaReader();
  const mangaResults = await manga.search(query);

  return { movieResults, animeResults, mangaResults };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.redirect("/search");
  }

  const results = await universalSearch(query);

  console.log(results);

  return NextResponse.json({
    ...results,
  });
}
