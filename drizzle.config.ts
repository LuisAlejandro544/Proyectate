import { defineConfig } from 'drizzle-kit';

/**
 * Configuración de Drizzle Kit para Cloudflare D1
 * Permite ejecutar: npx drizzle-kit generate
 * Y aplicar migraciones con: npx wrangler d1 migrations apply proyecta-db --remote
 */
export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
});
