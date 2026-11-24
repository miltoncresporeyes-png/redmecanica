-- Aditiva: tabla nueva para contar contactos y visitas a la vitrina (sin datos personales: solo tipo y fecha).
-- NO esta aplicada: hay que ejecutarla en la base (el proyecto usa `db push` y el deploy no corre migraciones).
-- Mientras no exista, el panel funciona igual (muestra los numeros anteriores) y los eventos se ignoran sin error.
CREATE TABLE IF NOT EXISTS "ProviderEvent" (
  "id"         TEXT PRIMARY KEY,
  "providerId" TEXT NOT NULL REFERENCES "ServiceProvider"("id") ON DELETE CASCADE,
  "type"       TEXT NOT NULL,            -- VIEW | WHATSAPP | CALL
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "ProviderEvent_providerId_createdAt_idx" ON "ProviderEvent" ("providerId", "createdAt");
-- Reversa: DROP TABLE "ProviderEvent";
