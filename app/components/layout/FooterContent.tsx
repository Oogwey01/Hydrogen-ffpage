import {motion} from 'framer-motion';
import {ANIMATION_EASE} from '~/lib/animations/variants';

// ── Estructura de 4 columnas ──
const FOOTER_COLUMNS = [
  {
    title: 'Servicios',
    links: [
      {label: 'Paquetes de contenido', href: '#paquetes'},
      {label: 'Webinars', href: '#webinar'},
      {label: 'Casos de estudio', href: '#casos'},
    ],
  },
  {
    title: 'Recursos',
    links: [
      {label: 'Blog & artículos', href: '#blog'},
      {label: 'Guías gratuitas', href: '#guias'},
      {label: 'Ejemplos creativos', href: '#ejemplos'},
      {label: 'Benchmarks del sector', href: '#benchmarks'},
    ],
  },
  {
    title: 'Legal',
    links: [
      {label: 'Política de privacidad', href: '/privacidad'},
      {label: 'Términos y condiciones', href: '/terminos'},
      {label: 'Política de cookies', href: '/cookies'},
      {label: 'Aviso legal', href: '/aviso-legal'},
    ],
  },
] as const;

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/armandoff/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.3 2.4.5.6.2 1 .5 1.5 1s.8.9 1 1.5c.2.5.4 1.2.5 2.4.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.9-.5 2.4-.2.6-.5 1-1 1.5s-.9.8-1.5 1c-.5.2-1.2.4-2.4.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.3-2.4-.5-.6-.2-1-.5-1.5-1s-.8-.9-1-1.5c-.2-.5-.4-1.2-.5-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.9.5-2.4.2-.6.5-1 1-1.5s.9-.8 1.5-1c.5-.2 1.2-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.2 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8s-.6.8-.8 1.3c-.1.4-.3 1-.4 2.1 0 1.2-.1 1.5-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3s.8.6 1.3.8c.4.2 1 .3 2.1.4 1.2 0 1.5.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8s.6-.8.8-1.3c.2-.4.3-1 .4-2.1 0-1.2.1-1.5.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3s-.8-.6-1.3-.8c-.4-.1-1-.3-2.1-.4C15.6 4.1 15.2 4 12 4zm0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm0 1.8a3.1 3.1 0 100 6.2 3.1 3.1 0 000-6.2zm5.1-2c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2-1.2-.5-1.2-1.2.5-1.2 1.2-1.2z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@armandoff',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.6 6.8a5.2 5.2 0 01-3.2-1.1 5.3 5.3 0 01-2-3.6V2h-3.6v13.2a2.6 2.6 0 11-1.8-2.5V9a6.2 6.2 0 105.4 6.2V9a8.9 8.9 0 005.2 1.7z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@armandoff',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.5 6.5a3 3 0 00-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 00.5 6.5 31 31 0 000 12a31 31 0 00.5 5.5 3 3 0 002.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.5zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
      </svg>
    ),
  },
] as const;

const TRUST_BADGES = [
  {
    label: 'Hermosillo, Sonora',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path
          d="M12 22s8-7 8-13a8 8 0 10-16 0c0 6 8 13 8 13z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    label: '+5 años de experiencia',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 7v5l3 2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Equipo creativo dedicado',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path
          d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M21 20v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8M10 11a4 4 0 100-8 4 4 0 000 8z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'AMEX', 'SPEI', 'PayPal'];

interface LeadMagnet {
  eyebrow?: string;
  title: string;
  description: string;
  buttonLabel: string;
  successLabel?: string;
}

const DEFAULT_LEAD_MAGNET: LeadMagnet = {
  eyebrow: 'Lead magnet gratuito',
  title: 'Guía: 10 hooks que venden',
  description:
    'Recibe tips de contenido semanales + la guía con los hooks que usamos para escalar FRESA FIT a 3.8M+ de alcance.',
  buttonLabel: 'Recibir Tips de Contenido',
};

interface FooterContentProps {
  leadMagnet?: LeadMagnet;
  onOpenForm?: () => void;
}

export function FooterContent({
  leadMagnet = DEFAULT_LEAD_MAGNET,
  onOpenForm,
}: FooterContentProps = {}) {
  return (
    <footer className="relative bg-brand-gray border-t border-brand-beige/20 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: "url('/images/backgrounds/backgroundFULL.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-brand-black/25" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 md:pt-20">
        {/* ── Newsletter premium ── */}
        <section className="rounded-2xl border border-brand-beige/30 bg-gradient-to-br from-brand-black to-[#0a0a0a] p-6 md:p-10 mb-14">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
            <div>
              <p className="font-montserrat font-bold text-xs tracking-[0.3em] uppercase text-brand-beige mb-3">
                {leadMagnet.eyebrow ?? 'Lead magnet gratuito'}
              </p>
              <h3 className="font-barlow font-black text-2xl md:text-3xl uppercase text-white leading-tight mb-2">
                {leadMagnet.title}
              </h3>
              <p className="font-montserrat text-sm text-gray-300 font-light leading-relaxed tracking-wide">
                {leadMagnet.description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <motion.button
                type="button"
                onClick={onOpenForm}
                whileHover={{scale: 1.02}}
                whileTap={{scale: 0.98}}
                transition={{duration: 0.25, ease: ANIMATION_EASE}}
                className="h-12 rounded-xl bg-brand-beige text-brand-black font-montserrat font-bold text-sm uppercase tracking-widest hover:bg-brand-beige-light transition-colors inline-flex items-center justify-center gap-2"
              >
                {leadMagnet.buttonLabel}
              </motion.button>
            </div>
          </div>
        </section>

        {/* ── 4 columnas ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-montserrat font-bold text-xs tracking-[0.3em] uppercase text-brand-beige mb-4">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="font-montserrat text-sm text-white/70 hover:text-brand-beige transition-colors tracking-wide"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Columna de contacto + socials */}
          <div className="col-span-2 lg:col-span-1">
            <p className="font-montserrat font-bold text-xs tracking-[0.3em] uppercase text-brand-beige mb-4">
              Contacto
            </p>
            <ul className="flex flex-col gap-2.5 mb-5">
              <li>
                <a
                  href="mailto:armandofresafit@gmail.com"
                  className="font-montserrat text-sm text-white/70 hover:text-brand-beige transition-colors break-all tracking-wide"
                >
                  armandofresafit@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/526623160125"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-montserrat text-sm text-white/70 hover:text-brand-beige transition-colors tracking-wide"
                >
                  WhatsApp directo
                </a>
              </li>
            </ul>

            <div className="flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/15 text-white/70 hover:text-brand-beige hover:border-brand-beige flex items-center justify-center transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Logo + trust badges ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-white/10">
          <div className="flex items-center gap-3">
            <img
              src="/images/logos/logo_dorado.png"
              alt="ArmandoFF"
              width={120}
              height={30}
              loading="lazy"
              className="object-contain"
            />
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUST_BADGES.map((badge) => (
              <li
                key={badge.label}
                className="flex items-center gap-2 font-montserrat text-xs text-white/60 tracking-wide"
              >
                <span className="text-brand-beige">{badge.icon}</span>
                {badge.label}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Pagos + copyright ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="font-montserrat text-[10px] uppercase tracking-widest text-white/40">
              Aceptamos:
            </span>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => (
                <span
                  key={m}
                  className="font-montserrat font-bold text-[10px] tracking-wide uppercase text-white/60 border border-white/15 rounded px-2 py-1"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          <p className="font-montserrat text-xs text-white/40 text-center tracking-wide">
            &copy; {new Date().getFullYear()} ArmandoFF. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
