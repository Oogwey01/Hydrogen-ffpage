import type {Route} from './+types/aviso-legal';
import {LegalPageLayout, LegalSection} from '~/components/legal/LegalPageLayout';

export const meta: Route.MetaFunction = () => [
  {title: 'Aviso Legal | Armando FF'},
  {
    name: 'description',
    content:
      'Información legal del titular del sitio armandoff.com y condiciones de acceso.',
  },
  {name: 'robots', content: 'index, follow'},
];

export default function AvisoLegalPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Aviso Legal"
      lastUpdated="14 de abril de 2026"
    >
      <p>
        En cumplimiento de la normativa aplicable, se informa a los usuarios del sitio{' '}
        <strong className="text-white">armandoff.com</strong> de los siguientes datos del
        titular.
      </p>

      <LegalSection title="1. Datos del titular">
        <ul className="list-none space-y-1.5">
          <li>
            <strong className="text-white">Titular:</strong> [NOMBRE LEGAL / RAZÓN SOCIAL]
          </li>
          <li>
            <strong className="text-white">RFC / Identificación fiscal:</strong> [RFC]
          </li>
          <li>
            <strong className="text-white">Domicilio:</strong> [DIRECCIÓN COMPLETA]
          </li>
          <li>
            <strong className="text-white">Correo electrónico:</strong>{' '}
            [contacto@armandoff.com]
          </li>
          <li>
            <strong className="text-white">Actividad:</strong> Servicios de consultoría,
            mentoría y formación en e-commerce.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Objeto del sitio">
        <p>
          El sitio tiene como finalidad ofrecer información sobre los servicios del titular,
          captar solicitudes de interés a través del formulario de calificación y publicar
          contenido relacionado con el desarrollo de negocios digitales.
        </p>
      </LegalSection>

      <LegalSection title="3. Condiciones de acceso">
        <p>
          El acceso al sitio es libre y gratuito. El usuario se compromete a usarlo conforme
          a la ley, la buena fe y estos avisos, absteniéndose de cualquier uso que pueda
          dañar la imagen, intereses o derechos del titular o de terceros.
        </p>
      </LegalSection>

      <LegalSection title="4. Propiedad intelectual e industrial">
        <p>
          Todos los contenidos del sitio (textos, imágenes, diseño, código) son titularidad
          del titular o se usan con licencia. Están prohibidas la reproducción, distribución,
          transformación o comunicación pública de estos contenidos sin autorización expresa
          por escrito.
        </p>
      </LegalSection>

      <LegalSection title="5. Enlaces a terceros">
        <p>
          El sitio puede contener enlaces a páginas de terceros. El titular no se
          responsabiliza del contenido, disponibilidad ni prácticas de privacidad de dichos
          sitios.
        </p>
      </LegalSection>

      <LegalSection title="6. Exclusión de garantías">
        <p>
          El titular no garantiza la disponibilidad ininterrumpida del sitio ni que esté libre
          de errores, virus u otros elementos dañinos, aunque adopta medidas razonables para
          evitarlos.
        </p>
      </LegalSection>

      <LegalSection title="7. Modificaciones">
        <p>
          El titular se reserva el derecho a modificar unilateralmente la presentación,
          configuración y contenido del sitio, así como las condiciones de acceso.
        </p>
      </LegalSection>

      <LegalSection title="8. Legislación aplicable">
        <p>
          El presente aviso legal se rige por la legislación de los Estados Unidos Mexicanos.
          Para cualquier controversia derivada del uso del sitio, las partes se someten a los
          tribunales competentes de{' '}
          <strong className="text-white">[CIUDAD / ESTADO]</strong>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
