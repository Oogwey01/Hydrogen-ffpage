import type {Route} from './+types/terminos';
import {LegalPageLayout, LegalSection} from '~/components/legal/LegalPageLayout';

export const meta: Route.MetaFunction = () => [
  {title: 'Términos y Condiciones | Armando FF'},
  {
    name: 'description',
    content:
      'Términos y condiciones de uso de los servicios y del sitio web de Armando FF.',
  },
  {name: 'robots', content: 'index, follow'},
];

export default function TerminosPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Términos y Condiciones"
      lastUpdated="14 de abril de 2026"
    >
      <p>
        Estos Términos y Condiciones regulan el acceso y uso del sitio web{' '}
        <strong className="text-white">armandoff.com</strong> y los servicios ofrecidos por{' '}
        <strong className="text-white">Armando FF</strong> (en adelante, &ldquo;nosotros&rdquo; o
        el &ldquo;titular&rdquo;). Al utilizar este sitio aceptas quedar vinculado por estos
        términos.
      </p>

      <LegalSection title="1. Aceptación">
        <p>
          El uso de este sitio implica la aceptación plena y sin reservas de los presentes
          términos. Si no estás de acuerdo con alguna disposición, debes abstenerte de usar el
          sitio o contratar los servicios.
        </p>
      </LegalSection>

      <LegalSection title="2. Servicios ofrecidos">
        <p>
          A través del sitio ofrecemos servicios de consultoría, mentoría, contenido y
          formación en e-commerce. Las condiciones específicas (alcance, entregables, plazos,
          precio, política de reembolso) se detallarán en la propuesta o contrato firmado con
          cada cliente antes del inicio de cualquier servicio.
        </p>
      </LegalSection>

      <LegalSection title="3. Registro y formulario de calificación">
        <p>
          Para solicitar cualquier servicio debes completar el formulario de calificación con
          información veraz y actualizada. Nos reservamos el derecho de aceptar o rechazar
          solicitudes que no cumplan con nuestros criterios.
        </p>
      </LegalSection>

      <LegalSection title="4. Pagos y facturación">
        <p>
          Los precios se comunicarán antes de iniciar cualquier servicio y podrán expresarse
          en pesos mexicanos o dólares estadounidenses. Los métodos de pago aceptados, las
          fechas de cobro y la política de reembolso se especificarán en el acuerdo
          correspondiente.
        </p>
      </LegalSection>

      <LegalSection title="5. Propiedad intelectual">
        <p>
          Todo el contenido del sitio (textos, imágenes, gráficos, logos, videos, código) es
          propiedad de Armando FF o se utiliza con licencia, y está protegido por las leyes de
          propiedad intelectual aplicables. Queda prohibida su reproducción, distribución o
          modificación sin autorización expresa.
        </p>
      </LegalSection>

      <LegalSection title="6. Uso aceptable">
        <p>Al usar este sitio te comprometes a no:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Utilizarlo para fines ilícitos o fraudulentos.</li>
          <li>Intentar vulnerar la seguridad o funcionamiento del sitio.</li>
          <li>Reproducir o copiar el contenido sin autorización.</li>
          <li>Suplantar a terceros o proporcionar información falsa.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Limitación de responsabilidad">
        <p>
          Los servicios se ofrecen &ldquo;tal cual&rdquo;. No garantizamos resultados
          específicos derivados de la aplicación de nuestras recomendaciones, ya que dependen
          de múltiples factores externos al alcance del titular. En ningún caso Armando FF
          será responsable por daños indirectos, lucro cesante o pérdida de oportunidad.
        </p>
      </LegalSection>

      <LegalSection title="8. Modificaciones">
        <p>
          Podemos modificar estos términos en cualquier momento. Los cambios entrarán en vigor
          al publicarse en esta página. El uso continuado del sitio implica la aceptación de
          la versión vigente.
        </p>
      </LegalSection>

      <LegalSection title="9. Legislación aplicable y jurisdicción">
        <p>
          Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier
          controversia se someterá a los tribunales competentes de{' '}
          <strong className="text-white">[CIUDAD / ESTADO]</strong>, renunciando las partes a
          cualquier otra jurisdicción que pudiera corresponderles.
        </p>
      </LegalSection>

      <LegalSection title="10. Contacto">
        <p>
          Para cualquier duda sobre estos términos, escríbenos a{' '}
          <strong className="text-white">[contacto@armandoff.com]</strong>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
