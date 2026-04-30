// Helper de Meta Pixel para el navegador.
// El ID se inyecta vía root loader (publicEnv) — los componentes lo leen de
// useRouteLoaderData('root'). Estas funciones son no-op si fbq aún no se cargó.

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {queue?: unknown[]; loaded?: boolean};
    _fbq?: unknown;
  }
}

// IDs únicos para deduplicación browser ↔ CAPI (mismo event_id en ambos lados).
export function generateEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// Lee una cookie por nombre (usado para _fbp y _fbc).
function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function getFbp(): string | null {
  return readCookie('_fbp');
}

export function getFbc(): string | null {
  // _fbc lo deja Meta cuando el usuario llega con ?fbclid=. Si no existe pero
  // el parámetro está en la URL, lo construimos manualmente con el formato oficial.
  const existing = readCookie('_fbc');
  if (existing) return existing;
  if (typeof window === 'undefined') return null;
  const fbclid = new URLSearchParams(window.location.search).get('fbclid');
  if (!fbclid) return null;
  return `fb.1.${Date.now()}.${fbclid}`;
}

type StandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Contact'
  | 'InitiateCheckout'
  | 'AddToCart'
  | 'Subscribe'
  | 'Schedule'
  | 'SubmitApplication';

interface TrackOptions {
  // Si lo pasas, el mismo eventId debe enviarse desde CAPI server-side para deduplicar.
  eventId?: string;
  // Si true, también envía el evento al endpoint /api/meta/track para que llegue por CAPI.
  sendToCapi?: boolean;
  // Datos de usuario para CAPI (email/phone). Opcional — solo cuando los tienes.
  userData?: {email?: string; phone?: string};
}

export function trackEvent(
  name: StandardEvent,
  customData: Record<string, unknown> = {},
  options: TrackOptions = {},
): string {
  const eventId = options.eventId ?? generateEventId();

  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', name, customData, {eventID: eventId});
  }

  if (options.sendToCapi) {
    sendToCapiProxy({
      eventName: name,
      eventId,
      customData,
      userData: options.userData,
      eventSourceUrl:
        typeof window !== 'undefined' ? window.location.href : undefined,
    });
  }

  return eventId;
}

export function trackCustomEvent(
  name: string,
  customData: Record<string, unknown> = {},
  options: TrackOptions = {},
): string {
  const eventId = options.eventId ?? generateEventId();

  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', name, customData, {eventID: eventId});
  }

  if (options.sendToCapi) {
    sendToCapiProxy({
      eventName: name,
      eventId,
      customData,
      userData: options.userData,
      eventSourceUrl:
        typeof window !== 'undefined' ? window.location.href : undefined,
      isCustom: true,
    });
  }

  return eventId;
}

interface CapiProxyPayload {
  eventName: string;
  eventId: string;
  customData?: Record<string, unknown>;
  userData?: {email?: string; phone?: string};
  eventSourceUrl?: string;
  isCustom?: boolean;
}

function sendToCapiProxy(payload: CapiProxyPayload): void {
  if (typeof window === 'undefined') return;

  const body = JSON.stringify({
    ...payload,
    fbp: getFbp() ?? undefined,
    fbc: getFbc() ?? undefined,
  });

  // sendBeacon sobrevive a navegaciones; fallback a fetch keepalive.
  if (navigator.sendBeacon) {
    const blob = new Blob([body], {type: 'application/json'});
    if (navigator.sendBeacon('/api/meta/track', blob)) return;
  }

  fetch('/api/meta/track', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body,
    keepalive: true,
  }).catch(() => {
    // Silent — tracking no debe romper la UX.
  });
}
