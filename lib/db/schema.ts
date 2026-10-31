/**
 * lib/db/schema.ts
 * ============================================================================
 * ESQUEMA DE BASE DE DATOS PARA CLOUDFLARE D1 (SQLite en el Edge)
 *
 * Utiliza Drizzle ORM para tipado estricto y migraciones reproducibles.
 * Diseñado específicamente para garantizar:
 * 1. Anonimato de publicaciones sin almacenar direcciones IP personales.
 * 2. Máxima velocidad de lectura en el borde (Edge) de Cloudflare.
 * 3. Integración con Better Auth y sesiones biométricas (Passkeys).
 * ============================================================================
 */

import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

/**
 * Tabla de Usuarios y Máscaras Anónimas
 */
export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    deviceHash: text('device_hash').notNull().unique(), // Hash derivado criptográficamente en el teléfono (Rust WASM)
    activeAlterEgoId: text('active_alter_ego_id').notNull().default('ego-espejo'),
    isAnonymous: integer('is_anonymous', { mode: 'boolean' }).notNull().default(true),
    email: text('email'), // Opcional, solo si el usuario decide respaldar su cuenta
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('idx_users_device').on(table.deviceHash),
  ]
);

/**
 * Sesiones de Autenticación en Edge (Better Auth compatible)
 */
export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('idx_sessions_token').on(table.token),
    index('idx_sessions_user').on(table.userId),
  ]
);

/**
 * Credenciales WebAuthn / Passkeys (Huella / FaceID)
 */
export const passkeyCredentials = sqliteTable('passkey_credentials', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  publicKey: text('public_key').notNull(),
  counter: integer('counter').notNull().default(0),
  deviceType: text('device_type').notNull(),
  backedUp: integer('backed_up', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

/**
 * Publicaciones ("Proyecciones") Anónimas
 */
export const projections = sqliteTable(
  'projections',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    authorName: text('author_name').notNull(),
    authorTag: text('author_tag').notNull(),
    authorBadge: text('author_badge').notNull(),
    authorGradient: text('author_gradient').notNull(),
    text: text('text').notNull(),
    projectionScore: integer('projection_score').notNull(), // Nivel 0-100 calculado por Rust WASM
    diagnosis: text('diagnosis').notNull(), // Diagnóstico satírico
    hashProof: text('hash_proof').notNull(), // Hash FNV-1a / Murmur generado por el cliente
    entropy: integer('entropy').notNull().default(0),
    isViral: integer('is_viral', { mode: 'boolean' }).notNull().default(false),
    tagsJson: text('tags_json').notNull().default('[]'), // Array serializado de hashtags
    reactionsJson: text('reactions_json').notNull().default('{"fire":0,"laugh":0,"crying":0,"skull":0,"eye":0}'),
    replyCount: integer('reply_count').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('idx_projections_created').on(table.createdAt),
    index('idx_projections_score').on(table.projectionScore),
    index('idx_projections_viral').on(table.isViral),
  ]
);

/**
 * Comentarios / Respuestas Anónimas en los Hilos
 */
export const comments = sqliteTable(
  'comments',
  {
    id: text('id').primaryKey(),
    projectionId: text('projection_id')
      .notNull()
      .references(() => projections.id, { onDelete: 'cascade' }),
    authorName: text('author_name').notNull(),
    authorTag: text('author_tag').notNull(),
    authorBadge: text('author_badge').notNull(),
    authorGradient: text('author_gradient').notNull(),
    text: text('text').notNull(),
    score: integer('score').notNull().default(50),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('idx_comments_proj').on(table.projectionId),
  ]
);

/**
 * Reacciones de los Usuarios a las Proyecciones
 */
export const reactions = sqliteTable(
  'reactions',
  {
    id: text('id').primaryKey(),
    projectionId: text('projection_id')
      .notNull()
      .references(() => projections.id, { onDelete: 'cascade' }),
    userDeviceHash: text('user_device_hash').notNull(),
    reactionType: text('reaction_type').notNull(), // 'fire' | 'laugh' | 'crying' | 'skull' | 'eye'
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('idx_reactions_unique').on(table.projectionId, table.userDeviceHash, table.reactionType),
  ]
);

/**
 * Reportes de Moderación Comunitaria
 */
export const moderationReports = sqliteTable('moderation_reports', {
  id: text('id').primaryKey(),
  projectionId: text('projection_id').notNull(),
  reason: text('reason').notNull(), // 'acoso', 'doxxing', 'odio', 'spam'
  status: text('status').notNull().default('pending'), // 'pending', 'resolved', 'dismissed'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
