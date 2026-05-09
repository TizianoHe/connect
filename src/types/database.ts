export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      service_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon_name: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon_name?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon_name?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      sme_profiles: {
        Row: {
          id: string;
          business_name: string;
          tagline: string | null;
          description: string | null;
          website_url: string | null;
          phone: string | null;
          email_public: string | null;
          location_city: string | null;
          location_country: string;
          avatar_url: string | null;
          onboarding_step: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
          positioning_line: string | null;
          best_suited_for: string | null;
          how_they_work: string | null;
          clients_appreciate: string | null;
          team_size: string | null;
          status: string;
          submitted_at: string | null;
          reviewed_at: string | null;
          rejection_reason: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id: string;
          business_name: string;
          tagline?: string | null;
          description?: string | null;
          website_url?: string | null;
          phone?: string | null;
          email_public?: string | null;
          location_city?: string | null;
          location_country?: string;
          avatar_url?: string | null;
          onboarding_step?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          positioning_line?: string | null;
          best_suited_for?: string | null;
          how_they_work?: string | null;
          clients_appreciate?: string | null;
          team_size?: string | null;
          status?: string;
          submitted_at?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          business_name?: string;
          tagline?: string | null;
          description?: string | null;
          website_url?: string | null;
          phone?: string | null;
          email_public?: string | null;
          location_city?: string | null;
          location_country?: string;
          avatar_url?: string | null;
          onboarding_step?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          positioning_line?: string | null;
          best_suited_for?: string | null;
          how_they_work?: string | null;
          clients_appreciate?: string | null;
          team_size?: string | null;
          status?: string;
          submitted_at?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          reviewed_by?: string | null;
        };
        Relationships: [];
      };
      sme_photos: {
        Row: {
          id: string;
          sme_profile_id: string;
          photo_url: string;
          is_primary: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          sme_profile_id: string;
          photo_url: string;
          is_primary?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          sme_profile_id?: string;
          photo_url?: string;
          is_primary?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sme_photos_sme_profile_id_fkey";
            columns: ["sme_profile_id"];
            isOneToOne: false;
            referencedRelation: "sme_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      app_admins: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          user_type: string | null;
          subject: string;
          message: string;
          status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          user_type?: string | null;
          subject: string;
          message: string;
          status?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          user_type?: string | null;
          subject?: string;
          message?: string;
          status?: string;
        };
        Relationships: [];
      };
      sme_services: {
        Row: {
          id: string;
          sme_id: string;
          category_id: string;
          title: string;
          description: string | null;
          price_from: number | null;
          price_currency: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sme_id: string;
          category_id: string;
          title: string;
          description?: string | null;
          price_from?: number | null;
          price_currency?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sme_id?: string;
          category_id?: string;
          title?: string;
          description?: string | null;
          price_from?: number | null;
          price_currency?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sme_services_sme_id_fkey";
            columns: ["sme_id"];
            isOneToOne: false;
            referencedRelation: "sme_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sme_services_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "service_categories";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
