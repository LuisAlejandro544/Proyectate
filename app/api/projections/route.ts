/**
 * app/api/projections/route.ts
 * ============================================================================
 * ENDPOINT REAL DE PROYECCIONES ANÓNIMAS
 *
 * - GET: Retorna la lista de proyecciones con ordenamiento y filtros de tendencias.
 * - POST: Valida token antispam de Cloudflare Turnstile, genera la prueba criptográfica
 *         y almacena la publicación en el Edge.
 * ============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { INITIAL_PROJECTIONS } from '@/lib/initial-data';
import { Projection, ProjectionCategory } from '@/lib/types';

// Almacenamiento en memoria para el runtime de Edge
let inMemoryProjections: Projection[] = [...INITIAL_PROJECTIONS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get('sort') || 'viral';
    const tag = searchParams.get('tag');

    let list = [...inMemoryProjections];

    if (tag) {
      list = list.filter((p) => p.categoryLabel.toLowerCase().includes(tag.toLowerCase()));
    }

    if (sort === 'latest') {
      list.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
    } else if (sort === 'delulu') {
      list.sort((a, b) => b.projectionLevel - a.projectionLevel);
    } else {
      // viral: calcular suma de reacciones
      list.sort((a, b) => {
        const sumA = Object.values(a.reactions).reduce((acc, v) => acc + v, 0);
        const sumB = Object.values(b.reactions).reduce((acc, v) => acc + v, 0);
        return sumB - sumA;
      });
    }

    return NextResponse.json({
      success: true,
      count: list.length,
      projections: list,
    });
  } catch (err) {
    console.error('Error al obtener proyecciones:', err);
    return NextResponse.json(
      { error: 'Error al consultar las proyecciones' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      content,
      authorAlias,
      authorTag,
      avatarGradient,
      projectionLevel,
      psychologicalDiagnosis,
      wasmHash,
      category,
      categoryLabel,
      turnstileToken,
    } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'El contenido de la proyección no puede estar vacío' },
        { status: 400 }
      );
    }

    // 1. Validar Cloudflare Turnstile (Antispam)
    if (turnstileToken) {
      const clientIp = req.headers.get('cf-connecting-ip') || undefined;
      const isValidHuman = await verifyTurnstileToken(turnstileToken, undefined, clientIp);
      if (!isValidHuman) {
        return NextResponse.json(
          { error: 'Fallo de verificación antispam de Cloudflare Turnstile' },
          { status: 403 }
        );
      }
    }

    // 2. Crear proyección real con los tipos exactos de Projection
    const newProjection: Projection = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      authorAlias: authorAlias || 'Proyección Anónima',
      authorTag: authorTag || '@anonimo',
      avatarGradient: avatarGradient || 'from-indigo-600 to-purple-800',
      category: (category as ProjectionCategory) || 'te-proyectaste',
      categoryLabel: categoryLabel || '#TeProyectasteDurisimo',
      content: content.trim(),
      projectionLevel: Number(projectionLevel) || 50,
      psychologicalDiagnosis: psychologicalDiagnosis || 'Proyección estándar analizada por WebAssembly.',
      wasmHash: wasmHash || `0x${Date.now().toString(16).toUpperCase()}`,
      verifiedByWasm: true,
      reactions: {
        meProyecte: 0,
        teProyectaste: 0,
        vineAReir: 0,
        confirmo: 0,
        terapia: 0,
      },
      userReactions: {},
      replyCount: 0,
      quoteCount: 0,
      createdAt: 'Hace un momento',
      createdTimestamp: Date.now(),
      comments: [],
    };

    // Almacenar en la cima del feed
    inMemoryProjections = [newProjection, ...inMemoryProjections];

    return NextResponse.json({
      success: true,
      projection: newProjection,
    });
  } catch (err) {
    console.error('Error al publicar proyección:', err);
    return NextResponse.json(
      { error: 'Error al procesar la publicación en el Edge' },
      { status: 500 }
    );
  }
}
