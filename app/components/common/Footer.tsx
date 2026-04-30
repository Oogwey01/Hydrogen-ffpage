import {
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  EmailIcon,
  PhoneIcon,
} from '~/components/common/Icons';

const FOOTER_LINKS = [
  {label: 'Inicio', href: '#inicio'},
  {label: 'Servicios', href: '#proximos-servicios'},
  {label: 'Historia', href: '#quien-soy'},
  {label: 'Contacto', href: '#contacto'},
] as const;

const SOCIAL_LINKS = [
  {label: 'Instagram', href: 'https://www.instagram.com/fresafitt/', icon: InstagramIcon},
  {label: 'TikTok', href: 'https://www.tiktok.com/@fresafit', icon: TikTokIcon},
  {label: 'YouTube', href: 'https://www.youtube.com/@fresafit', icon: YouTubeIcon},
] as const;

export default function Footer() {
  return (
    <footer className="bg-brand-gray">
      {/* Top border */}
      <div className="h-px w-full bg-brand-beige/30" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Logo circle */}
        <div className="flex justify-center pt-10 pb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-beige">
            <span className="font-akira text-lg text-brand-beige">AF</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="pb-8">
          <ul className="grid grid-cols-2 gap-3 text-center sm:flex sm:flex-row sm:justify-center sm:gap-8">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-white/70 transition-colors duration-200 hover:text-brand-beige"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social icons */}
        <div className="flex justify-center gap-6 pb-8">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-white/60 transition-colors duration-200 hover:text-brand-beige"
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        {/* Contact info */}
        <div className="flex flex-col items-center gap-4 pb-8 sm:flex-row sm:justify-center sm:gap-8">
          <a
            href="mailto:armandofresafit@gmail.com"
            className="flex items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-brand-beige"
          >
            <EmailIcon className="h-4 w-4" />
            <span>armandofresafit@gmail.com</span>
          </a>
          <a
            href="tel:+52XXXXXXXX"
            className="flex items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-brand-beige"
          >
            <PhoneIcon className="h-4 w-4" />
            <span>+52 XXX XXX XXXX</span>
          </a>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/10" />

        {/* Copyright */}
        <div className="py-6 text-center">
          <p className="text-xs text-white/40">
            &copy; 2026 Armando FresaFit. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
