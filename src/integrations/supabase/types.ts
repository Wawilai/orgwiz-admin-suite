export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          organization_id: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      billing_accounts: {
        Row: {
          account_name: string
          billing_address: string | null
          billing_email: string
          created_at: string
          currency: string
          id: string
          organization_id: string
          payment_method: string | null
          payment_terms: number | null
          status: string
          tax_rate: number | null
          updated_at: string
        }
        Insert: {
          account_name: string
          billing_address?: string | null
          billing_email: string
          created_at?: string
          currency?: string
          id?: string
          organization_id: string
          payment_method?: string | null
          payment_terms?: number | null
          status?: string
          tax_rate?: number | null
          updated_at?: string
        }
        Update: {
          account_name?: string
          billing_address?: string | null
          billing_email?: string
          created_at?: string
          currency?: string
          id?: string
          organization_id?: string
          payment_method?: string | null
          payment_terms?: number | null
          status?: string
          tax_rate?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string | null
          company: string | null
          contact_type: string
          created_at: string
          created_by: string
          department: string | null
          email: string | null
          first_name: string
          id: string
          is_vip: boolean
          last_contact_date: string | null
          last_name: string
          notes: string | null
          organization_id: string
          phone: string | null
          position: string | null
          tags: Json | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company?: string | null
          contact_type: string
          created_at?: string
          created_by: string
          department?: string | null
          email?: string | null
          first_name: string
          id?: string
          is_vip?: boolean
          last_contact_date?: string | null
          last_name: string
          notes?: string | null
          organization_id: string
          phone?: string | null
          position?: string | null
          tags?: Json | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company?: string | null
          contact_type?: string
          created_at?: string
          created_by?: string
          department?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_vip?: boolean
          last_contact_date?: string | null
          last_name?: string
          notes?: string | null
          organization_id?: string
          phone?: string | null
          position?: string | null
          tags?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          created_at: string
          dkim_enabled: boolean
          dkim_selector: string | null
          dmarc_enabled: boolean
          dmarc_policy: string | null
          expires_at: string | null
          id: string
          max_aliases: number | null
          max_mailboxes: number | null
          mx_records: Json | null
          name: string
          organization_id: string
          routing_enabled: boolean
          spf_enabled: boolean
          spf_record: string | null
          status: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          dkim_enabled?: boolean
          dkim_selector?: string | null
          dmarc_enabled?: boolean
          dmarc_policy?: string | null
          expires_at?: string | null
          id?: string
          max_aliases?: number | null
          max_mailboxes?: number | null
          mx_records?: Json | null
          name: string
          organization_id: string
          routing_enabled?: boolean
          spf_enabled?: boolean
          spf_record?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          dkim_enabled?: boolean
          dkim_selector?: string | null
          dmarc_enabled?: boolean
          dmarc_policy?: string | null
          expires_at?: string | null
          id?: string
          max_aliases?: number | null
          max_mailboxes?: number | null
          mx_records?: Json | null
          name?: string
          organization_id?: string
          routing_enabled?: boolean
          spf_enabled?: boolean
          spf_record?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "domains_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      license_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          is_active: boolean
          license_id: string
          revoked_at: string | null
          revoked_by: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          is_active?: boolean
          license_id: string
          revoked_at?: string | null
          revoked_by?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          is_active?: boolean
          license_id?: string
          revoked_at?: string | null
          revoked_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "license_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "license_assignments_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "license_assignments_revoked_by_fkey"
            columns: ["revoked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "license_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      license_usage_logs: {
        Row: {
          created_at: string
          duration_minutes: number | null
          features_used: Json | null
          id: string
          ip_address: unknown | null
          license_id: string
          session_end: string | null
          session_start: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          features_used?: Json | null
          id?: string
          ip_address?: unknown | null
          license_id: string
          session_end?: string | null
          session_start?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          features_used?: Json | null
          id?: string
          ip_address?: unknown | null
          license_id?: string
          session_end?: string | null
          session_start?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "license_usage_logs_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "license_usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      licenses: {
        Row: {
          auto_renew: boolean
          created_at: string
          expiry_date: string
          features: Json
          id: string
          issue_date: string
          last_used: string | null
          license_key: string
          license_type: string
          max_users: number
          notes: string | null
          organization_id: string
          product_name: string
          status: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          auto_renew?: boolean
          created_at?: string
          expiry_date: string
          features?: Json
          id?: string
          issue_date: string
          last_used?: string | null
          license_key: string
          license_type: string
          max_users?: number
          notes?: string | null
          organization_id: string
          product_name: string
          status?: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          auto_renew?: boolean
          created_at?: string
          expiry_date?: string
          features?: Json
          id?: string
          issue_date?: string
          last_used?: string | null
          license_key?: string
          license_type?: string
          max_users?: number
          notes?: string | null
          organization_id?: string
          product_name?: string
          status?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "licenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      mailboxes: {
        Row: {
          created_at: string
          display_name: string | null
          domain_id: string
          domain_name: string | null
          id: string
          last_login: string | null
          local_part: string
          password_hash: string | null
          quota_mb: number | null
          status: string
          updated_at: string
          used_quota_mb: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          domain_id: string
          domain_name?: string | null
          id?: string
          last_login?: string | null
          local_part: string
          password_hash?: string | null
          quota_mb?: number | null
          status?: string
          updated_at?: string
          used_quota_mb?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          domain_id?: string
          domain_name?: string | null
          id?: string
          last_login?: string | null
          local_part?: string
          password_hash?: string | null
          quota_mb?: number | null
          status?: string
          updated_at?: string
          used_quota_mb?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mailboxes_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mailboxes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      master_data_items: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          organization_id: string | null
          sort_order: number | null
          type_id: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          organization_id?: string | null
          sort_order?: number | null
          type_id: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string | null
          sort_order?: number | null
          type_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_data_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_data_items_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "master_data_types"
            referencedColumns: ["id"]
          },
        ]
      }
      master_data_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system_type: boolean
          type_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_type?: boolean
          type_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_type?: boolean
          type_name?: string
        }
        Relationships: []
      }
      organization_units: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          id: string
          manager_user_id: string | null
          name: string
          organization_id: string
          parent_unit_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          manager_user_id?: string | null
          name: string
          organization_id: string
          parent_unit_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          manager_user_id?: string | null
          name?: string
          organization_id?: string
          parent_unit_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_organization_units_manager"
            columns: ["manager_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_units_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_units_parent_unit_id_fkey"
            columns: ["parent_unit_id"]
            isOneToOne: false
            referencedRelation: "organization_units"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          email: string
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          registration_number: string | null
          status: string
          tax_id: string | null
          type: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          email: string
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          registration_number?: string | null
          status?: string
          tax_id?: string | null
          type: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          registration_number?: string | null
          status?: string
          tax_id?: string | null
          type?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string
          employee_id: string | null
          end_date: string | null
          first_name: string
          id: string
          language: string | null
          last_login: string | null
          last_name: string
          manager_id: string | null
          organization_id: string
          organization_unit_id: string | null
          phone: string | null
          position: string | null
          start_date: string | null
          status: string
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          employee_id?: string | null
          end_date?: string | null
          first_name: string
          id?: string
          language?: string | null
          last_login?: string | null
          last_name: string
          manager_id?: string | null
          organization_id: string
          organization_unit_id?: string | null
          phone?: string | null
          position?: string | null
          start_date?: string | null
          status?: string
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          employee_id?: string | null
          end_date?: string | null
          first_name?: string
          id?: string
          language?: string | null
          last_login?: string | null
          last_name?: string
          manager_id?: string | null
          organization_id?: string
          organization_unit_id?: string | null
          phone?: string | null
          position?: string | null
          start_date?: string | null
          status?: string
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_organization_unit_id_fkey"
            columns: ["organization_unit_id"]
            isOneToOne: false
            referencedRelation: "organization_units"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system_role: boolean
          name: string
          organization_id: string | null
          permissions: Json
          role_type: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean
          name: string
          organization_id?: string | null
          permissions?: Json
          role_type: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean
          name?: string
          organization_id?: string | null
          permissions?: Json
          role_type?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      security_policies: {
        Row: {
          applied_to: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          last_modified_by: string | null
          name: string
          organization_id: string | null
          policy_rules: Json
          policy_type: string
          severity: string | null
          status: string
          updated_at: string
        }
        Insert: {
          applied_to?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          last_modified_by?: string | null
          name: string
          organization_id?: string | null
          policy_rules?: Json
          policy_type: string
          severity?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          applied_to?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          last_modified_by?: string | null
          name?: string
          organization_id?: string | null
          policy_rules?: Json
          policy_type?: string
          severity?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_policies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "security_policies_last_modified_by_fkey"
            columns: ["last_modified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "security_policies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_quotas: {
        Row: {
          allocated_mb: number
          created_at: string
          id: string
          last_calculated: string | null
          organization_id: string
          quota_type: string
          updated_at: string
          used_mb: number
          user_id: string | null
          warning_threshold_mb: number | null
        }
        Insert: {
          allocated_mb?: number
          created_at?: string
          id?: string
          last_calculated?: string | null
          organization_id: string
          quota_type: string
          updated_at?: string
          used_mb?: number
          user_id?: string | null
          warning_threshold_mb?: number | null
        }
        Update: {
          allocated_mb?: number
          created_at?: string
          id?: string
          last_calculated?: string | null
          organization_id?: string
          quota_type?: string
          updated_at?: string
          used_mb?: number
          user_id?: string | null
          warning_threshold_mb?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "storage_quotas_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_quotas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_full_email_address: {
        Args: { domain_id: string; local_part: string }
        Returns: string
      }
      get_organization_stats: {
        Args: { org_id: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role_type: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      initialize_organization: {
        Args: {
          admin_email?: string
          admin_first_name?: string
          admin_last_name?: string
          org_email: string
          org_name: string
          org_type?: string
        }
        Returns: string
      }
      is_organization_admin: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { _user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "organization_admin"
        | "manager"
        | "user"
        | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "organization_admin",
        "manager",
        "user",
        "viewer",
      ],
    },
  },
} as const
