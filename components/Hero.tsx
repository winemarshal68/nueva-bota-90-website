'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { i18n } from '@/content/i18n';

export default function Hero() {
  const { language } = useLanguage();
  const t = i18n[language];

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Nueva Bota 90"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          {t.hero.title}
        </h1>
        <p className="text-xl sm:text-2xl mb-10 text-white/90 max-w-2xl mx-auto font-light">
          {t.hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={t.links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-stone-900 font-semibold rounded hover:bg-stone-100 transition-colors w-full sm:w-auto text-center"
          >
            {t.hero.ctaReserve}
          </a>
          <Link
            href="/menu"
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded hover:bg-white hover:text-stone-900 transition-colors w-full sm:w-auto text-center"
          >
            {t.hero.ctaMenu}
          </Link>
        </div>
      </div>
    </section>
  );
}
