import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import supabaseAdmin from "@/utils/supabase-server";
import type { Database } from "@/utils/database.types";
import { META } from "@consumet/extensions";

type TMDBType = "tv" | "movie" | "manga";

type SeriesPostBody = {
  priority: number;
  type: TMDBType;
};

// This is a placeholder function. Replace this with your actual implementation.
async function queryProviderForSeries(
  provider: string,
  provider_id: string,
  type: TMDBType
): Promise<Database["public"]["Tables"]["series"]["Insert"] | undefined> {
  // Query the provider API to get the series details
  if (provider === "tmdb") {
    const tmdb = new META.TMDB();
    const series = await tmdb.fetchMediaInfo(provider_id, type);

    if (series.message) {
      return;
    }

    // Format the series details in the format (7.64 -> 7.6)
    let rating = series.rating?.toFixed(1);
    if (rating == "0.0") {
      rating = undefined;
    }
    return {
      provider,
      provider_id,
      type: type,
      title: series?.title as string,
      release_date: series?.releaseDate as string,
      image: series?.image as string,
      banner: series?.cover,
      rating: rating as any,
    };
  }

  if (provider === "anilist-manga") {
    const mangaRes = await fetch(
      `https://api.consumet.org/meta/anilist-manga/info/${provider_id}?provider=mangareader`
    );
    const manga = await mangaRes.json();

    if (manga.message) {
      return;
    }

    const releaseDate =
      manga.startDate &&
      `${manga.startDate.year}-${String(manga.startDate.month).padStart(
        2,
        "0"
      )}-${String(manga.startDate.day).padStart(2, "0")}`;

    const rating = manga.rating / 10;
    if (rating === 0) manga.rating = null;

    return {
      provider,
      provider_id,
      type: "manga",
      title: manga.title.english ?? manga.title.romaji,
      release_date: releaseDate,
      image: manga?.image,
      banner: manga?.cover,
      rating: rating,
    };
  }
  // Return the series details in the format required for your series table
}

export async function POST(
  req: Request,
  { params }: { params: { provider: string; providerId: string } }
) {
  const body = (await req.json()) as SeriesPostBody;
  // If params.provider is not a valid provider, return 404
  if (!["tmdb", "anilist-manga"].includes(params.provider)) {
    return NextResponse.json({ message: "Invalid provider" }, { status: 404 });
  }

  if (!["tv", "movie", "manga"].includes(body.type)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.redirect("/login");
  }

  // Check if the series exists in the series table
  let { data: series, error } = await supabase
    .from("series")
    .select("*")
    .eq("provider", params.provider)
    .eq("provider_id", params.providerId)
    .single();

  if (!series) {
    // Series does not exist in the series table, so create it
    const seriesDetails = await queryProviderForSeries(
      params.provider,
      params.providerId,
      body.type
    );

    if (!seriesDetails) {
      return NextResponse.json({
        message: "Error occurred while fetching series",
      });
    }

    const { data: newSeries, error: insertError } = await supabaseAdmin
      .from("series")
      .insert([seriesDetails])
      .select("*")
      .single();

    if (insertError) {
      // Handle error
      console.error(insertError);
      return NextResponse.json({
        message: "Error occurred while creating series",
      });
    }

    series = newSeries;
  }

  if (!series) {
    return NextResponse.json(
      {
        message: "Error occurred while fetching series",
      },
      { status: 500 }
    );
  }

  // Check if the user already has the series in their watchlist
  const { data: watchlist } = await supabase
    .from(`profile_${series.provider === "tmdb" ? "watchlists" : "readlists"}`)
    .select("*")
    .eq("profile_id", auth.user.id)
    .eq("series_id", series.id)
    .single();

  if (watchlist) {
    return NextResponse.json(
      {
        message: "Series already in watchlist",
      },
      { status: 400 }
    );
  }

  // Link the series to the user's watchlist
  const { data: watchlistData, error: watchlistError } = await supabase
    .from(`profile_${series.provider === "tmdb" ? "watchlists" : "readlists"}`)
    .insert([
      {
        profile_id: auth.user.id,
        series_id: series.id,
        priority: body.priority,
      },
    ])
    .select("*");

  if (watchlistError) {
    // Handle error
    console.error(watchlistError);
    return NextResponse.json(
      {
        message: "Error occurred while updating watchlist",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "Series added to watchlist successfully",
      data: watchlistData[0],
    },
    { status: 200 }
  );
}
