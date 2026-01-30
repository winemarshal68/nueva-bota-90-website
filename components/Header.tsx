'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { i18n } from '@/content/i18n';

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const t = i18n[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-b border-stone-200/60">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-24">
          {/* Wordmark */}
          <Link href="/" className="group flex items-baseline gap-2 hover:opacity-80 transition-opacity">
            <span className="font-serif text-xl tracking-[0.15em] uppercase text-stone-900 font-medium">
              Nueva Bota
            </span>
            <span className="inline-flex items-center justify-center w-9 h-5 bg-stone-900 text-white text-[10px] font-bold tracking-wider rounded-sm">
              90
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-normal tracking-wide">
              {t.nav.home}
            </Link>
            <Link href="/menu" className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-normal tracking-wide">
              {t.nav.menu}
            </Link>
            <Link href="/vinos" className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-normal tracking-wide">
              {t.nav.wines}
            </Link>
            <Link href="/galeria" className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-normal tracking-wide">
              {t.nav.gallery}
            </Link>
            <Link href="/contacto" className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-normal tracking-wide">
              {t.nav.contact}
            </Link>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300/60 rounded-sm hover:border-stone-400 transition-all tracking-wider"
            >
              {language === 'es' ? 'EN' : 'ES'}
            </button>

            {/* WhatsApp Link (elegant) */}
            <a
              href={t.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded-sm hover:bg-stone-800 transition-colors tracking-wide"
            >
              WhatsApp
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-stone-700 hover:text-stone-900 transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-stone-200/60">
            <div className="flex flex-col gap-5">
              <Link
                href="/"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-normal py-1 tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.home}
              </Link>
              <Link
                href="/menu"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-normal py-1 tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.menu}
              </Link>
              <Link
                href="/vinos"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-normal py-1 tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.wines}
              </Link>
              <Link
                href="/galeria"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-normal py-1 tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.gallery}
              </Link>
              <Link
                href="/contacto"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-normal py-1 tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.contact}
              </Link>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300/60 rounded-sm hover:border-stone-400 transition-all tracking-wider"
                >
                  {language === 'es' ? 'EN' : 'ES'}
                </button>
                <a
                  href={t.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-stone-900 rounded-sm hover:bg-stone-800 transition-colors tracking-wide"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
