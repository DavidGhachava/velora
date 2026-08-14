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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      amenities: {
        Row: {
          active: boolean
          code: string
          icon: string
          id: string
          name_en: string
          name_ka: string
        }
        Insert: {
          active?: boolean
          code: string
          icon: string
          id?: string
          name_en: string
          name_ka: string
        }
        Update: {
          active?: boolean
          code?: string
          icon?: string
          id?: string
          name_en?: string
          name_ka?: string
        }
        Relationships: []
      }
      app_users: {
        Row: {
          active: boolean
          created_at: string
          email: string
          full_name: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          full_name: string
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          action: string
          actor_id: string | null
          after_data: Json | null
          before_data: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          occurred_at: string
          reason: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          occurred_at?: string
          reason?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          occurred_at?: string
          reason?: string | null
        }
        Relationships: []
      }
      catalog_items: {
        Row: {
          active: boolean
          amount_minor: number
          catalog: string
          currency: string
          description_en: string | null
          description_ka: string | null
          id: string
          image_path: string | null
          name_en: string
          name_ka: string
          pricing_unit: string
          property_id: string | null
          sku: string
          stock: number | null
        }
        Insert: {
          active?: boolean
          amount_minor: number
          catalog: string
          currency?: string
          description_en?: string | null
          description_ka?: string | null
          id?: string
          image_path?: string | null
          name_en: string
          name_ka: string
          pricing_unit?: string
          property_id?: string | null
          sku: string
          stock?: number | null
        }
        Update: {
          active?: boolean
          amount_minor?: number
          catalog?: string
          currency?: string
          description_en?: string | null
          description_ka?: string | null
          id?: string
          image_path?: string | null
          name_en?: string
          name_ka?: string
          pricing_unit?: string
          property_id?: string | null
          sku?: string
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_items_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_rates: {
        Row: {
          amount_minor: number
          closed: boolean
          currency: string
          id: string
          minimum_stay: number
          rate_plan_id: string
          room_type_id: string
          stay_date: string
        }
        Insert: {
          amount_minor: number
          closed?: boolean
          currency?: string
          id?: string
          minimum_stay?: number
          rate_plan_id: string
          room_type_id: string
          stay_date: string
        }
        Update: {
          amount_minor?: number
          closed?: boolean
          currency?: string
          id?: string
          minimum_stay?: number
          rate_plan_id?: string
          room_type_id?: string
          stay_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_rates_rate_plan_id_fkey"
            columns: ["rate_plan_id"]
            isOneToOne: false
            referencedRelation: "rate_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_rates_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_snapshots: {
        Row: {
          id: string
          name: string
          payload: Json
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          payload: Json
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          payload?: Json
          updated_at?: string
        }
        Relationships: []
      }
      folio_entries: {
        Row: {
          amount_minor: number
          description: string
          entry_type: string
          folio_id: string
          id: string
          posted_at: string
          reverses_entry_id: string | null
          source_id: string | null
          source_type: string | null
        }
        Insert: {
          amount_minor: number
          description: string
          entry_type: string
          folio_id: string
          id?: string
          posted_at?: string
          reverses_entry_id?: string | null
          source_id?: string | null
          source_type?: string | null
        }
        Update: {
          amount_minor?: number
          description?: string
          entry_type?: string
          folio_id?: string
          id?: string
          posted_at?: string
          reverses_entry_id?: string | null
          source_id?: string | null
          source_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folio_entries_folio_id_fkey"
            columns: ["folio_id"]
            isOneToOne: false
            referencedRelation: "folios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folio_entries_reverses_entry_id_fkey"
            columns: ["reverses_entry_id"]
            isOneToOne: false
            referencedRelation: "folio_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      folios: {
        Row: {
          created_at: string
          currency: string
          id: string
          reservation_id: string
          status: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          reservation_id: string
          status?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          reservation_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "folios_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          locale: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          locale?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          locale?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      housekeeping_tasks: {
        Row: {
          created_at: string
          due_at: string | null
          id: string
          notes: string | null
          priority: string
          reservation_id: string | null
          room_id: string
          service_type: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_at?: string | null
          id?: string
          notes?: string | null
          priority?: string
          reservation_id?: string | null
          room_id: string
          service_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_at?: string | null
          id?: string
          notes?: string | null
          priority?: string
          reservation_id?: string | null
          room_id?: string
          service_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "housekeeping_tasks_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "housekeeping_tasks_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_minor: number
          captured_at: string | null
          created_at: string
          currency: string
          id: string
          provider: string
          provider_reference: string
          reservation_id: string
          status: string
        }
        Insert: {
          amount_minor: number
          captured_at?: string | null
          created_at?: string
          currency?: string
          id?: string
          provider: string
          provider_reference: string
          reservation_id: string
          status: string
        }
        Update: {
          amount_minor?: number
          captured_at?: string | null
          created_at?: string
          currency?: string
          id?: string
          provider?: string
          provider_reference?: string
          reservation_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          area: string
          check_in_time: string
          check_out_time: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          currency: string
          display_order: number
          id: string
          latitude: number | null
          longitude: number | null
          property_type: string
          slug: string
          status: string
          timezone: string
          updated_at: string
        }
        Insert: {
          address: string
          area: string
          check_in_time?: string
          check_out_time?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          display_order?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          property_type: string
          slug: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          address?: string
          area?: string
          check_in_time?: string
          check_out_time?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          display_order?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          property_type?: string
          slug?: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_amenities: {
        Row: {
          amenity_id: string
          included: boolean
          note_en: string | null
          note_ka: string | null
          property_id: string
        }
        Insert: {
          amenity_id: string
          included?: boolean
          note_en?: string | null
          note_ka?: string | null
          property_id: string
        }
        Update: {
          amenity_id?: string
          included?: boolean
          note_en?: string | null
          note_ka?: string | null
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_amenities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_media: {
        Row: {
          alt_en: string
          alt_ka: string
          created_at: string
          focal_x: number
          focal_y: number
          height: number | null
          id: string
          is_cover: boolean
          property_id: string
          sort_order: number
          source_url: string | null
          storage_path: string | null
          width: number | null
        }
        Insert: {
          alt_en: string
          alt_ka: string
          created_at?: string
          focal_x?: number
          focal_y?: number
          height?: number | null
          id?: string
          is_cover?: boolean
          property_id: string
          sort_order?: number
          source_url?: string | null
          storage_path?: string | null
          width?: number | null
        }
        Update: {
          alt_en?: string
          alt_ka?: string
          created_at?: string
          focal_x?: number
          focal_y?: number
          height?: number | null
          id?: string
          is_cover?: boolean
          property_id?: string
          sort_order?: number
          source_url?: string | null
          storage_path?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "property_media_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_translations: {
        Row: {
          description: string
          locale: string
          name: string
          policies: string | null
          property_id: string
          short_description: string
        }
        Insert: {
          description: string
          locale: string
          name: string
          policies?: string | null
          property_id: string
          short_description: string
        }
        Update: {
          description?: string
          locale?: string
          name?: string
          policies?: string | null
          property_id?: string
          short_description?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_translations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_plans: {
        Row: {
          active: boolean
          cancellation_policy_en: string
          cancellation_policy_ka: string
          code: string
          id: string
          name_en: string
          name_ka: string
          property_id: string
        }
        Insert: {
          active?: boolean
          cancellation_policy_en: string
          cancellation_policy_ka: string
          code: string
          id?: string
          name_en: string
          name_ka: string
          property_id: string
        }
        Update: {
          active?: boolean
          cancellation_policy_en?: string
          cancellation_policy_ka?: string
          code?: string
          id?: string
          name_en?: string
          name_ka?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rate_plans_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_stays: {
        Row: {
          id: string
          nightly_rates: Json
          rate_plan_id: string | null
          reservation_id: string
          room_type_id: string
          status: string
          stay_range: unknown
        }
        Insert: {
          id?: string
          nightly_rates?: Json
          rate_plan_id?: string | null
          reservation_id: string
          room_type_id: string
          status?: string
          stay_range: unknown
        }
        Update: {
          id?: string
          nightly_rates?: Json
          rate_plan_id?: string | null
          reservation_id?: string
          room_type_id?: string
          status?: string
          stay_range?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "reservation_stays_rate_plan_id_fkey"
            columns: ["rate_plan_id"]
            isOneToOne: false
            referencedRelation: "rate_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_stays_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_stays_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          actual_check_in: string | null
          actual_check_out: string | null
          adults: number
          check_in: string
          check_out: string
          children: number
          confirmation_number: string
          created_at: string
          currency: string
          id: string
          primary_guest_id: string
          property_id: string
          source: string
          special_requests: string | null
          status: string
          total_minor: number
          updated_at: string
        }
        Insert: {
          actual_check_in?: string | null
          actual_check_out?: string | null
          adults: number
          check_in: string
          check_out: string
          children?: number
          confirmation_number: string
          created_at?: string
          currency?: string
          id?: string
          primary_guest_id: string
          property_id: string
          source?: string
          special_requests?: string | null
          status: string
          total_minor: number
          updated_at?: string
        }
        Update: {
          actual_check_in?: string | null
          actual_check_out?: string | null
          adults?: number
          check_in?: string
          check_out?: string
          children?: number
          confirmation_number?: string
          created_at?: string
          currency?: string
          id?: string
          primary_guest_id?: string
          property_id?: string
          source?: string
          special_requests?: string | null
          status?: string
          total_minor?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_primary_guest_id_fkey"
            columns: ["primary_guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      room_assignments: {
        Row: {
          created_at: string
          id: string
          property_id: string
          reservation_stay_id: string
          room_id: string
          status: string
          stay_range: unknown
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          reservation_stay_id: string
          room_id: string
          status?: string
          stay_range: unknown
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          reservation_stay_id?: string
          room_id?: string
          status?: string
          stay_range?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "room_assignments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_assignments_reservation_stay_id_fkey"
            columns: ["reservation_stay_id"]
            isOneToOne: false
            referencedRelation: "reservation_stays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_assignments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_blocks: {
        Row: {
          active: boolean
          created_at: string
          id: string
          kind: string
          property_id: string
          reason: string
          room_id: string
          stay_range: unknown
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          kind: string
          property_id: string
          reason: string
          room_id: string
          stay_range: unknown
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          property_id?: string
          reason?: string
          room_id?: string
          stay_range?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "room_blocks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_blocks_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_type_amenities: {
        Row: {
          amenity_id: string
          included: boolean
          room_type_id: string
        }
        Insert: {
          amenity_id: string
          included?: boolean
          room_type_id: string
        }
        Update: {
          amenity_id?: string
          included?: boolean
          room_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_type_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_type_amenities_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_type_media: {
        Row: {
          alt_en: string
          alt_ka: string
          id: string
          is_cover: boolean
          room_type_id: string
          sort_order: number
          source_url: string | null
          storage_path: string | null
        }
        Insert: {
          alt_en: string
          alt_ka: string
          id?: string
          is_cover?: boolean
          room_type_id: string
          sort_order?: number
          source_url?: string | null
          storage_path?: string | null
        }
        Update: {
          alt_en?: string
          alt_ka?: string
          id?: string
          is_cover?: boolean
          room_type_id?: string
          sort_order?: number
          source_url?: string | null
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_type_media_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_type_translations: {
        Row: {
          description: string
          locale: string
          name: string
          room_type_id: string
        }
        Insert: {
          description: string
          locale: string
          name: string
          room_type_id: string
        }
        Update: {
          description?: string
          locale?: string
          name?: string
          room_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_type_translations_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          accessible: boolean
          active: boolean
          base_rate_minor: number
          bed_type: string
          code: string
          created_at: string
          display_order: number
          id: string
          max_guests: number
          property_id: string
          size_m2: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          accessible?: boolean
          active?: boolean
          base_rate_minor?: number
          bed_type: string
          code: string
          created_at?: string
          display_order?: number
          id?: string
          max_guests: number
          property_id: string
          size_m2?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          accessible?: boolean
          active?: boolean
          base_rate_minor?: number
          bed_type?: string
          code?: string
          created_at?: string
          display_order?: number
          id?: string
          max_guests?: number
          property_id?: string
          size_m2?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          active: boolean
          condition_status: string
          created_at: string
          floor: number | null
          id: string
          number: string
          occupancy_status: string
          privacy_status: string
          property_id: string
          room_type_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          condition_status?: string
          created_at?: string
          floor?: number | null
          id?: string
          number: string
          occupancy_status?: string
          privacy_status?: string
          property_id: string
          room_type_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          condition_status?: string
          created_at?: string
          floor?: number | null
          id?: string
          number?: string
          occupancy_status?: string
          privacy_status?: string
          property_id?: string
          room_type_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      service_order_items: {
        Row: {
          catalog_item_id: string
          id: string
          name_snapshot: string
          order_id: string
          quantity: number
          unit_amount_minor: number
        }
        Insert: {
          catalog_item_id: string
          id?: string
          name_snapshot: string
          order_id: string
          quantity: number
          unit_amount_minor: number
        }
        Update: {
          catalog_item_id?: string
          id?: string
          name_snapshot?: string
          order_id?: string
          quantity?: number
          unit_amount_minor?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_order_items_catalog_item_id_fkey"
            columns: ["catalog_item_id"]
            isOneToOne: false
            referencedRelation: "catalog_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          created_at: string
          id: string
          posted_to_folio: boolean
          reservation_id: string
          room_id: string
          status: string
          total_minor: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          posted_to_folio?: boolean
          reservation_id: string
          room_id: string
          status?: string
          total_minor?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          posted_to_folio?: boolean
          reservation_id?: string
          room_id?: string
          status?: string
          total_minor?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_reservation_room: {
        Args: { p_reservation_id: string; p_room_id: string }
        Returns: undefined
      }
      check_in_reservation: {
        Args: { p_reservation_id: string }
        Returns: undefined
      }
      check_out_reservation: {
        Args: { p_reservation_id: string }
        Returns: undefined
      }
      create_direct_booking:
        | {
            Args: {
              p_adults: number
              p_check_in: string
              p_check_out: string
              p_children: number
              p_email: string
              p_extras: Json
              p_first_name: string
              p_last_name: string
              p_locale: string
              p_payment_reference: string
              p_phone: string
              p_room_type_id: string
              p_special_requests: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_adults: number
              p_check_in: string
              p_check_out: string
              p_children: number
              p_email: string
              p_first_name: string
              p_last_name: string
              p_locale: string
              p_payment_reference: string
              p_phone: string
              p_room_type_id: string
              p_special_requests: string
            }
            Returns: Json
          }
      manage_property: {
        Args: {
          p_address: string
          p_area: string
          p_check_in_time: string
          p_check_out_time: string
          p_contact_email?: string
          p_contact_phone?: string
          p_description_en: string
          p_description_ka: string
          p_id?: string
          p_latitude?: number
          p_longitude?: number
          p_name_en: string
          p_name_ka: string
          p_policies_en?: string
          p_policies_ka?: string
          p_property_type: string
          p_short_description_en: string
          p_short_description_ka: string
          p_slug: string
          p_status: string
        }
        Returns: string
      }
      manage_room_type: {
        Args: {
          p_accessible: boolean
          p_active: boolean
          p_base_rate_minor: number
          p_bed_type: string
          p_code: string
          p_description_en: string
          p_description_ka: string
          p_id?: string
          p_max_guests: number
          p_name_en: string
          p_name_ka: string
          p_property_id: string
          p_size_m2?: number
          p_slug: string
        }
        Returns: string
      }
      search_available_room_types: {
        Args: { p_check_in: string; p_check_out: string; p_guests: number }
        Returns: {
          available_count: number
          room_type_id: string
        }[]
      }
      set_property_cover: {
        Args: { p_media_id: string; p_property_id: string }
        Returns: undefined
      }
      set_room_condition: {
        Args: { p_condition: string; p_room_id: string }
        Returns: undefined
      }
      settle_reservation_folio: {
        Args: { p_reservation_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

