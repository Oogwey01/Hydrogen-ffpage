import {useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import type {Route} from './+types/root';

// Fonts: self-hosted via @fontsource (no Google CDN, no tracking).
import '@fontsource/barlow/300.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/barlow/800.css';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';

import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {MetaPixel} from '~/components/common/MetaPixel';

export type RootLoader = typeof loader;

/**
 * Sin productos ni cart, no hay razón para revalidar el root en cada navegación.
 */
export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export function links() {
  return [
    {rel: 'preconnect', href: 'https://connect.facebook.net'},
    {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/favicon/favicon-16x16.png'},
    {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicon/favicon-32x32.png'},
    {rel: 'icon', type: 'image/png', sizes: '192x192', href: '/images/favicon/android-chrome-192x192.png'},
    {rel: 'icon', type: 'image/png', sizes: '512x512', href: '/images/favicon/android-chrome-512x512.png'},
    {rel: 'apple-touch-icon', sizes: '180x180', href: '/images/favicon/apple-touch-icon.png'},
  ];
}

export const meta: Route.MetaFunction = () => [
  {title: 'Armando FresaFit | Mentoría Empresarial & Estrategia de Negocios'},
  {
    name: 'description',
    content:
      '5 años convirtiendo errores en aprendizaje. Mentoría empresarial, webinars y consultoría estratégica para emprendedores que buscan escalar sus negocios con resultados reales.',
  },
  {name: 'keywords', content: 'mentoría empresarial, consultoría de negocios, webinars, estrategia de negocios, Armando FresaFit, emprendimiento, marketing digital, escalar negocio'},
  {property: 'og:title', content: 'Armando FresaFit | Mentoría Empresarial'},
  {
    property: 'og:description',
    content: 'Estrategia real de un joven empresario mexicano. Mentoría, webinars y consultoría para escalar tu negocio.',
  },
  {property: 'og:type', content: 'website'},
  {property: 'og:locale', content: 'es_MX'},
  {property: 'og:site_name', content: 'Armando FresaFit'},
  {name: 'twitter:card', content: 'summary_large_image'},
  {name: 'twitter:title', content: 'Armando FresaFit | Mentoría Empresarial'},
  {
    name: 'twitter:description',
    content: '5 años convirtiendo errores en aprendizaje. Estrategia real para emprendedores.',
  },
  {name: 'robots', content: 'index, follow'},
];

/**
 * Root loader: solo expone env vars públicas al cliente.
 * Sin queries de storefront porque esto NO es una tienda — usamos Shopify
 * Admin API server-side para crear customers desde el form.
 */
export async function loader({context}: Route.LoaderArgs) {
  return {
    publicEnv: {
      META_PIXEL_ID: context.env.PUBLIC_META_PIXEL_ID ?? '',
      CALENDLY_URL: context.env.PUBLIC_CALENDLY_URL ?? '',
    },
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');
  const pixelId = data?.publicEnv.META_PIXEL_ID ?? '';

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={resetStyles} />
        <link rel="stylesheet" href={appStyles} />
        <Meta />
        <Links />
      </head>
      <body>
        <MetaPixel pixelId={pixelId} nonce={nonce} />
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Error desconocido';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black text-white px-6">
      <div className="max-w-md text-center">
        <h1 className="font-barlow font-extrabold uppercase text-4xl text-brand-beige">Oops</h1>
        <h2 className="font-barlow text-xl mt-2">{errorStatus}</h2>
        {errorMessage && (
          <p className="font-montserrat text-sm text-gray-300 mt-4 break-words">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
