export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profile_rankings: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          profile_id: string
          progress: number
          rating: number
          series_id: string | null
          tier: Database["public"]["Enums"]["ranking_tiers"]
          tier_rank: number
          watch_count: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          profile_id: string
          progress?: number
          rating: number
          series_id?: string | null
          tier: Database["public"]["Enums"]["ranking_tiers"]
          tier_rank: number
          watch_count?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          profile_id?: string
          progress?: number
          rating?: number
          series_id?: string | null
          tier?: Database["public"]["Enums"]["ranking_tiers"]
          tier_rank?: number
          watch_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "profile_rankings_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_rankings_series_id_fkey"
            columns: ["series_id"]
            referencedRelation: "series"
            referencedColumns: ["id"]
          }
        ]
      }
      profile_readlists: {
        Row: {
          created_at: string | null
          id: string
          priority: number
          profile_id: string
          progress: number
          ranking_id: string | null
          series_id: string
          status: Database["public"]["Enums"]["series_list_status_enum"] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          priority: number
          profile_id: string
          progress?: number
          ranking_id?: string | null
          series_id: string
          status?: Database["public"]["Enums"]["series_list_status_enum"] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          priority?: number
          profile_id?: string
          progress?: number
          ranking_id?: string | null
          series_id?: string
          status?: Database["public"]["Enums"]["series_list_status_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_readlists_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_readlists_ranking_id_fkey"
            columns: ["ranking_id"]
            referencedRelation: "profile_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_readlists_series_id_fkey"
            columns: ["series_id"]
            referencedRelation: "series"
            referencedColumns: ["id"]
          }
        ]
      }
      profile_watchlists: {
        Row: {
          created_at: string | null
          id: string
          priority: number
          profile_id: string
          progress: number
          ranking_id: string | null
          series_id: string
          status: Database["public"]["Enums"]["series_list_status_enum"] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          priority: number
          profile_id: string
          progress?: number
          ranking_id?: string | null
          series_id: string
          status?: Database["public"]["Enums"]["series_list_status_enum"] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          priority?: number
          profile_id?: string
          progress?: number
          ranking_id?: string | null
          series_id?: string
          status?: Database["public"]["Enums"]["series_list_status_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_watchlists_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_watchlists_ranking_id_fkey"
            columns: ["ranking_id"]
            referencedRelation: "profile_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_watchlists_series_id_fkey"
            columns: ["series_id"]
            referencedRelation: "series"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      series: {
        Row: {
          banner: string | null
          created_at: string | null
          id: string
          image: string
          provider: string
          provider_id: string
          rating: number | null
          release_date: string
          title: string
          type: string
        }
        Insert: {
          banner?: string | null
          created_at?: string | null
          id?: string
          image: string
          provider: string
          provider_id: string
          rating?: number | null
          release_date: string
          title: string
          type: string
        }
        Update: {
          banner?: string | null
          created_at?: string | null
          id?: string
          image?: string
          provider?: string
          provider_id?: string
          rating?: number | null
          release_date?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_ranking_id: {
        Args: {
          profile: string
          series: string
        }
        Returns: string
      }
    }
    Enums: {
      ranking_tiers: "S" | "A" | "B" | "C" | "D" | "E"
      series_list_status_enum: "idle" | "watching" | "dropped"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

