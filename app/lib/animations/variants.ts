import type {Variants, Transition} from 'framer-motion';

// Easing suave tipo "ease-out" cúbico usado en todo el sistema
const EASE_OUT: Transition['ease'] = [0.22, 1, 0.36, 1];
const BASE_DURATION = 0.7;

// Aparición simple con fundido
export const fadeIn: Variants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {duration: BASE_DURATION, ease: EASE_OUT},
  },
};

// Desplazamiento desde abajo + fundido — uso principal para bloques de contenido
export const slideUp: Variants = {
  hidden: {opacity: 0, y: 40},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: BASE_DURATION, ease: EASE_OUT},
  },
};

// Desplazamiento desde la izquierda
export const slideInLeft: Variants = {
  hidden: {opacity: 0, x: -50},
  visible: {
    opacity: 1,
    x: 0,
    transition: {duration: BASE_DURATION, ease: EASE_OUT},
  },
};

// Desplazamiento desde la derecha
export const slideInRight: Variants = {
  hidden: {opacity: 0, x: 50},
  visible: {
    opacity: 1,
    x: 0,
    transition: {duration: BASE_DURATION, ease: EASE_OUT},
  },
};

// Escala suave — ideal para badges, cards y elementos pequeños
export const scaleIn: Variants = {
  hidden: {opacity: 0, scale: 0.92},
  visible: {
    opacity: 1,
    scale: 1,
    transition: {duration: 0.6, ease: EASE_OUT},
  },
};

// Contenedor para orquestar listas con efecto cascada
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Hijo estándar dentro de un staggerContainer
export const staggerItem: Variants = {
  hidden: {opacity: 0, y: 24},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.6, ease: EASE_OUT},
  },
};

export const ANIMATION_EASE = EASE_OUT;
export const ANIMATION_DURATION = BASE_DURATION;
