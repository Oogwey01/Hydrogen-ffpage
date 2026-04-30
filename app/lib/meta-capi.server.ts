import {sha256Hex} from '~/lib/crypto.server';

// Helper de Meta Conversions API server-side para Workers/Oxygen.
// El env se recibe como parámetro (en Workers no hay process.env). Si las
// vars no están configuradas, las funciones son no-op y solo loguean warnings,
// para que el resto del backend funcione en local sin Meta.

interface MetaEnv {
  PUBLIC_META_PIXEL_ID?: string;
  META_CAPI_ACCESS_TOKEN?: string;
  META_CAPI_TEST_EVENT_CODE?: string;
  META_CAPI_API_VERSION?: string;
}

export function isCapiEnabled(env: MetaEnv): boolean {
  return Boolean(env.PUBLIC_META_PIXEL_ID && env.META_CAPI_ACCESS_TOKEN);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Solo dígitos, sin código de país duplicado ni símbolos.
function normalizePhone(phone: string): string {
  return phone.replace(/\D+/g, '');
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  // Campos no-PII que NO se hashean.
  fbp?: string;
  fbc?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  externalId?: string; // ej. id de cliente de Shopify para mejor matching
}

/**
 * Construye user_data en el formato que Meta espera.
 * Async porque sha256Hex usa crypto.subtle.digest (Web Crypto).
 * Hashea todos los campos PII en paralelo con Promise.all.
 */
async function buildUserData(user: UserData): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};

  // Hashes en paralelo — más rápido que awaits secuenciales.
  const [emHash, phHash, fnHash, lnHash, extHash] = await Promise.all([
    user.email ? sha256Hex(normalizeEmail(user.email)) : Promise.resolve(null),
    user.phone ? sha256Hex(normalizePhone(user.phone)) : Promise.resolve(null),
    user.firstName ? sha256Hex(normalizeName(user.firstName)) : Promise.resolve(null),
    user.lastName ? sha256Hex(normalizeName(user.lastName)) : Promise.resolve(null),
    user.externalId ? sha256Hex(user.externalId) : Promise.resolve(null),
  ]);

  if (emHash) out.em = [emHash];
  if (phHash) out.ph = [phHash];
  if (fnHash) out.fn = [fnHash];
  if (lnHash) out.ln = [lnHash];
  if (extHash) out.external_id = [extHash];

  // Estos NO se hashean — Meta los espera en plano.
  if (user.fbp) out.fbp = user.fbp;
  if (user.fbc) out.fbc = user.fbc;
  if (user.clientIpAddress) out.client_ip_address = user.clientIpAddress;
  if (user.clientUserAgent) out.client_user_agent = user.clientUserAgent;

  return out;
}

interface CapiEventInput {
  eventName: string;
  eventId: string;
  eventTime?: number; // unix seconds, default ahora
  eventSourceUrl?: string;
  actionSource?:
    | 'website'
    | 'email'
    | 'app'
    | 'phone_call'
    | 'chat'
    | 'physical_store'
    | 'system_generated'
    | 'other';
  userData: UserData;
  customData?: Record<string, unknown>;
}

export async function sendCapiEvent(
  input: CapiEventInput,
  env: MetaEnv,
): Promise<void> {
  if (!isCapiEnabled(env)) {
    console.warn(
      '[Meta CAPI] Faltan PUBLIC_META_PIXEL_ID o META_CAPI_ACCESS_TOKEN — evento no enviado',
    );
    return;
  }

  const pixelId = env.PUBLIC_META_PIXEL_ID!;
  const accessToken = env.META_CAPI_ACCESS_TOKEN!;
  const testEventCode = env.META_CAPI_TEST_EVENT_CODE ?? '';
  const apiVersion = env.META_CAPI_API_VERSION ?? 'v21.0';

  const eventTime = input.eventTime ?? Math.floor(Date.now() / 1000);
  const userData = await buildUserData(input.userData);

  // Meta exige al menos un identificador en user_data — si no hay nada,
  // el evento se rechaza. Mejor abortar localmente con un warning explícito.
  if (Object.keys(userData).length === 0) {
    console.warn(`[Meta CAPI] Evento ${input.eventName} sin user_data — saltando`);
    return;
  }

  const event: Record<string, unknown> = {
    event_name: input.eventName,
    event_time: eventTime,
    event_id: input.eventId,
    action_source: input.actionSource ?? 'website',
    user_data: userData,
  };

  if (input.eventSourceUrl) event.event_source_url = input.eventSourceUrl;
  if (input.customData) event.custom_data = input.customData;

  const body: Record<string, unknown> = {
    data: [event],
    access_token: accessToken,
  };

  if (testEventCode) body.test_event_code = testEventCode;

  const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events`;
  const payload = JSON.stringify(body);

  // 3 intentos máx con backoff (200ms, 600ms). Meta deduplica por event_id durante
  // 7 días, así que reintentar el mismo payload es seguro.
  const MAX_ATTEMPTS = 3;
  const BACKOFFS_MS = [0, 200, 600];

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (BACKOFFS_MS[attempt] > 0) {
      await new Promise((r) => setTimeout(r, BACKOFFS_MS[attempt]));
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: payload,
      });

      if (!res.ok) {
        const errBody = await res.text();
        // 5xx = retry; 4xx = fallo definitivo (token, formato, etc.) → no reintentar
        if (res.status >= 500 && attempt < MAX_ATTEMPTS - 1) {
          console.warn(
            `[Meta CAPI] ${input.eventName} ${res.status}, reintentando (${attempt + 1}/${MAX_ATTEMPTS - 1})`,
          );
          continue;
        }
        console.error(
          `[Meta CAPI] ${input.eventName} falló (${res.status}):`,
          errBody,
        );
        return;
      }

      const data = (await res.json()) as {events_received?: number};
      console.log(
        `[Meta CAPI] ${input.eventName} OK (event_id=${input.eventId}, recibidos=${data.events_received ?? '?'}, intentos=${attempt + 1})${
          testEventCode ? ` [TEST=${testEventCode}]` : ''
        }`,
      );
      return;
    } catch (err) {
      // ECONNRESET, fetch failed, TLS handshake error, etc. → reintentar
      if (attempt < MAX_ATTEMPTS - 1) {
        console.warn(
          `[Meta CAPI] Error de red en ${input.eventName}, reintentando (${attempt + 1}/${MAX_ATTEMPTS - 1}):`,
          (err as Error).message ?? err,
        );
        continue;
      }
      console.error(
        `[Meta CAPI] ${input.eventName} falló tras ${MAX_ATTEMPTS} intentos:`,
        err,
      );
    }
  }
}

// Extrae IP y User-Agent de un Request para el matching de CAPI.
// En Oxygen/Cloudflare, x-forwarded-for trae la IP real del cliente.
export function extractRequestUserData(request: Request): {
  clientIpAddress?: string;
  clientUserAgent?: string;
} {
  const headers = request.headers;
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || undefined;
  const ua = headers.get('user-agent') ?? undefined;
  return {
    clientIpAddress: ip,
    clientUserAgent: ua,
  };
}
