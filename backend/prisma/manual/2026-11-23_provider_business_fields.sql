-- Aditiva y reversible: columnas nulas, el codigo anterior las ignora.
-- Aplicada a mano porque el proyecto usa `db push` y el deploy no corre migraciones.
ALTER TABLE "ServiceProvider"
  ADD COLUMN IF NOT EXISTS "businessName" TEXT,
  ADD COLUMN IF NOT EXISTS "experience" INTEGER;
-- Reversa: ALTER TABLE "ServiceProvider" DROP COLUMN "businessName", DROP COLUMN "experience";
