import {useState, useCallback, useEffect} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {CloseIcon, ChevronDownIcon} from '~/components/common/Icons';
import {NAV_LINKS} from '~/lib/constants';

interface HeaderProps {
  onOpenForm: () => void;
  // Override opcional del CTA — si se provee, renderiza un link en lugar del botón "Agendar Cita"
  cta?: {
    label: string;
    href: string;
  };
}

export default function Header({onOpenForm, cta}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setExpandedMobile(null);
  }, []);

  const toggleMobileSection = useCallback((label: string) => {
    setExpandedMobile((prev) => (prev === label ? null : label));
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Detecta scroll para reducir altura del header y elevar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6">
        <div
          className={`mx-auto max-w-6xl backdrop-blur-xl border rounded-2xl transition-all duration-300 ${
            isScrolled
              ? 'bg-brand-black/70 border-white/15 shadow-2xl shadow-black/40 mt-3 mb-2'
              : 'bg-white/10 border-white/20 shadow-lg shadow-black/10 mt-6 mb-4'
          }`}
        >
          <div
            className={`flex items-center px-4 sm:px-8 gap-3 transition-[height] duration-300 ${
              isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
            }`}
          >
            {/* LEFT: Hamburger animado (mobile only) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white lg:hidden flex-shrink-0 relative w-6 h-6"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMobileMenuOpen}
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[7px] w-6 h-0.5 bg-current rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 top-[11px]' : ''
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[11px] w-6 h-0.5 bg-current rounded-full transition-opacity duration-200 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[15px] w-6 h-0.5 bg-current rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 top-[11px]' : ''
                }`}
              />
            </button>

            {/* Logo */}
            <div className="flex justify-center lg:justify-start flex-1 lg:flex-initial">
              <a href="/" className="flex-shrink-0">
                <img
                  src="/images/logos/logo_dorado.png"
                  alt="Logo"
                  height={40}
                  width={160}
                  loading="eager"
                  className={`object-contain transition-all duration-300 ${
                    isScrolled
                      ? 'w-[95px] sm:w-[140px] opacity-90'
                      : 'w-[110px] sm:w-[160px] opacity-100'
                  }`}
                />
              </a>
            </div>

            {/* Desktop Navigation — centered via flex-1 */}
            <nav className="hidden items-center justify-center gap-7 xl:gap-9 lg:flex lg:flex-1">
              {NAV_LINKS.map((link) => {
                const hasChildren = link.children && link.children.length > 0;
                const isOpen = openDropdown === link.label;

                if (!hasChildren) {
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm font-bold text-white/90 transition-colors duration-200 hover:text-brand-beige whitespace-nowrap"
                    >
                      {link.label}
                    </a>
                  );
                }

                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() =>
                      setOpenDropdown((cur) => (cur === link.label ? null : cur))
                    }
                  >
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 text-sm font-bold transition-colors duration-200 whitespace-nowrap ${
                        isOpen
                          ? 'text-brand-beige'
                          : 'text-white/90 hover:text-brand-beige'
                      }`}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                    >
                      {link.label}
                      <ChevronDownIcon
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{opacity: 0, y: -6}}
                          animate={{opacity: 1, y: 0}}
                          exit={{opacity: 0, y: -6}}
                          transition={{duration: 0.15, ease: 'easeOut'}}
                          className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
                        >
                          <div className="min-w-[210px] rounded-2xl border border-white/10 bg-brand-black/90 backdrop-blur-xl shadow-2xl shadow-black/40 p-2">
                            {link.children!.map((child) => (
                              <a
                                key={child.href}
                                href={child.href}
                                className="block rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/85 transition-colors duration-150 hover:bg-white/5 hover:text-brand-beige"
                              >
                                {child.label}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* RIGHT: CTA — compact on mobile, full on desktop */}
            {cta ? (
              <a
                href={cta.href}
                className="flex-shrink-0 flex items-center rounded-xl bg-[#C89D69] text-black font-bold uppercase transition-colors duration-200 hover:bg-[#B08A55]
                           px-3 py-2 text-xs lg:px-8 lg:py-2.5 lg:text-base"
              >
                {cta.label}
              </a>
            ) : (
              <button
                onClick={onOpenForm}
                className="flex-shrink-0 flex items-center gap-1.5 rounded-xl bg-[#C89D69] text-black font-bold uppercase transition-colors duration-200 hover:bg-[#B08A55]
                           px-3 py-2 text-xs lg:px-8 lg:py-2.5 lg:text-base"
              >
                <span>Agendar Cita</span>
                <span className="text-[9px] lg:text-[10px] font-bold opacity-75 tracking-widest">
                  GRATIS
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu — Left Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.3}}
              onClick={closeMobileMenu}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{x: '-100%'}}
              animate={{x: 0}}
              exit={{x: '-100%'}}
              transition={{type: 'tween', duration: 0.3, ease: 'easeInOut'}}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col bg-brand-black lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex h-20 items-center justify-between px-6 border-b border-white/10">
                <a href="#inicio" onClick={closeMobileMenu} className="flex-shrink-0">
                  <img
                    src="/images/logos/logo_dorado.png"
                    alt="Logo"
                    height={32}
                    width={120}
                    loading="eager"
                    className="object-contain"
                  />
                </a>
                <button
                  onClick={closeMobileMenu}
                  className="text-white"
                  aria-label="Cerrar menú"
                >
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex flex-col gap-1 px-4 pt-6 overflow-y-auto">
                {NAV_LINKS.map((link, index) => {
                  const hasChildren = link.children && link.children.length > 0;
                  const isExpanded = expandedMobile === link.label;

                  if (!hasChildren) {
                    return (
                      <motion.a
                        key={link.label}
                        href={link.href}
                        onClick={closeMobileMenu}
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.1 + index * 0.05}}
                        className="font-barlow font-bold text-lg text-white py-3 px-2 rounded-lg hover:bg-white/10 hover:text-brand-beige transition-colors duration-200"
                      >
                        {link.label}
                      </motion.a>
                    );
                  }

                  return (
                    <motion.div
                      key={link.label}
                      initial={{opacity: 0, x: -20}}
                      animate={{opacity: 1, x: 0}}
                      transition={{delay: 0.1 + index * 0.05}}
                    >
                      <button
                        type="button"
                        onClick={() => toggleMobileSection(link.label)}
                        className="w-full flex items-center justify-between font-barlow font-bold text-lg text-white py-3 px-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                        aria-expanded={isExpanded}
                      >
                        <span>{link.label}</span>
                        <ChevronDownIcon
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-brand-beige' : 'text-white/60'
                          }`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            key="section"
                            initial={{height: 0, opacity: 0}}
                            animate={{height: 'auto', opacity: 1}}
                            exit={{height: 0, opacity: 0}}
                            transition={{duration: 0.2, ease: 'easeOut'}}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-0.5 pl-4 pt-1 pb-2 border-l border-white/10 ml-3">
                              {link.children!.map((child) => (
                                <a
                                  key={child.href}
                                  href={child.href}
                                  onClick={closeMobileMenu}
                                  className="font-montserrat font-medium text-sm text-white/80 py-2 px-3 rounded-md hover:bg-white/5 hover:text-brand-beige transition-colors duration-200"
                                >
                                  {child.label}
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Drawer CTA */}
              <div className="px-6 mt-auto pb-10">
                {cta ? (
                  <motion.a
                    href={cta.href}
                    onClick={closeMobileMenu}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.1 + NAV_LINKS.length * 0.05}}
                    className="w-full flex items-center justify-center rounded-xl bg-brand-beige px-6 py-3 text-sm font-bold text-brand-black hover:bg-brand-beige-light transition-colors duration-200"
                  >
                    {cta.label}
                  </motion.a>
                ) : (
                  <motion.button
                    onClick={() => {
                      closeMobileMenu();
                      onOpenForm();
                    }}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.1 + NAV_LINKS.length * 0.05}}
                    className="w-full flex flex-col items-center rounded-xl bg-brand-beige px-6 py-3 text-sm font-bold text-brand-black hover:bg-brand-beige-light transition-colors duration-200"
                  >
                    <span>Agendar Cita</span>
                    <span className="text-[10px] font-normal opacity-60 leading-tight tracking-widest">
                      GRATIS
                    </span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
