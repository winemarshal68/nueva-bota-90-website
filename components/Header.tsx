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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif font-bold text-stone-900 hover:text-stone-700 transition-colors">
            Nueva Bota 90
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-stone-700 hover:text-stone-900 transition-colors font-medium">
              {t.nav.home}
            </Link>
            <Link href="/menu" className="text-stone-700 hover:text-stone-900 transition-colors font-medium">
              {t.nav.menu}
            </Link>
            <Link href="/vinos" className="text-stone-700 hover:text-stone-900 transition-colors font-medium">
              {t.nav.wines}
            </Link>
            <Link href="/contacto" className="text-stone-700 hover:text-stone-900 transition-colors font-medium">
              {t.nav.contact}
            </Link>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded hover:border-stone-400 transition-colors"
            >
              {language === 'es' ? 'EN' : 'ES'}
            </button>

            {/* CTA Button */}
            <a
              href={t.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-stone-900 text-white font-medium rounded hover:bg-stone-800 transition-colors"
            >
              {t.hero.ctaReserve}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-stone-700 hover:text-stone-900 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.home}
              </Link>
              <Link
                href="/menu"
                className="text-stone-700 hover:text-stone-900 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.menu}
              </Link>
              <Link
                href="/vinos"
                className="text-stone-700 hover:text-stone-900 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.wines}
              </Link>
              <Link
                href="/contacto"
                className="text-stone-700 hover:text-stone-900 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.contact}
              </Link>
              <button
                onClick={toggleLanguage}
                className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded hover:border-stone-400 transition-colors text-left"
              >
                {language === 'es' ? 'EN' : 'ES'}
              </button>
              <a
                href={t.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-stone-900 text-white font-medium rounded hover:bg-stone-800 transition-colors text-center"
              >
                {t.hero.ctaReserve}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
