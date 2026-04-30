import {motion, useScroll, useSpring} from 'framer-motion';

// Barra de progreso fixed en el top — tracks scroll vertical 0-100%
export function ScrollProgress() {
  const {scrollYProgress} = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    mass: 0.2,
  });

  return (
    <motion.div
      style={{scaleX}}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brand-beige-dark via-brand-beige to-brand-beige-light"
    />
  );
}
