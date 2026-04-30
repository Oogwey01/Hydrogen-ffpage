/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

import '@total-typescript/ts-reset';

declare global {
  /**
   * Variables disponibles en `context.env` (server-side, Workers).
   * Las que llevan prefijo PUBLIC_ se inyectan al cliente vía root loader.
   */
  interface Env {
    SESSION_SECRET: string;

    // Públicas (cliente las necesita)
    PUBLIC_META_PIXEL_ID?: string;
    PUBLIC_CALENDLY_URL?: string;

    // Shopify Admin API (custom app token, NO OAuth)
    SHOPIFY_STORE_URL?: string;
    SHOPIFY_ACCESS_TOKEN?: string;
    SHOPIFY_API_VERSION?: string;

    // Meta Conversions API (server-side)
    META_CAPI_ACCESS_TOKEN?: string;
    META_CAPI_API_VERSION?: string;
    META_CAPI_TEST_EVENT_CODE?: string;

    // Webhook opcional para reenviar leads
    FORM_WEBHOOK_URL?: string;

    // Hydrogen storefront — requeridas por createHydrogenContext aunque no
    // las usemos para productos. Mock-shop las provee en dev, en prod las
    // configuramos al hacer `shopify hydrogen link`.
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PUBLIC_STOREFRONT_ID: string;
    PUBLIC_CHECKOUT_DOMAIN: string;
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: string;
    PUBLIC_CUSTOMER_ACCOUNT_API_URL: string;
  }
}

export {};
