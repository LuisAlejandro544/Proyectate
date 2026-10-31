/**
 * lib/types.ts
 * ============================================================================
 * Definiciones de tipos de TypeScript para la red social "Proyecta".
 *
 * Contiene todas las estructuras de datos requeridas para:
 * 1. Proyecciones anónimas (equivalente a posts/tweets de la red social)
 * 2. Comentarios y respuestas en hilos
 * 3. Reacciones de la cultura de internet ("Me proyecté", "Te proyectaste durísimo", etc.)
 * 4. Máscaras y alter egos anónimos generados criptográficamente
 * 5. Modelos para el Laboratorio WebAssembly (lenguajes, benchmarks, métricas)
 * ============================================================================
 */

export type ProjectionCategory =
  | 'te-proyectaste'      // #TeProyectasteDurisimo: críticas o juicios que revelan la propia herida
  | 'delulu-moment'       // #MiMomentoDelulu: fantasías o autoengaño romántico
  | 'situationship'       // #Situationship: relaciones sin etiqueta pero con drama completo
  | 'canon-event'         // #CanonEvent: situaciones inevitables que todos sufrimos
  | 'inseguridad-cruda'   // #InseguridadDesbloqueada: confesiones vulnerables hiperespecíficas
  | 'indirecta-astral';   // #IndirectaMuyDirecta: mensajes dirigidos a alguien sin etiquetar

export interface ProjectionReactionCounts {
  meProyecte: number;     // "100% soy yo / Me dolió en el alma" 🪞
  teProyectaste: number;  // "Te proyectaste durísimo amigo" 💀
  vineAReir: number;      // "Vine a reír no a llorar" 😭
  confirmo: number;       // "Confirmo palabra por palabra" 🤝
  terapia: number;        // "Necesitas terapia urgente" 🛋️
}

export type ReactionType = keyof ProjectionReactionCounts;

export interface AnonymousComment {
  id: string;
  projectionId: string;
  authorAlias: string;
  authorTag: string;
  avatarGradient: string;
  content: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
  wasmCertified: boolean;
}

export interface Projection {
  id: string;
  authorAlias: string;           // Nombre anónimo (ej: "Proyector #7401", "Delulu_Cómico")
  authorTag: string;             // Tag único (ej: "@anon_mirror_992")
  avatarGradient: string;        // Gradiente visual para el avatar
  content: string;               // Texto de la proyección
  category: ProjectionCategory;  // Categoría temática
  categoryLabel: string;         // Nombre legible (ej: "#TeProyectasteDurisimo")
  createdAt: string;             // Fecha relativa o timestamp
  createdTimestamp: number;      // Timestamp numérico para ordenamiento
  reactions: ProjectionReactionCounts;
  userReactions: Record<string, boolean>; // Reacciones dadas por el usuario actual
  replyCount: number;
  quoteCount: number;
  projectionLevel: number;       // Porcentaje de 0 a 100 calculado por WebAssembly
  psychologicalDiagnosis: string;// Diagnóstico satírico (ej: "Trauma no resuelto disfrazado de humor")
  wasmHash: string;              // Firma criptográfica generada en WebAssembly
  verifiedByWasm: boolean;       // Verificado por el módulo WASM
  comments?: AnonymousComment[];
}

export interface AnonymousAlterEgo {
  id: string;
  name: string;
  tag: string;
  gradient: string;
  description: string;
  badge: string;
  unlockedByDefault: boolean;
}

export interface TrendTopic {
  tag: string;
  category: string;
  projectionsCount: string;
  description: string;
  trendIcon: string;
}

export interface WasmLanguageGuide {
  id: 'rust' | 'cpp' | 'assemblyscript' | 'zig' | 'tinygo';
  name: string;
  tagline: string;
  bestFor: string;
  memoryModel: string;
  binarySize: string;
  codeSnippet: string;
  pros: string[];
  wasmCompileCommand: string;
  whyInThisApp: string;
}

export interface WasmBenchmarkResult {
  iterations: number;
  wasmTimeMs: number;
  jsTimeMs: number;
  wasmOpsPerSec: number;
  jsOpsPerSec: number;
  speedupPercentage: number;
  memoryUsedBytes: number;
  wasmValidated: boolean;
}
