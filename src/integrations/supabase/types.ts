export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      Cart: {
        Row: {
          created_at: string
          id: string
          is_checkout: boolean
          phone_number: string
          ringkasan: string | null
          total_berat: number | null
          total_harga: number | null
          total_ongkir: number | null
          total_pembayaran: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          is_checkout?: boolean
          phone_number: string
          ringkasan?: string | null
          total_berat?: number | null
          total_harga?: number | null
          total_ongkir?: number | null
          total_pembayaran?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_checkout?: boolean
          phone_number?: string
          ringkasan?: string | null
          total_berat?: number | null
          total_harga?: number | null
          total_ongkir?: number | null
          total_pembayaran?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      CartItem: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          note: string | null
          produk_id: string
          quantity: number
        }
        Insert: {
          cart_id: string
          created_at?: string
          id: string
          note?: string | null
          produk_id: string
          quantity: number
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          note?: string | null
          produk_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "CartItem_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "Cart"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CartItem_produk_id_fkey"
            columns: ["produk_id"]
            isOneToOne: false
            referencedRelation: "Produk"
            referencedColumns: ["produk_id"]
          },
        ]
      }
      CustomerJourney: {
        Row: {
          created_at: string
          customer_journey: string
          follow_up: boolean
          id: number
          message: string | null
          message_id: string | null
          phone_number: string | null
          session: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          customer_journey?: string
          follow_up?: boolean
          id?: number
          message?: string | null
          message_id?: string | null
          phone_number?: string | null
          session?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          customer_journey?: string
          follow_up?: boolean
          id?: number
          message?: string | null
          message_id?: string | null
          phone_number?: string | null
          session?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      DailyMetrics: {
        Row: {
          created_at: string | null
          date: string
          id: number
          inisiasi_payment_belum_bayar: number | null
          invoice_gagal_bayar: number | null
          keluhan: number | null
          masuk_keranjang: number | null
          pelanggan_tanya: number | null
          sudah_bayar: number | null
          total_chats: number | null
          total_checkouts: number | null
          total_complaints: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: number
          inisiasi_payment_belum_bayar?: number | null
          invoice_gagal_bayar?: number | null
          keluhan?: number | null
          masuk_keranjang?: number | null
          pelanggan_tanya?: number | null
          sudah_bayar?: number | null
          total_chats?: number | null
          total_checkouts?: number | null
          total_complaints?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: number
          inisiasi_payment_belum_bayar?: number | null
          invoice_gagal_bayar?: number | null
          keluhan?: number | null
          masuk_keranjang?: number | null
          pelanggan_tanya?: number | null
          sudah_bayar?: number | null
          total_chats?: number | null
          total_checkouts?: number | null
          total_complaints?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      Keluhan: {
        Row: {
          Datetime: string
          id: string
          Keluhan: string | null
          Nomor_Pelanggan: number | null
          sudah_ditangani: boolean
        }
        Insert: {
          Datetime?: string
          id?: string
          Keluhan?: string | null
          Nomor_Pelanggan?: number | null
          sudah_ditangani?: boolean
        }
        Update: {
          Datetime?: string
          id?: string
          Keluhan?: string | null
          Nomor_Pelanggan?: number | null
          sudah_ditangani?: boolean
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_histories_cozmed: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      Order: {
        Row: {
          alamat_penerima: string | null
          created_at: string | null
          id: string
          nama_penerima: string | null
          no_hp_penerima: string | null
          proses: boolean
          ringkasan: string | null
          status: string | null
          total_pembayaran: number | null
          updated_at: string | null
        }
        Insert: {
          alamat_penerima?: string | null
          created_at?: string | null
          id: string
          nama_penerima?: string | null
          no_hp_penerima?: string | null
          proses?: boolean
          ringkasan?: string | null
          status?: string | null
          total_pembayaran?: number | null
          updated_at?: string | null
        }
        Update: {
          alamat_penerima?: string | null
          created_at?: string | null
          id?: string
          nama_penerima?: string | null
          no_hp_penerima?: string | null
          proses?: boolean
          ringkasan?: string | null
          status?: string | null
          total_pembayaran?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Pembayaran: {
        Row: {
          created_at: string | null
          external_id: string | null
          id: string
          inisiasi_invoice: string | null
          kadaluwarsa_invoice: string | null
          link_invoice: string | null
          link_qris: string | null
          metode: string | null
          order_id: string | null
          phone_number: string
          session: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          external_id?: string | null
          id: string
          inisiasi_invoice?: string | null
          kadaluwarsa_invoice?: string | null
          link_invoice?: string | null
          link_qris?: string | null
          metode?: string | null
          order_id?: string | null
          phone_number: string
          session?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          external_id?: string | null
          id?: string
          inisiasi_invoice?: string | null
          kadaluwarsa_invoice?: string | null
          link_invoice?: string | null
          link_qris?: string | null
          metode?: string | null
          order_id?: string | null
          phone_number?: string
          session?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Produk: {
        Row: {
          berat: number | null
          created_at: string | null
          deskripsi: string | null
          harga: number | null
          id: string
          kategori: string | null
          nama: string
          produk_id: string | null
          stok: number | null
          ukuran: string | null
          updated_at: string | null
          warna: string | null
        }
        Insert: {
          berat?: number | null
          created_at?: string | null
          deskripsi?: string | null
          harga?: number | null
          id: string
          kategori?: string | null
          nama: string
          produk_id?: string | null
          stok?: number | null
          ukuran?: string | null
          updated_at?: string | null
          warna?: string | null
        }
        Update: {
          berat?: number | null
          created_at?: string | null
          deskripsi?: string | null
          harga?: number | null
          id?: string
          kategori?: string | null
          nama?: string
          produk_id?: string | null
          stok?: number | null
          ukuran?: string | null
          updated_at?: string | null
          warna?: string | null
        }
        Relationships: []
      }
      Promo: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          kategori: string
          nama: string | null
          product_id: string | null
          tanggal_mulai: string | null
          tanggal_selesai: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          kategori: string
          nama?: string | null
          product_id?: string | null
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          kategori?: string
          nama?: string | null
          product_id?: string | null
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Promo_id_produk_terkait_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Produk"
            referencedColumns: ["id"]
          },
        ]
      }
      temp_message: {
        Row: {
          chat_id: string | null
          id: number
          message: string | null
          message_id: string | null
          session_id: string
          timestamp: string | null
        }
        Insert: {
          chat_id?: string | null
          id?: number
          message?: string | null
          message_id?: string | null
          session_id: string
          timestamp?: string | null
        }
        Update: {
          chat_id?: string | null
          id?: number
          message?: string | null
          message_id?: string | null
          session_id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      User: {
        Row: {
          created_at: string | null
          is_hold: boolean | null
          last_message: string | null
          phone_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          is_hold?: boolean | null
          last_message?: string | null
          phone_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          is_hold?: boolean | null
          last_message?: string | null
          phone_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_follow_up: {
        Row: {
          id: number
          is_need_followup: number | null
          last_interact: string | null
          last_status_description: string | null
          user_phone_number: string | null
        }
        Insert: {
          id?: number
          is_need_followup?: number | null
          last_interact?: string | null
          last_status_description?: string | null
          user_phone_number?: string | null
        }
        Update: {
          id?: number
          is_need_followup?: number | null
          last_interact?: string | null
          last_status_description?: string | null
          user_phone_number?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          password_hash: string | null
          role: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          password_hash?: string | null
          role?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          password_hash?: string | null
          role?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_update_daily_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      create_customer_journey: {
        Args: {
          p_phone_number: string
          p_customer_journey: string
          p_follow_up: boolean
          p_message: string
          p_message_id: string
          p_session: string
        }
        Returns: undefined
      }
      debug_ringkasan_order: {
        Args: Record<PropertyKey, never>
        Returns: {
          order_id_original: string
          cart_id_original: string
          order_id_processed: string
          cart_id_processed: string
          join_condition: boolean
        }[]
      }
      get_chat_metrics_range: {
        Args: { start_date: string; end_date: string }
        Returns: number
      }
      get_checkout_metrics_range: {
        Args: { start_date: string; end_date: string }
        Returns: number
      }
      get_complaints_metrics_range: {
        Args: { start_date: string; end_date: string }
        Returns: number
      }
      get_customer_journey_metrics_range: {
        Args: { start_date: string; end_date: string }
        Returns: number
      }
      get_customer_journey_stage_metrics: {
        Args: { start_date: string; end_date: string }
        Returns: {
          customer_journey: string
          count: number
        }[]
      }
      get_customer_journeys: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          phone_number: string
          customer_journey: string
          follow_up: boolean
          message: string
          message_id: string
          session: string
          created_at: string
          updated_at: string
        }[]
      }
      get_daily_customer_journey_metrics: {
        Args: Record<PropertyKey, never> | { target_date?: string }
        Returns: number
      }
      get_daily_metrics_range: {
        Args: { start_date: string; end_date: string }
        Returns: {
          date: string
          total_chats: number
          total_complaints: number
          total_checkouts: number
          pelanggan_tanya: number
          masuk_keranjang: number
          inisiasi_payment_belum_bayar: number
          invoice_gagal_bayar: number
          sudah_bayar: number
          keluhan: number
        }[]
      }
      get_follow_up_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_ringkasan_order: {
        Args: Record<PropertyKey, never>
        Returns: {
          nama_penerima: string
          no_hp_penerima: string
          alamat_penerima: string
          status: string
          proses: boolean
          total_pembayaran: number
          total_ongkir: number
          order_id: string
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      store_daily_metrics: {
        Args: { target_date?: string }
        Returns: undefined
      }
      update_customer_journey: {
        Args: {
          journey_id: number
          p_phone_number: string
          p_customer_journey: string
          p_follow_up: boolean
          p_message: string
          p_message_id: string
          p_session: string
        }
        Returns: undefined
      }
      update_customer_journey_followup: {
        Args: { journey_id: number; new_follow_up: boolean }
        Returns: undefined
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
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
