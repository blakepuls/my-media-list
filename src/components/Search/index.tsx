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
import { toast } from "react-toastify";
import { CSSTransition } from "react-transition-group";
import "./animation.css";
import { useRouter, useSearchParams } from "next/navigation";
import Checkbox from "../Checkbox";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { addSeriesList, removeSeriesList } from "@/utils";
import supabase from "@/utils/supabase";
import { useAuth } from "@/hooks/auth";
import { SeriesCard } from "../SeriesCard";

interface AnimeResult {
  onList: boolean;
}

interface SeriesResult extends IMovieResult {
  onList: boolean;
}

interface MangaResult extends IMangaResult {
  onList: boolean;
}

interface ISearchResult {
  animes: any;
  movies: any;
  mangas: any;
}

// Fetch metadata for a specific id from a specific type
async function fetchMeta(id: string, type: string): Promise<any> {
  const res = await fetch(`https://api.consumet.org/meta/${type}?id=${id}`);
  return await res.json();
}

async function universalSearch(search: string): Promise<ISearchResult | null> {
  if (search.length < 3) return null;

  const { data } = await supabase.auth.getUser();

  const { data: watchlist } = await supabase
    .from("profile_watchlists")
    .select("*")
    .eq("profile_id", data.user?.id);

  const { data: readlist } = await supabase
    .from("profile_readlists")
    .select("*")
    .eq("profile_id", data.user?.id);

  console.log("readlist", readlist);

  const movieRes = await fetch(`https://api.consumet.org/meta/tmdb/${search}`);
  const movies = await movieRes.json();

  // Remove movies that have an image string that includes "originalnull" or "originalundefined"
  movies.results = movies.results.filter(
    (movie: any) =>
      !movie.image.includes("originalnull") &&
      !movie.image.includes("originalundefined")
  );

  console.log("watchlist", watchlist);

  // Mark movies that are in the user's watchlist
  movies.results = movies.results.map((movie: any) => {
    const watchlistItem = watchlist?.find(
      (item: any) =>
        item.series_id === movie.id.toString() && item.provider === "tmdb"
    );

    if (watchlistItem) {
      movie.onList = true;
    } else {
      movie.onList = false;
    }

    return movie;
  });

  // movies.results = movies.results.filter((movie: any) => movie.rating > 0);

  const animeRes = await fetch(
    `https://api.consumet.org/meta/anilist/${search}`
  );
  const animes = await animeRes.json();

  // Mark animes that are in the user's watchlist
  // animes.results = animes.results.map((anime: any) => {
  //   const watchlistItem = watchlist?.find(
  //     (item: any) => item.anilist_id === anime.id
  //   );

  //   if (watchlistItem) {
  //     anime.watchlist = true;
  //   } else {
  //     anime.watchlist = false;
  //   }
  // });

  const mangaRes = await fetch(
    `https://api.consumet.org/meta/anilist-manga/${search}`
  );
  const mangas = await mangaRes.json();

  //Mark mangas that are in the user's readlist
  mangas.results = mangas.results.map((manga: any) => {
    const readlistItem = readlist?.find(
      (item: any) =>
        item.series_id === manga.id.toString() && item.provider === "anilist"
    );

    if (readlistItem) {
      manga.onList = true;
    } else {
      manga.onList = false;
    }

    return manga;
  });

  return {
    animes,
    movies,
    mangas,
  };
}

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default (props: SearchProps) => {
  const router = useRouter(); // Hook for routing
  const searchParams = useSearchParams(); // Hook for params

  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const [searchResults, setSearchResults] = useState<ISearchResult>({
    animes: {
      results: [],
    },

    movies: {
      results: [],
    },

    mangas: {
      results: [],
    },
  });

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      // props.onChange?.({} as any); http://localhost:3000/api/search?query=one%20piece
    }
  };

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      // If there is a search query in the URL, fetch it
      universalSearch(search).then((results) => {
        if (results) {
          setSearchResults(results);
        }
      });
    }
  }, [searchParams]);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      const search = e.target.value;
      const results = await universalSearch(search);

      if (!results) {
        return;
      }

      setSearchResults(results);

      // Add the search query to the URL (without adding a new entry into the browser’s history stack)
      router.replace(`/?search=${search}`);
    }, 500);
  };

  if (pathname != "/") return;

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
      <Filter />

      <SearchResults
        animeResults={searchResults.animes}
        movieResults={searchResults.movies}
        mangaResults={searchResults.mangas}
      />
    </div>
  );
};

interface SearchResultsProps {
  animeResults: ISearch<AnimeResult>;
  movieResults: ISearch<SeriesResult>;
  mangaResults?: ISearch<MangaResult>;
}

function SearchResults({
  animeResults,
  movieResults,
  mangaResults,
}: SearchResultsProps) {
  return (
    <div className="absolute top-14  left-0">
      <div className="flex flex-wrap gap-3 p-3 justify-center items-center">
        {movieResults?.results?.map((result) => {
          return (
            <SeriesCard
              key={result.id}
              result={result}
              type="Movie"
              onList={result.onList}
            />
          );
        })}

        {/* {animeResults?.results?.map((result) => {
          return <MediaResult key={result.id} result={result} type="Anime" />;
        })} */}

        {mangaResults?.results?.map((result) => {
          return (
            <SeriesCard
              key={result.id}
              result={result}
              type="Manga"
              onList={result.onList}
            />
          );
        })}
      </div>
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
