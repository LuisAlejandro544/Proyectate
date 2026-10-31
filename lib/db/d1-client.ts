/**
 * lib/db/d1-client.ts
 * ============================================================================
 * CONECTOR CLIENTE PARA CLOUDFLARE D1 (DATABASE EN EL EDGE)
 *
 * Facilita la conexión con D1 en Cloudflare Pages / Workers usando Drizzle ORM.
 * Proporciona soporte para ejecuciones en el Edge y sincronización con el cliente.
 * ============================================================================
 */

import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

/**
 * Declaración de interfaces compatibles con el runtime de Cloudflare Workers/Pages
 */
export interface CloudflareD1Binding {
  prepare: (query: string) => unknown;
  dump: () => Promise<ArrayBuffer>;
  batch: <T = unknown>(statements: unknown[]) => Promise<T[]>;
  exec: (query: string) => Promise<unknown>;
}

export interface CloudflareEnv {
  DB?: CloudflareD1Binding;
  KV_SESSIONS?: unknown;
  MEDIA_BUCKET?: unknown;
  TURNSTILE_SECRET_KEY?: string;
  BETTER_AUTH_SECRET?: string;
}

/**
 * Crea o recupera la instancia de Drizzle vinculada a la base de datos D1
 */
export function getD1Database(d1Binding?: CloudflareD1Binding) {
  if (!d1Binding) {
    return null;
  }
  // drizzle-orm/d1 espera el objeto D1Database de Cloudflare
  return drizzle(d1Binding as unknown as Parameters<typeof drizzle>[0], { schema });
}
