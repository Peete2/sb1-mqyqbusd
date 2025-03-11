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
      authors: {
        Row: {
          id: string
          name: string
          profile_picture: string | null
          email: string
          password: string
          status: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          profile_picture?: string | null
          email: string
          password: string
          status?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          profile_picture?: string | null
          email?: string
          password?: string
          status?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          profile_picture: string | null
          description: string | null
          status: string
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          profile_picture?: string | null
          description?: string | null
          status?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          profile_picture?: string | null
          description?: string | null
          status?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          category_id: string
          author_id: string
          title: string
          slug: string
          content: string
          featured_image: string | null
          advert_image: string | null
          meta_description: string | null
          meta_keywords: string | null
          view_count: number
          featured: boolean
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          author_id: string
          title: string
          slug: string
          content: string
          featured_image?: string | null
          advert_image?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          view_count?: number
          featured?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          author_id?: string
          title?: string
          slug?: string
          content?: string
          featured_image?: string | null
          advert_image?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          view_count?: number
          featured?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          name: string
          email: string
          content: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          name: string
          email: string
          content: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          name?: string
          email?: string
          content?: string
          status?: string
          created_at?: string
        }
      }
      media: {
        Row: {
          id: string
          filename: string
          path: string
          mime_type: string
          article_id: string | null
          uploaded_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          filename: string
          path: string
          mime_type: string
          article_id?: string | null
          uploaded_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          filename?: string
          path?: string
          mime_type?: string
          article_id?: string | null
          uploaded_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'editor' | 'writer'
    }
  }
  auth: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'editor' | 'writer'
        }
      }
    }
  }
}