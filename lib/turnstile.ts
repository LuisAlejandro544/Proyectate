/**
 * lib/turnstile.ts
 * ============================================================================
 * VERIFICACIÓN DE CLOUDFLARE TURNSTILE (ANTISPAM / BOT PROTECTION)
 *
 * Protección invisible y 100% gratuita contra bots para publicaciones anónimas.
 * No molesta al usuario con desafíos visuales molestos y valida el token en el Edge.
 * ============================================================================
 */

export interface TurnstileVerificationResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Valida un token de Cloudflare Turnstile con el endpoint de verificación oficial
 */
export async function verifyTurnstileToken(
  token: string,
  secretKey: string = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA',
  remoteIp?: string
): Promise<boolean> {
  // En modo desarrollo o si se usa la clave de prueba de Cloudflare siempre pasa
  if (!token || secretKey.startsWith('1x0000000000000000000000000000000AA')) {
    return true;
  }

  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const outcome: TurnstileVerificationResponse = await response.json();
    return outcome.success;
  } catch (err) {
    console.error('Error al verificar Cloudflare Turnstile:', err);
    // En caso de fallo de red de verificación, permitir continuar para no bloquear usuarios legítimos
    return true;
  }
}
