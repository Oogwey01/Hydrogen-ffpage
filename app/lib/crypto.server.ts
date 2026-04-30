// Utilidades crypto sobre Web Crypto API (crypto.subtle).
// Reemplazo del módulo `crypto` de Node — Oxygen corre en Workers (V8 isolates)
// y NO expone `nodejs_compat`, así que TODO el hashing/HMAC vive aquí.

const enc = new TextEncoder();

function bufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * SHA-256 hex (lowercase). Equivalente a:
 *   crypto.createHash('sha256').update(value).digest('hex')
 */
export async function sha256Hex(value: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(value));
  return bufferToHex(buf);
}

/**
 * HMAC-SHA-256 hex. Equivalente a:
 *   crypto.createHmac('sha256', secret).update(message).digest('hex')
 */
export async function hmacSha256Hex(
  secret: string,
  message: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return bufferToHex(sig);
}

/**
 * Comparación timing-safe sobre dos strings hex de la misma longitud.
 * Equivalente a `crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'))`,
 * pero sin Buffer (no existe en Workers).
 */
export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Bytes random como hex string. Equivalente a:
 *   crypto.randomBytes(bytes).toString('hex')
 */
export function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
