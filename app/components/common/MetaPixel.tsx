import {useEffect} from 'react';
import {useLocation} from 'react-router';

interface MetaPixelProps {
  pixelId: string;
  /** CSP nonce — viene de useNonce() en root.tsx */
  nonce?: string;
}

/**
 * Componente raíz del Meta Pixel.
 * 1) Inyecta el snippet base inline (con nonce) en SSR para arrancar fbq pronto.
 * 2) Dispara PageView en cada cambio de ruta — necesario en SPAs como Hydrogen,
 *    donde la navegación cliente no recarga el documento.
 *
 * No-op si pixelId está vacío.
 */
export function MetaPixel({pixelId, nonce}: MetaPixelProps) {
  if (!pixelId) return null;

  return (
    <>
      <script
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
          `.trim(),
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{display: 'none'}}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
      <PageViewTracker />
    </>
  );
}

/**
 * Dispara fbq('track', 'PageView') en cada cambio de ruta (client-side nav).
 * El PageView inicial ya lo dispara el snippet base — este maneja las
 * subsecuentes.
 */
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
    window.fbq('track', 'PageView');
  }, [location.pathname, location.search]);

  return null;
}
