import {AnimatePresence, motion} from 'framer-motion';
import {useEffect, useState} from 'react';
import {ANIMATION_EASE} from '~/lib/animations/variants';
import {trackEvent} from '~/lib/meta-pixel';

interface FloatingActionsProps {
  // Acción al hacer click en el botón flotante. Por defecto abre el form modal.
  onAction: () => void;
}

// Botones flotantes — WhatsApp (siempre visible) + Scroll to top (aparece tras 50vh)
export function FloatingActions({onAction}: FloatingActionsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight * 0.5);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tooltip aparece 2s después del mount, se oculta a los 10s
  useEffect(() => {
    const showTimer = setTimeout(() => setShowTooltip(true), 2000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 10000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end gap-3">
      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{opacity: 0, scale: 0.7, y: 10}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.7, y: 10}}
            transition={{duration: 0.3, ease: ANIMATION_EASE}}
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            aria-label="Volver arriba"
            className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-brand-black/80 backdrop-blur-md border border-brand-beige/40 text-brand-beige hover:bg-brand-beige hover:text-brand-black transition-colors flex items-center justify-center shadow-lg"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
              <path
                d="M12 19V5m-6 6l6-6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp button con pulse + tooltip */}
      <div className="relative">
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{opacity: 0, x: 10, scale: 0.9}}
              animate={{opacity: 1, x: 0, scale: 1}}
              exit={{opacity: 0, x: 10, scale: 0.9}}
              transition={{duration: 0.3, ease: ANIMATION_EASE}}
              className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap"
            >
              <div className="rounded-xl bg-brand-black/95 backdrop-blur-md border border-brand-beige/30 px-4 py-2.5 shadow-xl">
                <p className="font-barlow font-bold text-sm text-white">
                  Hablemos por WhatsApp
                </p>
                <p className="font-montserrat text-[11px] text-brand-beige flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Cuéntame tu situación primero (2 min)
                </p>
              </div>
              {/* Flecha */}
              <span
                aria-hidden="true"
                className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-y-8 border-l-8 border-y-transparent border-l-brand-black/95"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => {
            trackEvent(
              'Contact',
              {content_name: 'Floating Form Trigger', method: 'form'},
              {sendToCapi: true},
            );
            onAction();
          }}
          aria-label="Hablar por WhatsApp — abrir formulario primero"
          whileHover={{scale: 1.08}}
          whileTap={{scale: 0.95}}
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(37,211,102,0.5)',
              '0 0 0 14px rgba(37,211,102,0)',
              '0 0 0 0 rgba(37,211,102,0)',
            ],
          }}
          transition={{
            boxShadow: {duration: 2.2, repeat: Infinity, ease: 'easeOut'},
          }}
          className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] text-white shadow-lg"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 md:w-8 md:h-8">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
