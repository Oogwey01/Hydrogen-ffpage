import type {Route} from './+types/api.submit-form';
import {createShopifyCustomer} from '~/lib/shopify.server';
import {sendCapiEvent, extractRequestUserData} from '~/lib/meta-capi.server';

interface SubmitFormBody {
  nombre?: string;
  email?: string;
  whatsapp?: string;
  businessUrl?: string;
  marketingChannels?: string[];
  adsInvestment?: string;
  monthlyRevenue?: string;
  goal90Days?: string;
  startWhen?: string;
  mainObstacle?: string;
  _meta?: {eventId?: string; fbp?: string; fbc?: string};
}

/**
 * Endpoint final del form de calificación.
 * 1. Crea/actualiza customer en Shopify Admin con metafields y tags.
 * 2. Envía evento Lead a Meta CAPI con el mismo eventId que el browser pixel.
 * 3. Opcional: reenvía el payload a FORM_WEBHOOK_URL.
 *
 * waitUntil mantiene el worker vivo después de la respuesta para que las
 * requests fire-and-forget terminen sin ser canceladas.
 */
export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const data = (await request.json()) as SubmitFormBody;

    if (!data.nombre || !data.email) {
      return Response.json(
        {error: 'Campos requeridos faltantes'},
        {status: 400},
      );
    }

    // Log para desarrollo (los logs van a Oxygen logs en producción)
    console.log('Form submission received:', {
      nombre: data.nombre,
      email: data.email,
      whatsapp: data.whatsapp,
      businessUrl: data.businessUrl,
      marketingChannels: data.marketingChannels,
      adsInvestment: data.adsInvestment,
      monthlyRevenue: data.monthlyRevenue,
      goal90Days: data.goal90Days,
      startWhen: data.startWhen,
      mainObstacle: data.mainObstacle,
      timestamp: new Date().toISOString(),
    });

    // Shopify customer creation — fire and forget con waitUntil para que
    // el response no espere ~1-2s de Admin API antes de devolver al cliente.
    context.waitUntilFn(
      (async () => {
        try {
          await createShopifyCustomer(
            data as Parameters<typeof createShopifyCustomer>[0],
            context.env,
          );
        } catch (shopifyError) {
          console.error('[Shopify] Unexpected error:', shopifyError);
        }
      })(),
    );

    // Meta CAPI Lead — mismo eventId que el browser pixel para deduplicar.
    const meta = data._meta;
    if (meta?.eventId) {
      const reqData = extractRequestUserData(request);
      context.waitUntilFn(
        sendCapiEvent(
          {
            eventName: 'Lead',
            eventId: meta.eventId,
            eventSourceUrl: request.headers.get('referer') ?? undefined,
            userData: {
              email: data.email,
              phone: data.whatsapp,
              firstName: data.nombre,
              fbp: meta.fbp,
              fbc: meta.fbc,
              ...reqData,
            },
            customData: {
              content_name: 'Qualification Form',
              content_category: 'Lead',
              currency: 'MXN',
            },
          },
          context.env,
        ),
      );
    }

    // Webhook opcional para downstream (Zapier, Make, n8n, etc.)
    const webhookUrl = context.env.FORM_WEBHOOK_URL;
    if (webhookUrl) {
      context.waitUntilFn(
        fetch(webhookUrl, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            ...data,
            submittedAt: new Date().toISOString(),
          }),
        }).catch((err) => {
          console.error('[Webhook] Forward failed:', err);
        }),
      );
    }

    return Response.json({
      success: true,
      message: 'Formulario enviado exitosamente',
    });
  } catch (error) {
    console.error('Form submission error:', error);
    return Response.json(
      {error: 'Error al procesar el formulario'},
      {status: 500},
    );
  }
}
