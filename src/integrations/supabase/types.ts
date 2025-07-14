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
          is_checkout: boolean | null
          phone_number: string
          ringkasan: string | null
          total_berat: number | null
          total_harga: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          is_checkout?: boolean | null
          phone_number: string
          ringkasan?: string | null
          total_berat?: number | null
          total_harga?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_checkout?: boolean | null
          phone_number?: string
          ringkasan?: string | null
          total_berat?: number | null
          total_harga?: number | null
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
            referencedColumns: ["id"]
          },
        ]
      }
      conversations_log: {
        Row: {
          conversation_id: number
          customer_phone: number | null
          id: number
          message_content: string | null
          timestamp: string | null
        }
        Insert: {
          conversation_id: number
          customer_phone?: number | null
          id?: number
          message_content?: string | null
          timestamp?: string | null
        }
        Update: {
          conversation_id?: number
          customer_phone?: number | null
          id?: number
          message_content?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      Keluhan: {
        Row: {
          Datetime: string
          id: string
          Keluhan: string | null
          Nama_Pelanggan: string | null
          Nomor_Pelanggan: number | null
        }
        Insert: {
          Datetime?: string
          id?: string
          Keluhan?: string | null
          Nama_Pelanggan?: string | null
          Nomor_Pelanggan?: number | null
        }
        Update: {
          Datetime?: string
          id?: string
          Keluhan?: string | null
          Nama_Pelanggan?: string | null
          Nomor_Pelanggan?: number | null
        }
        Relationships: []
      }
      Order: {
        Row: {
          alamat_penerima: string | null
          alamat_pengirim: string | null
          created_at: string | null
          id: string
          nama_penerima: string | null
          nama_pengirim: string | null
          no_hp_penerima: string | null
          no_hp_pengirim: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          alamat_penerima?: string | null
          alamat_pengirim?: string | null
          created_at?: string | null
          id: string
          nama_penerima?: string | null
          nama_pengirim?: string | null
          no_hp_penerima?: string | null
          no_hp_pengirim?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          alamat_penerima?: string | null
          alamat_pengirim?: string | null
          created_at?: string | null
          id?: string
          nama_penerima?: string | null
          nama_pengirim?: string | null
          no_hp_penerima?: string | null
          no_hp_pengirim?: string | null
          status?: string | null
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
          product_id: number
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
          product_id?: number
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
          product_id?: number
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
          id: string
          id_produk_terkait: string | null
          jenis: string | null
          judul_promo: string | null
          nama: string
          syarat_ketentuan: string | null
          tanggal_mulai: string | null
          tanggal_selesai: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          id: string
          id_produk_terkait?: string | null
          jenis?: string | null
          judul_promo?: string | null
          nama: string
          syarat_ketentuan?: string | null
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          id_produk_terkait?: string | null
          jenis?: string | null
          judul_promo?: string | null
          nama?: string
          syarat_ketentuan?: string | null
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Promo_id_produk_terkait_fkey"
            columns: ["id_produk_terkait"]
            isOneToOne: false
            referencedRelation: "Produk"
            referencedColumns: ["id"]
          },
        ]
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
      get_user_role: {
        Args: { user_id: string }
        Returns: string
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
