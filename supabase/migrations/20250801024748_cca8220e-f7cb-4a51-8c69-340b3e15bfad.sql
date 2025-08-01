-- Update Promo table to match user requirements
-- Make nama field nullable since user only wants kategori, product_id, deskripsi, tanggal_mulai, tanggal_selesai
ALTER TABLE "Promo" ALTER COLUMN "nama" DROP NOT NULL;