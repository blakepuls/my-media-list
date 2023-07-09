import { Database } from "./database.types";

export type Series = Database["public"]["Tables"]["series"]["Row"];
export type Watchlist =
  Database["public"]["Tables"]["profile_watchlists"]["Row"];
export type Readlist = Database["public"]["Tables"]["profile_readlists"]["Row"];
