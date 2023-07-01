import { NextResponse } from "next/server";
import { META } from "@consumet/extensions";
import MangaReader from "@consumet/extensions/dist/providers/manga/mangareader";

export async function GET(req: Request) {
  const mangaRes = await fetch(
    `https://api.consumet.org/meta/anilist-manga/info/30642?provider=mangareader`
  );
  const manga = await mangaRes.json();

  console.log("yoyoyo\n");

  const releaseDate = `${manga.startDate.year}-${String(
    manga.startDate.month
  ).padStart(2, "0")}-${String(manga.startDate.day).padStart(2, "0")}`;

  // Convert rating from 100 to 10 with 1 decimal place
  const rating = manga.rating / 10;

  return NextResponse.json({
    release: releaseDate,
    rating: rating,
  });
}
