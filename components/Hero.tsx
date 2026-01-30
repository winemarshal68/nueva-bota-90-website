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
          style={{
            objectPosition: '50% 35%'
          }}
          priority
          quality={90}
          sizes="100vw"
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
          {t.hero.title}
        </h1>
        <p className="text-xl sm:text-2xl mb-6 text-white/95 max-w-2xl mx-auto font-light drop-shadow-md">
          {t.hero.subtitle}
        </p>
        <p className="text-sm sm:text-base mb-10 text-white/85 max-w-xl mx-auto italic">
          {t.hero.walkInText}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={t.links.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-stone-900 font-semibold rounded hover:bg-stone-100 transition-colors w-full sm:w-auto text-center shadow-lg"
          >
            {t.hero.ctaDirections}
          </a>
          <Link
            href="/menu"
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded hover:bg-white hover:text-stone-900 transition-colors w-full sm:w-auto text-center shadow-lg"
          >
            {t.hero.ctaMenu}
          </Link>
        </div>
      </div>

      {/* Mobile-specific object position adjustment */}
      <style jsx>{`
        @media (max-width: 640px) {
          .absolute.inset-0.z-0 img {
            object-position: 50% 25% !important;
          }
        }
      `}</style>
    </section>
  );
}
