import type {Route} from './+types/cookies';
import {LegalPageLayout, LegalSection} from '~/components/legal/LegalPageLayout';

export const meta: Route.MetaFunction = () => [
  {title: 'Política de Cookies | Armando FF'},
  {
    name: 'description',
    content:
      'Información sobre las cookies que utilizamos en armandoff.com y cómo configurarlas.',
  },
  {name: 'robots', content: 'index, follow'},
];

export default function CookiesPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Política de Cookies"
      lastUpdated="14 de abril de 2026"
    >
      <p>
        Esta política explica qué son las cookies, cuáles utilizamos en{' '}
        <strong className="text-white">armandoff.com</strong> y cómo puedes gestionarlas.
      </p>

      <LegalSection title="1. ¿Qué son las cookies?">
        <p>
          Las cookies son pequeños archivos de texto que un sitio web guarda en tu dispositivo
          cuando lo visitas. Sirven para recordar preferencias, analizar el uso del sitio y
          ofrecerte una experiencia más relevante.
        </p>
      </LegalSection>

      <LegalSection title="2. Tipos de cookies que usamos">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Técnicas (necesarias):</strong> permiten el
            funcionamiento básico del sitio. No requieren consentimiento.
          </li>
          <li>
            <strong className="text-white">De preferencias:</strong> almacenan elecciones como
            el progreso del formulario de calificación (localStorage).
          </li>
          <li>
            <strong className="text-white">Analíticas:</strong> nos ayudan a entender cómo los
            visitantes usan el sitio para mejorarlo (p. ej., Google Analytics).
          </li>
          <li>
            <strong className="text-white">De marketing:</strong> utilizadas por plataformas
            publicitarias como Meta Pixel para medir el rendimiento de campañas.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Cookies de terceros">
        <p>
          Algunos servicios integrados pueden instalar sus propias cookies. Entre ellos:{' '}
          <strong className="text-white">
            [Google Analytics, Meta Pixel, Calendly, YouTube, Vimeo]
          </strong>
          . Cada proveedor cuenta con su propia política de privacidad.
        </p>
      </LegalSection>

      <LegalSection title="4. Cómo gestionar las cookies">
        <p>
          Puedes aceptar, rechazar o eliminar las cookies desde la configuración de tu
          navegador. Ten en cuenta que deshabilitar ciertas cookies puede afectar el
          funcionamiento del sitio.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Chrome: Configuración → Privacidad y seguridad → Cookies.</li>
          <li>Safari: Preferencias → Privacidad.</li>
          <li>Firefox: Opciones → Privacidad y seguridad.</li>
          <li>Edge: Configuración → Cookies y permisos del sitio.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Actualizaciones">
        <p>
          Podemos actualizar esta política cuando cambien las cookies que utilizamos.
          Revísala periódicamente para estar al tanto.
        </p>
      </LegalSection>

      <LegalSection title="6. Contacto">
        <p>
          Para dudas sobre esta política, escríbenos a{' '}
          <strong className="text-white">[contacto@armandoff.com]</strong>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
