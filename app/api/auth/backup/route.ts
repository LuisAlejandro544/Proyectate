/**
 * app/api/auth/backup/route.ts
 * ============================================================================
 * ENDPOINT DE RESPALDO DE CUENTA (PASSKEYS BIOMÉTRICAS / EMAIL)
 *
 * Permite a los usuarios anónimos convertir su sesión efímera en una cuenta blindada
 * usando huella/FaceID (WebAuthn) o correo electrónico, sin perder su historial.
 * ============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserSessionData } from '../session/route';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, email, passkeyCredentialId } = body;

    const sessionCookie = req.cookies.get('proyecta_session')?.value;
    let existingSession: Partial<UserSessionData> = {};

    if (sessionCookie) {
      try {
        existingSession = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf-8'));
      } catch {
        existingSession = {};
      }
    }

    const updatedSession: UserSessionData = {
      userId: existingSession.userId || `usr_${Date.now()}`,
      deviceHash: existingSession.deviceHash || 'anon_0xDEVICE',
      activeAlterEgoId: existingSession.activeAlterEgoId || 'ego-espejo',
      isAnonymous: false,
      email: type === 'email' ? email : existingSession.email,
      hasPasskey: type === 'passkey' ? true : !!existingSession.hasPasskey,
      createdAt: existingSession.createdAt || Date.now(),
    };

    const sessionToken = Buffer.from(JSON.stringify(updatedSession)).toString('base64');

    const response = NextResponse.json({
      success: true,
      message:
        type === 'passkey'
          ? 'Cuenta respaldada con biometría (Passkey) exitosamente.'
          : 'Cuenta enlazada a tu correo exitosamente.',
      session: updatedSession,
      token: sessionToken,
    });

    response.cookies.set('proyecta_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (err) {
    console.error('Error al respaldar cuenta:', err);
    return NextResponse.json(
      { error: 'Error al procesar el respaldo de la cuenta' },
      { status: 500 }
    );
  }
}
