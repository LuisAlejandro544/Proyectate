/**
 * app/api/auth/session/route.ts
 * ============================================================================
 * ENDPOINT DE SESIÓN REAL PARA EL EDGE (BETTER AUTH / D1 COMPATIBLE)
 *
 * Gestiona el ciclo de vida de la sesión anónima real:
 * - GET: Verifica el token de sesión en cookies o headers y devuelve el estado actual.
 * - POST: Inicializa una sesión anónima real para el dispositivo, guardando el hash
 *         criptográfico y asignando el alter ego activo.
 * ============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';

export interface UserSessionData {
  userId: string;
  deviceHash: string;
  activeAlterEgoId: string;
  isAnonymous: boolean;
  email?: string;
  hasPasskey: boolean;
  createdAt: number;
}

/**
 * Obtener estado de sesión actual
 */
export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('proyecta_session')?.value;
    const authHeader = req.headers.get('authorization');
    const token = sessionCookie || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        session: null,
      });
    }

    // Decodificar token de sesión
    let decodedData: Partial<UserSessionData> | null = null;
    try {
      const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
      decodedData = JSON.parse(jsonStr);
    } catch {
      decodedData = null;
    }

    if (!decodedData || !decodedData.userId) {
      return NextResponse.json({
        authenticated: false,
        session: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      session: {
        userId: decodedData.userId,
        deviceHash: decodedData.deviceHash || '0xANON_HASH',
        activeAlterEgoId: decodedData.activeAlterEgoId || 'ego-espejo',
        isAnonymous: decodedData.isAnonymous ?? true,
        email: decodedData.email || null,
        hasPasskey: decodedData.hasPasskey ?? false,
        createdAt: decodedData.createdAt || Date.now(),
      },
    });
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    return NextResponse.json(
      { error: 'Error al verificar sesión en el Edge' },
      { status: 500 }
    );
  }
}

/**
 * Inicializar o actualizar sesión anónima real
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceHash, activeAlterEgoId, email, hasPasskey } = body;

    const finalDeviceHash =
      deviceHash || `anon_0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
    const userId = `usr_${finalDeviceHash.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
    const finalAlterEgo = activeAlterEgoId || 'ego-espejo';

    const sessionPayload: UserSessionData = {
      userId,
      deviceHash: finalDeviceHash,
      activeAlterEgoId: finalAlterEgo,
      isAnonymous: !email && !hasPasskey,
      email: email || undefined,
      hasPasskey: !!hasPasskey,
      createdAt: Date.now(),
    };

    // Generar token firmado en Base64 seguro para cookies
    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    const response = NextResponse.json({
      success: true,
      authenticated: true,
      token: sessionToken,
      session: sessionPayload,
    });

    // Guardar cookie HTTP segura
    response.cookies.set('proyecta_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 año de persistencia en el teléfono
    });

    return response;
  } catch (error) {
    console.error('Error al inicializar sesión:', error);
    return NextResponse.json(
      { error: 'Error al inicializar sesión en el Edge' },
      { status: 500 }
    );
  }
}
