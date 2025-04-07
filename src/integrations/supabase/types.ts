export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_insights: {
        Row: {
          created_at: string | null
          description: string
          engineer_id: string
          icon: string | null
          id: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          engineer_id: string
          icon?: string | null
          id?: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          engineer_id?: string
          icon?: string | null
          id?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      engineer_allocations: {
        Row: {
          address: string | null
          created_at: string
          distance: number | null
          id: string
          priority: string
          region: string
          scheduled_date: string | null
          site_id: string
          site_name: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          distance?: number | null
          id?: string
          priority?: string
          region: string
          scheduled_date?: string | null
          site_id: string
          site_name: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          distance?: number | null
          id?: string
          priority?: string
          region?: string
          scheduled_date?: string | null
          site_id?: string
          site_name?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      engineer_profiles: {
        Row: {
          average_rating: number | null
          email: string | null
          experience: string | null
          id: string
          name: string | null
          regions: string[] | null
          specializations: string[] | null
          total_reviews: number | null
        }
        Insert: {
          average_rating?: number | null
          email?: string | null
          experience?: string | null
          id: string
          name?: string | null
          regions?: string[] | null
          specializations?: string[] | null
          total_reviews?: number | null
        }
        Update: {
          average_rating?: number | null
          email?: string | null
          experience?: string | null
          id?: string
          name?: string | null
          regions?: string[] | null
          specializations?: string[] | null
          total_reviews?: number | null
        }
        Relationships: []
      }
      engineer_ratings: {
        Row: {
          created_at: string | null
          engineer_id: string
          feedback: string | null
          id: string
          rating: number
          site_id: string
          site_name: string | null
        }
        Insert: {
          created_at?: string | null
          engineer_id: string
          feedback?: string | null
          id?: string
          rating: number
          site_id: string
          site_name?: string | null
        }
        Update: {
          created_at?: string | null
          engineer_id?: string
          feedback?: string | null
          id?: string
          rating?: number
          site_id?: string
          site_name?: string | null
        }
        Relationships: []
      }
      eskom_sites: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          name: string
          region: string | null
          type: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          name: string
          region?: string | null
          type?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          name?: string
          region?: string | null
          type?: string | null
        }
        Relationships: []
      }
      site_installations: {
        Row: {
          details: Json | null
          engineer_id: string
          id: string
          installation_date: string | null
          site_id: string
          site_name: string | null
          status: string | null
        }
        Insert: {
          details?: Json | null
          engineer_id: string
          id?: string
          installation_date?: string | null
          site_id: string
          site_name?: string | null
          status?: string | null
        }
        Update: {
          details?: Json | null
          engineer_id?: string
          id?: string
          installation_date?: string | null
          site_id?: string
          site_name?: string | null
          status?: string | null
        }
        Relationships: []
      }
      site_surveys: {
        Row: {
          address: string | null
          building_photo: string | null
          created_at: string
          date: string
          gps_coordinates: string | null
          id: string
          region: string
          site_id: string | null
          site_name: string
          site_type: string | null
          status: string
          survey_data: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          building_photo?: string | null
          created_at?: string
          date: string
          gps_coordinates?: string | null
          id?: string
          region: string
          site_id?: string | null
          site_name: string
          site_type?: string | null
          status?: string
          survey_data?: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          building_photo?: string | null
          created_at?: string
          date?: string
          gps_coordinates?: string | null
          id?: string
          region?: string
          site_id?: string | null
          site_name?: string
          site_type?: string | null
          status?: string
          survey_data?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      vehicle_checks: {
        Row: {
          check_date: string
          created_at: string | null
          details: Json | null
          engineer_id: string
          id: string
          notes: string | null
          status: string
          vehicle_id: string | null
          vehicle_name: string | null
        }
        Insert: {
          check_date?: string
          created_at?: string | null
          details?: Json | null
          engineer_id: string
          id?: string
          notes?: string | null
          status: string
          vehicle_id?: string | null
          vehicle_name?: string | null
        }
        Update: {
          check_date?: string
          created_at?: string | null
          details?: Json | null
          engineer_id?: string
          id?: string
          notes?: string | null
          status?: string
          vehicle_id?: string | null
          vehicle_name?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          created_at: string | null
          engineer_id: string
          id: string
          model: string | null
          name: string
          registration: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          engineer_id: string
          id?: string
          model?: string | null
          name: string
          registration?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          engineer_id?: string
          id?: string
          model?: string | null
          name?: string
          registration?: string | null
          year?: number | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
