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
      streamers: {
        Row: {
          broadcaster_id: string
          created_at: string
          id: string
          login_name: string | null
          profile_image: string | null
          stream_offline: boolean
          stream_online: boolean
          stream_status: boolean
          subscribed: boolean
          title: string | null
          user_id: string | null
        }
        Insert: {
          broadcaster_id: string
          created_at?: string
          id?: string
          login_name?: string | null
          profile_image?: string | null
          stream_offline: boolean
          stream_online: boolean
          stream_status: boolean
          subscribed: boolean
          title?: string | null
          user_id?: string | null
        }
        Update: {
          broadcaster_id?: string
          created_at?: string
          id?: string
          login_name?: string | null
          profile_image?: string | null
          stream_offline?: boolean
          stream_online?: boolean
          stream_status?: boolean
          subscribed?: boolean
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "streamers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          broadcaster_id: string | null
          created_at: string | null
          id: string
          login_name: string | null
          method: string | null
          subscription_id: string | null
          subscription_type: string | null
          user_id: string | null
        }
        Insert: {
          broadcaster_id?: string | null
          created_at?: string | null
          id?: string
          login_name?: string | null
          method?: string | null
          subscription_id?: string | null
          subscription_type?: string | null
          user_id?: string | null
        }
        Update: {
          broadcaster_id?: string | null
          created_at?: string | null
          id?: string
          login_name?: string | null
          method?: string | null
          subscription_id?: string | null
          subscription_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_broadcaster_id_fkey"
            columns: ["broadcaster_id"]
            referencedRelation: "streamers"
            referencedColumns: ["broadcaster_id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      testing: {
        Row: {
          created_at: string
          id: string
          test: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          test?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          test?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testing_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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

