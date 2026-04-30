import type {FormData} from '~/lib/schemas';

// Shopify Admin API client para Workers/Oxygen.
// Recibe `env: ShopifyEnv` como parámetro (no process.env). Es no-op si las
// vars no están configuradas — útil para desarrollo local sin tienda.

export interface ShopifyEnv {
  SHOPIFY_STORE_URL?: string;
  SHOPIFY_ACCESS_TOKEN?: string;
  SHOPIFY_API_VERSION?: string;
}

// Step names for checkpoint tracking
const STEP_NAMES: Record<number, string> = {
  1: 'nombre',
  2: 'email',
  3: 'whatsapp',
  4: 'url-negocio',
  5: 'canales-marketing',
  6: 'inversion-ads',
  7: 'facturacion',
  8: 'meta-90-dias',
  9: 'cuando-empezar',
  10: 'obstaculo',
};

const REVENUE_CATEGORY_MAP: Record<string, string> = {
  '$1-$15K MXN': 'Comunes',
  '$15K-$50K MXN': 'Normales',
  '$50K-$150K MXN': 'Arriba del promedio',
  '$150K+ MXN': 'Leyendas',
};

export function getRevenueCategory(monthlyRevenue: string): string {
  return REVENUE_CATEGORY_MAP[monthlyRevenue] ?? 'Comunes';
}

type ShopifyMetafield = {
  namespace: string;
  key: string;
  value: string;
  type: string;
};

type ShopifyEmailMarketingConsent = {
  state: 'subscribed' | 'not_subscribed' | 'pending' | 'unsubscribed';
  opt_in_level: 'single_opt_in' | 'confirmed_opt_in' | 'unknown';
  consent_updated_at: string;
};

type ShopifyCustomerPayload = {
  first_name?: string;
  email?: string;
  phone?: string;
  tags?: string;
  note?: string;
  metafields?: ShopifyMetafield[];
  email_marketing_consent?: ShopifyEmailMarketingConsent;
};

type ShopifyErrors = Record<string, string[] | string>;

// Mexico mobile: legacy WhatsApp prefix "+521" (13 digits) → strip the "1" → "+52" (12 digits).
// Also collapses repeated leading "+", strips spaces / dashes / parens, and drops trailing junk.
export function normalizePhone(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  let p = raw.trim().replace(/[\s()-]/g, '');
  if (!p) return undefined;
  // Collapse multiple leading "+"
  p = p.replace(/^\++/, '+');
  // MX legacy: +521XXXXXXXXXX (13 digits after +) → +52XXXXXXXXXX
  if (/^\+521\d{10}$/.test(p)) {
    p = '+52' + p.slice(4);
  }
  return p;
}

function parseShopifyError(body: string): {
  errors: ShopifyErrors;
  field: 'email' | 'phone' | 'other' | 'unknown';
  reason: string;
} {
  let errors: ShopifyErrors = {};
  try {
    const parsed = JSON.parse(body) as {errors?: ShopifyErrors};
    errors = parsed.errors ?? {};
  } catch {
    return {errors: {}, field: 'unknown', reason: body.slice(0, 200)};
  }
  const keys = Object.keys(errors);
  if (keys.includes('email')) {
    return {errors, field: 'email', reason: JSON.stringify(errors.email)};
  }
  if (keys.includes('phone')) {
    return {errors, field: 'phone', reason: JSON.stringify(errors.phone)};
  }
  return {
    errors,
    field: keys.length ? 'other' : 'unknown',
    reason: JSON.stringify(errors),
  };
}

interface AdminContext {
  baseUrl: string;
  headers: Record<string, string>;
}

function buildAdminContext(env: ShopifyEnv): AdminContext | null {
  const storeUrl = env.SHOPIFY_STORE_URL;
  const accessToken = env.SHOPIFY_ACCESS_TOKEN;
  const apiVersion = env.SHOPIFY_API_VERSION ?? '2024-10';

  if (!storeUrl || !accessToken) return null;

  return {
    baseUrl: `https://${storeUrl}/admin/api/${apiVersion}`,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
  };
}

async function findCustomerBy(
  ctx: AdminContext,
  query: string,
): Promise<{id: number; tags: string} | null> {
  const res = await fetch(
    `${ctx.baseUrl}/customers/search.json?query=${encodeURIComponent(query)}`,
    {headers: ctx.headers},
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    customers?: Array<{id: number; tags: string}>;
  };
  return data.customers?.[0] ?? null;
}

// Resolve the existing customer that caused a 422 conflict.
// Shopify's customer search index has eventual consistency: a customer created
// seconds before may not yet be searchable, so we retry with backoff. We
// prioritize the field that the API said collided.
async function lookupExistingCustomer(
  ctx: AdminContext,
  field: 'email' | 'phone' | 'other' | 'unknown',
  email: string,
  phone: string | undefined,
): Promise<{id: number; tags: string} | null> {
  const queries: string[] = [];
  if (field === 'phone' && phone) queries.push(`phone:${phone}`);
  queries.push(`email:${email}`);
  if (field !== 'phone' && phone) queries.push(`phone:${phone}`);

  const delays = [0, 1500, 3000];
  for (const delay of delays) {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    for (const q of queries) {
      const found = await findCustomerBy(ctx, q);
      if (found) return found;
    }
  }
  return null;
}

async function postCustomer(
  ctx: AdminContext,
  payload: ShopifyCustomerPayload,
): Promise<{ok: boolean; status: number; body: string}> {
  const res = await fetch(`${ctx.baseUrl}/customers.json`, {
    method: 'POST',
    headers: ctx.headers,
    body: JSON.stringify({customer: payload}),
  });
  const body = await res.text();
  return {ok: res.ok, status: res.status, body};
}

async function putCustomer(
  ctx: AdminContext,
  id: number,
  payload: ShopifyCustomerPayload,
): Promise<{ok: boolean; status: number; body: string}> {
  const res = await fetch(`${ctx.baseUrl}/customers/${id}.json`, {
    method: 'PUT',
    headers: ctx.headers,
    body: JSON.stringify({customer: payload}),
  });
  const body = await res.text();
  return {ok: res.ok, status: res.status, body};
}

/**
 * Creates or updates a Shopify customer with partial form data at a given step.
 * Used to track which step the user reached before abandoning.
 */
export async function checkpointShopifyCustomer(
  data: {nombre: string; email: string; whatsapp: string},
  step: number,
  env: ShopifyEnv,
): Promise<void> {
  const ctx = buildAdminContext(env);
  if (!ctx) {
    console.warn('[Shopify] Env vars not configured — skipping checkpoint');
    return;
  }

  const stepName = STEP_NAMES[step] ?? `paso-${step}`;

  const phone = normalizePhone(data.whatsapp);
  const metafields: ShopifyMetafield[] = [
    {
      namespace: 'armandoff',
      key: 'ultimo_paso',
      value: `${step} - ${stepName}`,
      type: 'single_line_text_field',
    },
    {
      namespace: 'armandoff',
      key: 'checkpoint_at',
      value: new Date().toISOString(),
      type: 'single_line_text_field',
    },
  ];
  const tags = 'formulario-incompleto, armandoff-lead';

  const payload: ShopifyCustomerPayload = {
    first_name: data.nombre,
    email: data.email,
    phone,
    tags,
    metafields,
  };

  const create = await postCustomer(ctx, payload);
  if (create.ok) {
    const created = JSON.parse(create.body) as {customer: {id: number}};
    console.log(
      `[Shopify] Checkpoint created: customer ${created.customer.id} → paso ${step}`,
    );
    return;
  }

  if (create.status !== 422) {
    console.error(
      `[Shopify] Checkpoint create failed (${create.status}):`,
      create.body,
    );
    return;
  }

  const {field, reason} = parseShopifyError(create.body);
  console.warn(
    `[Shopify] Checkpoint 422 on field=${field} reason=${reason} — recovering`,
  );

  // Phone invalid → retry without phone, stash original whatsapp in note.
  if (field === 'phone' && /invalid/i.test(reason)) {
    const fallback: ShopifyCustomerPayload = {
      ...payload,
      phone: undefined,
      note: `WhatsApp (no aceptado por Shopify): ${data.whatsapp}`,
    };
    const retry = await postCustomer(ctx, fallback);
    if (retry.ok) {
      const created = JSON.parse(retry.body) as {customer: {id: number}};
      console.log(
        `[Shopify] Checkpoint created without phone: customer ${created.customer.id} → paso ${step}`,
      );
      return;
    }
    if (retry.status !== 422) {
      console.error(
        `[Shopify] Checkpoint retry-without-phone failed (${retry.status}):`,
        retry.body,
      );
      return;
    }
    // Fall through to lookup-and-update path with the no-phone payload.
    payload.phone = undefined;
    payload.note = fallback.note;
  }

  // Look up the existing customer based on which field collided.
  const existing = await lookupExistingCustomer(
    ctx,
    field,
    data.email,
    payload.phone,
  );

  if (!existing) {
    console.error(
      `[Shopify] Checkpoint 422 (${field}) but no existing customer found by email or phone`,
    );
    return;
  }

  // Don't downgrade a completed form back to incomplete.
  if (existing.tags.includes('formulario-completo')) return;

  const update = await putCustomer(ctx, existing.id, {
    tags,
    metafields,
  });
  if (!update.ok) {
    console.error(
      `[Shopify] Checkpoint update failed (${update.status}):`,
      update.body,
    );
    return;
  }

  console.log(
    `[Shopify] Checkpoint updated: customer ${existing.id} → paso ${step}`,
  );
}

export async function createShopifyCustomer(
  data: FormData,
  env: ShopifyEnv,
): Promise<void> {
  const ctx = buildAdminContext(env);
  if (!ctx) {
    console.warn(
      '[Shopify] SHOPIFY_STORE_URL or SHOPIFY_ACCESS_TOKEN not configured — skipping customer creation',
    );
    return;
  }

  const category = getRevenueCategory(data.monthlyRevenue);
  const submittedAt = new Date().toISOString();

  const phone = normalizePhone(data.whatsapp);
  const tags = `${category}, armandoff-lead, formulario-completo`;
  const noteLines = [
    data.businessUrl ? `URL del negocio: ${data.businessUrl}` : null,
    `Inversión en ads: ${data.adsInvestment}`,
    `Meta a 90 días: ${data.goal90Days}`,
    `Cuándo empezar: ${data.startWhen}`,
    `Principal obstáculo: ${data.mainObstacle}`,
  ].filter(Boolean) as string[];
  const metafields: ShopifyMetafield[] = [
    {
      namespace: 'armandoff',
      key: 'ultimo_paso',
      value: 'Formulario completado',
      type: 'single_line_text_field',
    },
    {
      namespace: 'armandoff',
      key: 'marketing_channels',
      value: data.marketingChannels.join(', '),
      type: 'single_line_text_field',
    },
    {
      namespace: 'armandoff',
      key: 'monthly_revenue',
      value: data.monthlyRevenue,
      type: 'single_line_text_field',
    },
    {
      namespace: 'armandoff',
      key: 'revenue_category',
      value: category,
      type: 'single_line_text_field',
    },
    {
      namespace: 'armandoff',
      key: 'ads_investment',
      value: data.adsInvestment,
      type: 'single_line_text_field',
    },
    {
      namespace: 'armandoff',
      key: 'start_when',
      value: data.startWhen,
      type: 'single_line_text_field',
    },
    {
      namespace: 'armandoff',
      key: 'submitted_at',
      value: submittedAt,
      type: 'single_line_text_field',
    },
  ];

  const emailMarketingConsent: ShopifyEmailMarketingConsent = {
    state: 'subscribed',
    opt_in_level: 'single_opt_in',
    consent_updated_at: submittedAt,
  };

  let payload: ShopifyCustomerPayload = {
    first_name: data.nombre,
    email: data.email,
    phone,
    tags,
    note: noteLines.join('\n'),
    metafields,
    email_marketing_consent: emailMarketingConsent,
  };

  const create = await postCustomer(ctx, payload);
  if (create.ok) {
    const created = JSON.parse(create.body) as {customer: {id: number}};
    console.log(
      `[Shopify] Created customer ${created.customer.id} → category: ${category}`,
    );
    return;
  }

  if (create.status !== 422) {
    console.error(`[Shopify] Create failed (${create.status}):`, create.body);
    return;
  }

  const {field, reason} = parseShopifyError(create.body);
  console.warn(
    `[Shopify] Create 422 on field=${field} reason=${reason} — recovering`,
  );

  // Phone invalid → retry without phone, stash original whatsapp in note.
  if (field === 'phone' && /invalid/i.test(reason)) {
    payload = {
      ...payload,
      phone: undefined,
      note: `WhatsApp (no aceptado por Shopify): ${data.whatsapp}\n${payload.note ?? ''}`.trim(),
    };
    const retry = await postCustomer(ctx, payload);
    if (retry.ok) {
      const created = JSON.parse(retry.body) as {customer: {id: number}};
      console.log(
        `[Shopify] Created customer without phone ${created.customer.id} → category: ${category}`,
      );
      return;
    }
    if (retry.status !== 422) {
      console.error(
        `[Shopify] Create retry-without-phone failed (${retry.status}):`,
        retry.body,
      );
      return;
    }
    // Fall through into the lookup-and-update branch with the no-phone payload.
  }

  // Lookup the existing customer based on which field collided.
  const existing = await lookupExistingCustomer(
    ctx,
    field,
    data.email,
    payload.phone,
  );

  if (!existing) {
    console.error(
      `[Shopify] 422 (${field}) but no existing customer found by email or phone — lead lost. body=${create.body}`,
    );
    return;
  }

  const update = await putCustomer(ctx, existing.id, {
    tags,
    note: payload.note,
    metafields,
    email_marketing_consent: emailMarketingConsent,
  });
  if (!update.ok) {
    console.error(
      `[Shopify] Failed to update existing customer (${update.status}):`,
      update.body,
    );
    return;
  }

  console.log(
    `[Shopify] Updated existing customer ${existing.id} → category: ${category}`,
  );
}
