import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';

type WaitUntil = (promise: Promise<unknown>) => void;

// Augmenta el contexto de Hydrogen con utilities propias. waitUntilFn se
// expone aquí (en lugar del waitUntil opcional de Hydrogen) para que las
// actions puedan llamarlo sin non-null assertions.
declare global {
  interface HydrogenAdditionalContext {
    waitUntilFn: WaitUntil;
  }
}

/**
 * Creates Hydrogen context for React Router 7.9.x
 * Returns HydrogenRouterContextProvider with hybrid access patterns
 */
export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil: WaitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      // Landing page en español MX. No usamos i18n del storefront pero el
      // contexto de Hydrogen lo requiere.
      i18n: {language: 'ES', country: 'MX'},
    },
    {waitUntilFn: waitUntil},
  );

  return hydrogenContext;
}
