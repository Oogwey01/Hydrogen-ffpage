import type {Variants} from 'framer-motion';
import {ANIMATION_DURATION, ANIMATION_EASE} from '~/lib/animations/variants';

// Calcula el delay escalonado para un índice dado dentro de una lista
export function getStaggerDelay(
  index: number,
  step = 0.12,
  initial = 0,
): number {
  return initial + index * step;
}

// Genera un transition con delay personalizado — útil para animar items sueltos sin container
export function withDelay(delay: number, duration: number = ANIMATION_DURATION) {
  return {
    duration,
    delay,
    ease: ANIMATION_EASE,
  };
}

// Devuelve una de dos variantes según una condición — útil para direcciones alternadas
export function conditionalVariant(
  condition: boolean,
  whenTrue: Variants,
  whenFalse: Variants,
): Variants {
  return condition ? whenTrue : whenFalse;
}

// Clona una variante y le inyecta un delay en el estado "visible"
export function withVariantDelay(variant: Variants, delay: number): Variants {
  const visible = variant.visible;
  if (typeof visible !== 'object' || visible === null) return variant;

  const currentTransition =
    'transition' in visible && typeof visible.transition === 'object'
      ? visible.transition
      : {};

  return {
    ...variant,
    visible: {
      ...visible,
      transition: {...currentTransition, delay},
    },
  };
}
