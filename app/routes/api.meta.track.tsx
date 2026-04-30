import type {Route} from './+types/api.meta.track';
import {sendCapiEvent, extractRequestUserData} from '~/lib/meta-capi.server';

// Proxy CAPI para eventos disparados desde el navegador.
// El cliente fija un eventId; ese mismo id viaja por browser pixel y por aquí
// para que Meta deduplique los dos hits en uno solo.

interface ProxyBody {
  eventName?: string;
  eventId?: string;
  customData?: Record<string, unknown>;
  userData?: {email?: string; phone?: string};
  eventSourceUrl?: string;
  fbp?: string;
  fbc?: string;
}

export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({error: 'Method not allowed'}, {status: 405});
  }

  let body: ProxyBody;
  try {
    body = (await request.json()) as ProxyBody;
  } catch {
    return Response.json({error: 'JSON inválido'}, {status: 400});
  }

  const {eventName, eventId} = body;
  if (!eventName || !eventId) {
    return Response.json(
      {error: 'eventName y eventId son requeridos'},
      {status: 400},
    );
  }

  const reqData = extractRequestUserData(request);

  // Dispara y olvida — no bloqueamos la respuesta esperando a Graph API.
  // waitUntil mantiene el worker vivo para que la request termine.
  context.waitUntilFn(
    sendCapiEvent(
      {
        eventName,
        eventId,
        eventSourceUrl: body.eventSourceUrl,
        userData: {
          email: body.userData?.email,
          phone: body.userData?.phone,
          fbp: body.fbp,
          fbc: body.fbc,
          ...reqData,
        },
        customData: body.customData,
      },
      context.env,
    ),
  );

  return Response.json({success: true});
}
