import type {Route} from './+types/_index';

export const meta: Route.MetaFunction = () => [
  {title: 'Armando FresaFit | Mentoría Empresarial & Estrategia de Negocios'},
];

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="container-custom text-center">
        <p className="font-montserrat text-sm uppercase tracking-[0.3em] text-brand-beige mb-4">
          Hydrogen migration · WIP
        </p>
        <h1 className="heading-xl text-white mb-6">
          Armando <span className="text-brand-beige">FresaFit</span>
        </h1>
        <p className="body-text max-w-xl mx-auto">
          Esta es la nueva landing migrando de Next.js a Shopify Hydrogen + Oxygen.
          Las páginas se irán portando por fases — puedes seguir el plan en el
          repo principal.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://armandoff.com" className="btn-primary">
            Sitio actual
          </a>
          <a
            href="https://github.com/Oogwey01/Hydrogen-ffpage"
            className="btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Repo Hydrogen
          </a>
        </div>
        <p className="mt-12 font-dafoe text-2xl text-brand-beige/80">
          coming soon
        </p>
      </div>
    </main>
  );
}
