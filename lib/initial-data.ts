/**
 * lib/initial-data.ts
 * ============================================================================
 * Datos iniciales para la red social "Proyecta".
 *
 * Incluye:
 * 1. Proyecciones semilla de alta identificación basadas en la tendencia de TikTok
 *    ("Me proyecté durísimo", "Vine a reír no a llorar", situaciones de desahogo,
 *    indirectas, canon events, situationships y terapia pop).
 * 2. Catálogo de Alter Egos / Máscaras Anónimas que el usuario puede elegir.
 * 3. Temas y hashtags virales en tendencia.
 * 4. Almacenamiento y sincronización local en el navegador (LocalStorage).
 * ============================================================================
 */

import { AnonymousAlterEgo, Projection, TrendTopic } from './types';

export const INITIAL_ALTER_EGOS: AnonymousAlterEgo[] = [
  {
    id: 'ego-espejo',
    name: 'El Espejo Silencioso',
    tag: '@espejo_anon_842',
    gradient: 'from-violet-600 via-indigo-600 to-purple-800',
    description: 'Especialista en notar cuando otros se proyectan antes que ellos mismos.',
    badge: '🪞 Espejo Crudo',
    unlockedByDefault: true,
  },
  {
    id: 'ego-delulu',
    name: 'Delulu en Fase Terminal',
    tag: '@delulu_fase_4',
    gradient: 'from-pink-500 via-rose-500 to-purple-600',
    description: 'Cree ciegamente que si no le habla es porque la ama demasiado.',
    badge: '✨ Delulu Pro',
    unlockedByDefault: true,
  },
  {
    id: 'ego-terapia',
    name: 'Paciente sin Alta',
    tag: '@terapia_urgente_09',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    description: 'Usa términos como "apego evitativo" para justificar que le dejaron en visto.',
    badge: '🛋️ En Terapia',
    unlockedByDefault: true,
  },
  {
    id: 'ego-canon',
    name: 'Testigo del Canon Event',
    tag: '@canon_survivor_77',
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    description: 'Ve a sus amigos cometer los mismos errores que él cometió en 2023.',
    badge: '⚡ Inevitable',
    unlockedByDefault: true,
  },
  {
    id: 'ego-fantasma',
    name: 'Ghostwriter de Indirectas',
    tag: '@indirectas_3am',
    gradient: 'from-blue-600 via-cyan-600 to-indigo-800',
    description: 'Escribe tweets a las 3:14 AM esperando que una persona concreta los lea.',
    badge: '🌙 No Duerme',
    unlockedByDefault: true,
  },
  {
    id: 'ego-filosofo',
    name: 'Cínico de Situationship',
    tag: '@sin_etiquetas_pero_lloro',
    gradient: 'from-fuchsia-600 via-purple-700 to-slate-800',
    description: '"No éramos nada, pero dolió como si hubiéramos firmado una hipoteca."',
    badge: '💔 Cero Etiquetas',
    unlockedByDefault: true,
  },
];

export const INITIAL_TRENDS: TrendTopic[] = [
  {
    tag: '#TeProyectasteDurisimo',
    category: 'Viral en TikTok',
    projectionsCount: '48.2K proyecciones',
    description: 'Cuando el consejo que diste era en realidad tu propia herida abierta.',
    trendIcon: '💀',
  },
  {
    tag: '#MiMomentoDelulu',
    category: 'Psicología Pop',
    projectionsCount: '32.9K proyecciones',
    description: 'Crear películas mentales con alguien que solo te dio los buenos días en el ascensor.',
    trendIcon: '✨',
  },
  {
    tag: '#Situationship',
    category: 'Relaciones Modernas',
    projectionsCount: '27.4K proyecciones',
    description: 'Llorarle a alguien que tenía permiso legal de besarse con tu peor enemigo.',
    trendIcon: '🥀',
  },
  {
    tag: '#CanonEvent',
    category: 'Experiencia Colectiva',
    projectionsCount: '19.8K proyecciones',
    description: 'No puedes intervenir, tiene que creer que él va a cambiar por ella.',
    trendIcon: '⚡',
  },
  {
    tag: '#VineAReirNoALlorar',
    category: 'Comunidad',
    projectionsCount: '15.1K proyecciones',
    description: 'Abrí la app para distraerme y me encontré un post describiendo mi vida exacta.',
    trendIcon: '😭',
  },
];

export const INITIAL_PROJECTIONS: Projection[] = [
  {
    id: 'proj-1',
    authorAlias: 'El Espejo Silencioso',
    authorTag: '@espejo_anon_842',
    avatarGradient: 'from-violet-600 via-indigo-600 to-purple-800',
    content:
      'Es fascinante cómo la gente que más publica "yo no persigo a nadie, el que se va que le vaya bien" es exactamente la que revisa quién vio sus historias de Instagram cada 4 minutos y medio. No lo digo por nadie, ojo. #TeProyectasteDurisimo',
    category: 'te-proyectaste',
    categoryLabel: '#TeProyectasteDurisimo',
    createdAt: 'hace 18 min',
    createdTimestamp: Date.now() - 1000 * 60 * 18,
    reactions: {
      meProyecte: 142,
      teProyectaste: 89,
      vineAReir: 31,
      confirmo: 96,
      terapia: 12,
    },
    userReactions: {},
    replyCount: 24,
    quoteCount: 15,
    projectionLevel: 88,
    psychologicalDiagnosis:
      'Proyección de desapego reactivo: Fingir indiferencia masiva en redes como escudo defensivo.',
    wasmHash: '0x81C7A902',
    verifiedByWasm: true,
    comments: [
      {
        id: 'c-1-1',
        projectionId: 'proj-1',
        authorAlias: 'Ghost_8291',
        authorTag: '@anon_8291',
        avatarGradient: 'from-pink-500 to-purple-600',
        content: '¿Quién te dio permiso de describirme con tanta precisión quirúrgica?',
        createdAt: 'hace 12 min',
        likes: 19,
        wasmCertified: true,
      },
      {
        id: 'c-1-2',
        projectionId: 'proj-1',
        authorAlias: 'Delulu Mayor',
        authorTag: '@delulu_pro_1',
        avatarGradient: 'from-emerald-500 to-teal-700',
        content: 'Yo solo reviso para ver si ya se dio cuenta de lo feliz que finjo ser.',
        createdAt: 'hace 6 min',
        likes: 11,
        wasmCertified: true,
      },
    ],
  },
  {
    id: 'proj-2',
    authorAlias: 'Delulu en Fase Terminal',
    authorTag: '@delulu_fase_4',
    avatarGradient: 'from-pink-500 via-rose-500 to-purple-600',
    content:
      'Mi ex me vio la historia después de 23 horas y 58 minutos. Claramente esperó hasta el último segundo para que yo no pensara que estaba desesperado por verla. Su estrategia psicológica es tan obvia que casi me da ternura. Sé que volverá. #MiMomentoDelulu',
    category: 'delulu-moment',
    categoryLabel: '#MiMomentoDelulu',
    createdAt: 'hace 45 min',
    createdTimestamp: Date.now() - 1000 * 60 * 45,
    reactions: {
      meProyecte: 98,
      teProyectaste: 215,
      vineAReir: 84,
      confirmo: 23,
      terapia: 147,
    },
    userReactions: {},
    replyCount: 42,
    quoteCount: 31,
    projectionLevel: 96,
    psychologicalDiagnosis:
      'Delirio cognitivo por temporalidad de historias: Racionalización de algoritmos como señales de amor.',
    wasmHash: '0x99A410EF',
    verifiedByWasm: true,
    comments: [
      {
        id: 'c-2-1',
        projectionId: 'proj-2',
        authorAlias: 'Terapeuta En Sombras',
        authorTag: '@doc_anon',
        avatarGradient: 'from-amber-500 to-red-600',
        content: 'Amigo, simplemente le dio "Siguiente historia" mientras se lavaba los dientes.',
        createdAt: 'hace 30 min',
        likes: 54,
        wasmCertified: true,
      },
    ],
  },
  {
    id: 'proj-3',
    authorAlias: 'Cínico de Situationship',
    authorTag: '@sin_etiquetas_pero_lloro',
    avatarGradient: 'from-fuchsia-600 via-purple-700 to-slate-800',
    content:
      'Nos prometimos "fluir sin expectativas", pero ahora estoy en mi cama a las 2 AM con taquicardia analizando por qué usó un emoji de pulgar arriba en vez de un corazón. El concepto de situationship es la mayor estafa emocional de nuestra generación. #Situationship',
    category: 'situationship',
    categoryLabel: '#Situationship',
    createdAt: 'hace 2 horas',
    createdTimestamp: Date.now() - 1000 * 60 * 120,
    reactions: {
      meProyecte: 312,
      teProyectaste: 45,
      vineAReir: 62,
      confirmo: 189,
      terapia: 83,
    },
    userReactions: {},
    replyCount: 56,
    quoteCount: 67,
    projectionLevel: 91,
    psychologicalDiagnosis:
      'Disonancia cognitiva de compromiso: Querer derechos de pareja con contrato de amistad.',
    wasmHash: '0x3FB2710C',
    verifiedByWasm: true,
  },
  {
    id: 'proj-4',
    authorAlias: 'Testigo del Canon Event',
    authorTag: '@canon_survivor_77',
    avatarGradient: 'from-amber-500 via-orange-600 to-red-600',
    content:
      'Viendo a mi mejor amigo mandar un audio de 6 minutos explicando que ella "solo está confundida por el trabajo y por eso le responde cada 4 días". No puedo decir nada. Es su canon event y tiene que vivirlo hasta el fondo. #CanonEvent',
    category: 'canon-event',
    categoryLabel: '#CanonEvent',
    createdAt: 'hace 3 horas',
    createdTimestamp: Date.now() - 1000 * 60 * 180,
    reactions: {
      meProyecte: 180,
      teProyectaste: 19,
      vineAReir: 94,
      confirmo: 240,
      terapia: 15,
    },
    userReactions: {},
    replyCount: 18,
    quoteCount: 44,
    projectionLevel: 74,
    psychologicalDiagnosis:
      'Empatía traumática proyectada: Ver el reflejo del error del pasado en un ser querido.',
    wasmHash: '0x10B742AA',
    verifiedByWasm: true,
  },
  {
    id: 'proj-5',
    authorAlias: 'Ghostwriter de Indirectas',
    authorTag: '@indirectas_3am',
    avatarGradient: 'from-blue-600 via-cyan-600 to-indigo-800',
    content:
      'Dices que "odias el drama" pero cada vez que hay paz en tu vida inventas un problema hipotético sobre algo que alguien podría llegar a pensar de ti en una situación que jamás ha ocurrido. Terapia urgente. #InseguridadDesbloqueada',
    category: 'inseguridad-cruda',
    categoryLabel: '#InseguridadDesbloqueada',
    createdAt: 'hace 5 horas',
    createdTimestamp: Date.now() - 1000 * 60 * 300,
    reactions: {
      meProyecte: 210,
      teProyectaste: 78,
      vineAReir: 15,
      confirmo: 165,
      terapia: 120,
    },
    userReactions: {},
    replyCount: 29,
    quoteCount: 18,
    projectionLevel: 85,
    psychologicalDiagnosis:
      'Hipervigilancia anticipatoria: Proyectar catástrofes para no sentirse vulnerable ante la tranquilidad.',
    wasmHash: '0x7C910FA3',
    verifiedByWasm: true,
  },
];

// Claves de LocalStorage para persistencia fluida sin base de datos
const STORAGE_KEYS = {
  PROJECTIONS: 'proyecta_feed_data_v1',
  ACTIVE_EGO: 'proyecta_active_ego_v1',
  USER_STATS: 'proyecta_user_stats_v1',
};

/**
 * Obtiene las proyecciones almacenadas o inicializa con los datos semilla
 */
export function getStoredProjections(): Projection[] {
  if (typeof window === 'undefined') return INITIAL_PROJECTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error leyendo proyecciones locales:', e);
  }
  return INITIAL_PROJECTIONS;
}

/**
 * Guarda las proyecciones en LocalStorage
 */
export function saveStoredProjections(projections: Projection[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTIONS, JSON.stringify(projections));
  } catch (e) {
    console.warn('Error guardando proyecciones locales:', e);
  }
}

/**
 * Obtiene el alter ego activo del usuario
 */
export function getActiveAlterEgo(): AnonymousAlterEgo {
  if (typeof window === 'undefined') return INITIAL_ALTER_EGOS[0];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_EGO);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error leyendo alter ego:', e);
  }
  return INITIAL_ALTER_EGOS[0];
}

/**
 * Guarda el alter ego activo
 */
export function saveActiveAlterEgo(ego: AnonymousAlterEgo): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_EGO, JSON.stringify(ego));
  } catch (e) {
    console.warn('Error guardando alter ego:', e);
  }
}
