"use client";

import {
  AiFillFilter,
  AiFillStar,
  AiFillTrophy,
  AiOutlineSearch,
} from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import {
  IAnimeResult,
  IMangaResult,
  IMovieResult,
  ISearch,
} from "@consumet/extensions/dist/models/types";
import { usePathname } from "next/navigation";
import { CSSTransition } from "react-transition-group";
import "./animation.css";
import { useRouter, useSearchParams } from "next/navigation";
import Checkbox from "../Checkbox";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { addSeriesList, removeSeriesList } from "@/utils";
import supabase from "@/utils/supabase-browser";
import { useAuth } from "@/hooks/auth";

interface AnimeResult {
  onList: boolean;
}

interface SeriesResult extends IMovieResult {
  onList: boolean;
}

interface MangaResult extends IMangaResult {
  onList: boolean;
}

interface SeriesSearchResult {
  currentPage?: number;
  hasNextPage?: boolean;
  results: any[];
  totalPages?: number;
  totalResults?: number;
}

interface ISearchResult {
  animes: SeriesSearchResult;
  movies: SeriesSearchResult;
  mangas: SeriesSearchResult;
}

export interface ISearchState {
  status: "idle" | "loading" | "success" | "error";
  results?: ISearchResult;
  error?: string;
}

async function universalSearch(search: string): Promise<ISearchResult | null> {
  if (search.length < 3) return null;

  const { data } = await supabase.auth.getUser();

  // const { data: readlist } = await supabase
  //   .from("profile_readlists")
  //   .select("*")
  //   .eq("profile_id", data.user?.id);

  const movieRes = await fetch(`https://api.consumet.org/meta/tmdb/${search}`);
  const movies = await movieRes.json();

  const mangaRes = await fetch(
    `https://api.consumet.org/meta/anilist-manga/${search}`
  );
  const mangas = await mangaRes.json();

  // Remove movies that have an image string that includes "originalnull" or "originalundefined"
  movies.results = movies.results.filter(
    (movie: any) =>
      !movie.image.includes("originalnull") &&
      !movie.image.includes("originalundefined")
  );

  // Remove 2nd decimal place from rating
  movies.results = movies.results.map((movie: any) => {
    movie.rating = Math.floor(movie.rating * 10) / 10;
    if (movie.rating === 0) movie.rating = null;
    return movie;
  });

  // Set the title to English if it exists, otherwise use the romaji title.
  // Change the rating to a 1-10 scale
  mangas.results = mangas.results?.map((manga: any) => {
    const title = manga.title.english || manga.title.romaji;
    manga.rating = manga.rating / 10;
    // Round the rating to the nearest 0.5

    if (manga.rating === 0) manga.rating = null;

    return { ...manga, title, type: "Manga" };
  });

  // Fetch series that match each movie's provider and provider id
  const { data: series } = await supabase
    .from("series")
    .select("id, provider, provider_id")
    .in("provider_id", [
      movies?.results?.map((movie: any) => movie.id.toString()),
      mangas?.results?.map((manga: any) => manga.id.toString()),
    ]);

  if (series) {
    const { data: watchlist } = await supabase
      .from("profile_watchlists")
      .select("*")
      .eq("profile_id", data.user?.id)
      .in(
        "series_id",
        series?.map((s: any) => s.id)
      );

    // Connect the series to the movies
    movies.results = movies.results?.map((movie: any) => {
      const seriesId = series.find(
        (s: any) => s.provider_id === movie.id.toString()
      )?.id;
      const onList = watchlist?.some((w: any) => w.series_id === seriesId);
      return { ...movie, seriesId, onList };
    });

    const { data: readlist } = await supabase
      .from("profile_readlists")
      .select("*")
      .eq("profile_id", data.user?.id)
      .in(
        "series_id",
        series?.map((s: any) => s.id)
      );

    // Connect the series to the mangas
    mangas.results = mangas.results?.map((manga: any) => {
      const seriesId = series.find(
        (s: any) => s.provider_id === manga.id.toString()
      )?.id;
      const onList = readlist?.some((w: any) => w.series_id === seriesId);
      return { ...manga, seriesId, onList };
    });
  }

  return {
    animes: undefined!,
    movies,
    mangas,
  };
}

interface SearchProps {
  onChange: (results: ISearchState) => void;
}

export default function Search(props: SearchProps) {
  const router = useRouter(); // Hook for routing
  const searchParams = useSearchParams(); // Hook for params

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  async function performSearch() {
    const search = searchParams.get("search");
    if (search) {
      // Set input value to search query
      if (inputRef.current) {
        inputRef.current.value = search;
      }

      props.onChange?.({
        status: "loading",
        results: undefined,
        error: undefined,
      });
      // If there is a search query in the URL, fetch it
      const results = await universalSearch(search);

      if (results) {
        props.onChange?.({ status: "success", results });
      } else {
        props.onChange?.({
          status: "error",
          results: undefined,
          error: "No results",
        });
      }
    }
  }

  useEffect(() => {
    performSearch();
  }, [searchParams]);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      const search = e.target.value;
      // const results = await universalSearch(search);

      // if (!results) {
      //   return;
      // }

      // setSearchResults(results);

      // Add the search query to the URL (without adding a new entry into the browser’s history stack)
      router.replace(`/browse?search=${search}`);
    }, 500);
  };

  return (
    <div
      className="flex items-center gap-1.5 p-1.5 bg-gray-700 h-10 rounded-md text-sm shadow-md cursor-text"
      onClick={handleFocus}
    >
      <AiOutlineSearch className="text-2xl text-gray-500" />
      <input
        ref={inputRef}
        placeholder="Search..."
        {...props}
        className="bg-transparent h-full w-full rounded-lg text-sm outline-none"
        onChange={handleSearch}
      />

      {/* <Filter /> */}
    </div>
  );
}

const Filter = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [anime, setAnime] = useState(true);
  const [movie, setMovie] = useState(true);
  const [manga, setManga] = useState(true);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (filterOpen) {
      const handleDocumentMouseDown = (event: MouseEvent) => {
        const target = event.target as Node;

        if (nodeRef.current && !nodeRef.current.contains(target)) {
          // Clicked outside, close dropdown
          setFilterOpen(false);
        }
      };

      document.addEventListener("mousedown", handleDocumentMouseDown);

      return () => {
        // Clean up event listener when dropdown is closed or component is unmounted
        document.removeEventListener("mousedown", handleDocumentMouseDown);
      };
    }
  }, [filterOpen, nodeRef, setFilterOpen]);

  return (
    <div className="relative">
      <AiFillFilter
        className={`text-2xl hover:text-white transition-colors cursor-pointer text-gray-500 ${
          filterOpen && "!text-white"
        }`}
        onClick={() => {
          setFilterOpen((prev) => !prev);
        }}
      />

      <CSSTransition
        in={filterOpen}
        timeout={300}
        classNames="menu"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div
          ref={nodeRef}
          className="absolute bg-gray-950 rounded-md shadow-md p-1.5 -top-2 left-8 flex flex-col gap-0.5 z-10"
        >
          {/* Anime checkbox */}
          <Checkbox label="Anime" value={anime} onChange={setAnime} />
          <Checkbox label="Movies & Shows" value={movie} onChange={setMovie} />
          <Checkbox label="Manga" value={manga} onChange={setManga} />
        </div>
      </CSSTransition>
    </div>
  );
};
