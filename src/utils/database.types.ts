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
      profile_readlists: {
        Row: {
          created_at: string | null
          id: string
          priority: number
          profile_id: string
          series_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          priority: number
          profile_id: string
          series_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          priority?: number
          profile_id?: string
          series_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_readlists_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
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
          series_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          priority: number
          profile_id: string
          series_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          priority?: number
          profile_id?: string
          series_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_watchlists_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

