export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          created_at: string;
          id: string;
          profile_id: string;
          reseller_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          profile_id: string;
          reseller_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          profile_id?: string;
          reseller_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customers_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "customers_reseller_id_fkey";
            columns: ["reseller_id"];
            isOneToOne: false;
            referencedRelation: "resellers";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          is_active: boolean;
          onboarding_completed: boolean;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"] | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          is_active?: boolean;
          onboarding_completed?: boolean;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          is_active?: boolean;
          onboarding_completed?: boolean;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      resellers: {
        Row: {
          created_at: string;
          id: string;
          is_public: boolean;
          profile_id: string;
          public_id: string;
          public_name: string;
          search_name: string;
          slug: string;
          status: Database["public"]["Enums"]["reseller_status"];
          store_name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_public?: boolean;
          profile_id: string;
          public_id?: string;
          public_name: string;
          search_name: string;
          slug: string;
          status?: Database["public"]["Enums"]["reseller_status"];
          store_name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_public?: boolean;
          profile_id?: string;
          public_id?: string;
          public_name?: string;
          search_name?: string;
          slug?: string;
          status?: Database["public"]["Enums"]["reseller_status"];
          store_name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "resellers_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      complete_customer_onboarding: {
        Args: {
          p_full_name: string;
          p_phone?: string | null;
          p_reseller_public_id: string;
        };
        Returns: {
          customer_id: string | null;
          is_active: boolean;
          linked_reseller_id: string | null;
          linked_reseller_public_id: string | null;
          onboarding_completed: boolean;
          profile_id: string;
          reseller_id: string | null;
          reseller_public_id: string | null;
          role: Database["public"]["Enums"]["user_role"] | null;
        }[];
      };
      complete_reseller_onboarding: {
        Args: {
          p_full_name: string;
          p_phone?: string | null;
          p_public_name?: string | null;
          p_slug?: string | null;
          p_store_name: string;
        };
        Returns: {
          customer_id: string | null;
          is_active: boolean;
          linked_reseller_id: string | null;
          linked_reseller_public_id: string | null;
          onboarding_completed: boolean;
          profile_id: string;
          reseller_id: string | null;
          reseller_public_id: string | null;
          role: Database["public"]["Enums"]["user_role"] | null;
        }[];
      };
      get_current_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: Database["public"]["Enums"]["user_role"] | null;
      };
      get_my_user_context: {
        Args: Record<PropertyKey, never>;
        Returns: {
          customer_id: string | null;
          is_active: boolean;
          linked_reseller_id: string | null;
          linked_reseller_public_id: string | null;
          onboarding_completed: boolean;
          profile_id: string;
          reseller_id: string | null;
          reseller_public_id: string | null;
          role: Database["public"]["Enums"]["user_role"] | null;
        }[];
      };
      search_resellers: {
        Args: {
          result_limit?: number | null;
          search_term?: string | null;
        };
        Returns: {
          public_id: string;
          public_name: string;
          slug: string;
          status: Database["public"]["Enums"]["reseller_status"];
        }[];
      };
    };
    Enums: {
      reseller_status: "pending" | "active" | "inactive" | "suspended";
      user_role: "reseller" | "customer";
    };
    CompositeTypes: Record<string, never>;
  };
}

export type UserRole = Database["public"]["Enums"]["user_role"];
export type ResellerStatus = Database["public"]["Enums"]["reseller_status"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Reseller = Database["public"]["Tables"]["resellers"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type CurrentUserContext = Database["public"]["Functions"]["get_my_user_context"]["Returns"][number];
export type PublicResellerSearchResult =
  Database["public"]["Functions"]["search_resellers"]["Returns"][number];
