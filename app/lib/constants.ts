// Constantes globales de la app. Por ahora solo NAV_LINKS — el resto
// (TESTIMONIALS, STATS, PILLARS, COUNTRIES, etc.) se portará junto con los
// componentes que los consumen, en Fase 6.

export type NavChild = {label: string; href: string};
export type NavLink = {
  label: string;
  href?: string;
  children?: ReadonlyArray<NavChild>;
};

export const NAV_LINKS: ReadonlyArray<NavLink> = [
  {
    label: 'El Sistema',
    children: [
      {label: 'Empezar', href: '/empezar'},
      {label: 'Sistema 360', href: '/sistema-360'},
      {label: 'Método', href: '/metodo'},
      {label: 'CRMs', href: '/crms'},
    ],
  },
  {
    label: 'Recursos',
    children: [
      {label: 'Contenido', href: '/contenido'},
      {label: 'Casos de estudio', href: '/casos-de-estudio'},
      {label: 'Webinars', href: '/webinars'},
    ],
  },
  {label: 'Reseñas', href: '/#testimonios'},
  {label: 'Nosotros', href: '/#quien-soy'},
  {
    label: 'Legal',
    children: [
      {label: 'Aviso legal', href: '/aviso-legal'},
      {label: 'Privacidad', href: '/privacidad'},
      {label: 'Términos', href: '/terminos'},
      {label: 'Cookies', href: '/cookies'},
    ],
  },
];
