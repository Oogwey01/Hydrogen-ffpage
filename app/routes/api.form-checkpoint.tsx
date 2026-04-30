import type {Route} from './+types/api.form-checkpoint';
import {checkpointShopifyCustomer} from '~/lib/shopify.server';

/**
 * Endpoint intermedio: guarda parcialmente el customer en Shopify cuando el
 * usuario llega al step 3+ del form. Permite tracking de abandono.
 */
export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return Response.json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const {nombre, email, whatsapp, step} = (await request.json()) as {
      nombre?: string;
      email?: string;
      whatsapp?: string;
      step?: number;
    };

    if (!nombre || !email || !whatsapp || !step) {
      return Response.json(
        {error: 'Faltan campos requeridos (nombre, email, whatsapp, step)'},
        {status: 400},
      );
    }

    // Fire and forget — no bloqueamos la UX del form esperando a Shopify.
    context.waitUntilFn(
      checkpointShopifyCustomer({nombre, email, whatsapp}, step, context.env).catch(
        (err) => console.error('[Checkpoint] Shopify error:', err),
      ),
    );

    return Response.json({success: true});
  } catch (error) {
    console.error('[Checkpoint] Error:', error);
    return Response.json(
      {error: 'Error al guardar checkpoint'},
      {status: 500},
    );
  }
}
