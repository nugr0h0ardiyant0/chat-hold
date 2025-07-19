-- Add sudah_ditangani column to Keluhan table
ALTER TABLE public."Keluhan" ADD COLUMN sudah_ditangani boolean NOT NULL DEFAULT false;

-- Add index for better performance on sudah_ditangani queries
CREATE INDEX idx_keluhan_sudah_ditangani ON public."Keluhan"(sudah_ditangani);

-- Add index for date queries on Datetime
CREATE INDEX idx_keluhan_datetime ON public."Keluhan"(DATE("Datetime"));