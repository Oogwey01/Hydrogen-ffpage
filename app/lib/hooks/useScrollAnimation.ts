import {useEffect, useRef, useState} from 'react';

// Opciones para configurar el trigger de animación al hacer scroll
export interface UseScrollAnimationOptions {
  // Porcentaje de visibilidad necesario para disparar (0-1)
  threshold?: number;
  // Margen adicional alrededor del viewport (formato rootMargin de IntersectionObserver)
  rootMargin?: string;
  // Retardo en ms antes de marcar como visible (útil para stagger)
  delay?: number;
  // Si es true, la animación se ejecuta una sola vez
  triggerOnce?: boolean;
}

export interface UseScrollAnimationReturn<T extends Element> {
  ref: React.RefObject<T | null>;
  isVisible: boolean;
}

// Detecta cuándo un elemento entra al viewport para disparar animaciones
export function useScrollAnimation<T extends Element = HTMLDivElement>(
  options: UseScrollAnimationOptions = {},
): UseScrollAnimationReturn<T> {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    delay = 0,
    triggerOnce = true,
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => setIsVisible(true), delay);
          if (triggerOnce) observer.unobserve(node);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {threshold, rootMargin},
    );

    observer.observe(node);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [threshold, rootMargin, delay, triggerOnce]);

  return {ref, isVisible};
}
