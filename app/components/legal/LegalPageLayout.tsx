import {motion} from 'framer-motion';
import Header from '~/components/common/Header';
import Footer from '~/components/common/Footer';
import QualificationForm from '~/components/form/QualificationForm';
import {useFormModal} from '~/hooks/useFormModal';

interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPageLayout({
  eyebrow,
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  const {isOpen, open, close} = useFormModal();

  return (
    <>
      <Header onOpenForm={open} />

      <main className="bg-brand-black min-h-screen">
        <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(200,157,105,0.5) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 container-custom max-w-3xl">
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, ease: 'easeOut'}}
              className="mb-10 md:mb-14"
            >
              <p className="font-barlow font-bold text-xs tracking-[0.3em] uppercase text-brand-beige mb-4">
                {eyebrow}
              </p>
              <h1 className="font-barlow font-black text-3xl sm:text-4xl md:text-5xl uppercase leading-[1] tracking-tight text-white mb-4">
                {title}
              </h1>
              <p className="font-montserrat text-sm text-gray-500 font-light">
                Última actualización: {lastUpdated}
              </p>
            </motion.div>

            <motion.article
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: 0.15, ease: 'easeOut'}}
              className="legal-prose font-montserrat text-gray-300 font-light leading-relaxed space-y-8"
            >
              {children}
            </motion.article>
          </div>
        </section>
      </main>

      <Footer />
      <QualificationForm isOpen={isOpen} onClose={close} />
    </>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-barlow font-extrabold text-xl md:text-2xl uppercase tracking-tight text-white">
        {title}
      </h2>
      <div className="space-y-3 text-base text-gray-300/90">{children}</div>
    </section>
  );
}
