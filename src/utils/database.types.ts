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
          series_uuid: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          priority: number
          profile_id: string
          series_uuid?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          priority?: number
          profile_id?: string
          series_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_readlists_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_readlists_series_uuid_fkey"
            columns: ["series_uuid"]
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
          series_uuid: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          priority: number
          profile_id: string
          series_uuid?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          priority?: number
          profile_id?: string
          series_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_watchlists_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_watchlists_series_uuid_fkey"
            columns: ["series_uuid"]
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
          created_at: string | null
          genre: string
          id: string
          image: string | null
          provider: string
          release_date: string
          series_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          genre: string
          id?: string
          image?: string | null
          provider: string
          release_date: string
          series_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          genre?: string
          id?: string
          image?: string | null
          provider?: string
          release_date?: string
          series_id?: string
          title?: string
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

