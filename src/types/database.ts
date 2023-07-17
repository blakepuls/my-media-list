import { Database } from "./database.types";

type Tables = Database["public"]["Tables"];

export type Series = Tables["series"]["Row"];
export type SeriesWithRankings = Tables["series"]["Row"] & {
  ranking: Ranking;
};
export type Watchlist = Tables["profile_watchlists"]["Row"];
export type Readlist = Tables["profile_readlists"]["Row"];
export type Ranking = Tables["profile_rankings"]["Row"];
export type RankingUpdate = Tables["profile_rankings"]["Update"];
export type RankingInsert = Tables["profile_rankings"]["Insert"];
export type RankingTiers = Database["public"]["Enums"]["ranking_tiers"];
export type SeriesListStatus =
  Database["public"]["Enums"]["series_list_status_enum"];

export type Profile = Tables["profiles"]["Row"];
