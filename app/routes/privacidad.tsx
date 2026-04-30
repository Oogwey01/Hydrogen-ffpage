import type {Route} from './+types/privacidad';
import {LegalPageLayout, LegalSection} from '~/components/legal/LegalPageLayout';

export const meta: Route.MetaFunction = () => [
  {title: 'Política de Privacidad | Armando FF'},
  {
    name: 'description',
    content:
      'Conoce cómo Armando FF recopila, usa y protege tus datos personales conforme a la LFPDPPP.',
  },
  {name: 'robots', content: 'index, follow'},
];

export default function PrivacidadPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Política de Privacidad"
      lastUpdated="14 de abril de 2026"
    >
      <p>
        En <strong className="text-white">Armando FF</strong> (en adelante, &ldquo;nosotros&rdquo;)
        respetamos tu privacidad y nos comprometemos a proteger los datos personales que
        recopilamos a través de este sitio web. Este documento describe qué información
        obtenemos, cómo la usamos y qué derechos tienes sobre ella, conforme a la Ley Federal
        de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México.
      </p>

      <LegalSection title="1. Responsable del tratamiento">
        <p>
          El responsable del tratamiento de tus datos personales es{' '}
          <strong className="text-white">[NOMBRE LEGAL DE LA EMPRESA / PERSONA]</strong>, con
          domicilio en <strong className="text-white">[DIRECCIÓN FISCAL]</strong> y correo de
          contacto <strong className="text-white">[contacto@armandoff.com]</strong>.
        </p>
      </LegalSection>

      <LegalSection title="2. Datos que recopilamos">
        <p>Cuando interactúas con nuestro sitio podemos recopilar:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Datos de identificación: nombre completo.</li>
          <li>Datos de contacto: correo electrónico, número de WhatsApp.</li>
          <li>Datos del negocio: URL, canales de marketing, facturación, meta de ventas.</li>
          <li>Datos de navegación: IP, tipo de dispositivo, páginas visitadas (cookies).</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Finalidades del tratamiento">
        <p>Usamos tus datos para las siguientes finalidades:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Atender tu solicitud de calificación, mentoría o servicios.</li>
          <li>Contactarte para agendar llamadas o enviarte información relevante.</li>
          <li>
            Enviar comunicaciones comerciales sobre nuestros servicios (con tu consentimiento).
          </li>
          <li>Mejorar la experiencia y funcionamiento del sitio.</li>
          <li>Cumplir obligaciones legales aplicables.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Transferencias de datos">
        <p>
          Tus datos pueden ser compartidos con proveedores que nos ayudan a prestar el
          servicio (hosting, CRM, email, analítica). Estos terceros están obligados a proteger
          tu información y a usarla únicamente para los fines contratados. No vendemos ni
          comercializamos tus datos personales.
        </p>
      </LegalSection>

      <LegalSection title="5. Derechos ARCO">
        <p>
          En cualquier momento puedes ejercer tus derechos de{' '}
          <strong className="text-white">
            Acceso, Rectificación, Cancelación y Oposición
          </strong>
          , así como revocar tu consentimiento, enviando una solicitud al correo{' '}
          <strong className="text-white">[contacto@armandoff.com]</strong> con tu nombre
          completo y descripción del derecho que deseas ejercer.
        </p>
      </LegalSection>

      <LegalSection title="6. Conservación de datos">
        <p>
          Conservaremos tus datos solo por el tiempo necesario para cumplir las finalidades
          descritas o para cumplir obligaciones legales. Posteriormente serán eliminados de
          forma segura.
        </p>
      </LegalSection>

      <LegalSection title="7. Cambios al aviso">
        <p>
          Podemos actualizar esta política en cualquier momento. Publicaremos los cambios en
          esta misma página y, cuando sea relevante, te notificaremos por los medios de
          contacto que nos proporcionaste.
        </p>
      </LegalSection>

      <LegalSection title="8. Contacto">
        <p>
          Si tienes dudas sobre esta política o sobre el tratamiento de tus datos, escríbenos
          a <strong className="text-white">[contacto@armandoff.com]</strong>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
