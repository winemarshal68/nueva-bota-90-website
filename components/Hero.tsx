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
        {/* Layered gradient overlay for sophisticated text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        {/* Focused darkening in the text region */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/30" />
      </div>

      {/* Content Container - Text-safe area */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        {/* Subtle glass panel behind text for premium look */}
        <div className="absolute inset-0 -mx-4 sm:-mx-6 bg-black/10 backdrop-blur-[2px] rounded-lg" />

        {/* Text Content */}
        <div className="relative">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-wide leading-tight">
            {t.hero.title}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-5 text-white/95 max-w-2xl mx-auto font-light leading-relaxed">
            {t.hero.subtitle}
          </p>
          <p className="text-sm sm:text-base mb-10 text-white/90 max-w-lg mx-auto italic font-light">
            {t.hero.walkInText}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={t.links.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 bg-white text-stone-900 font-medium rounded-md hover:bg-stone-50 transition-all duration-200 w-full sm:w-auto text-center shadow-xl hover:shadow-2xl"
            >
              {t.hero.ctaDirections}
            </a>
            <Link
              href="/menu"
              className="px-7 py-3.5 bg-transparent border border-white/90 text-white font-medium rounded-md hover:bg-white/10 hover:border-white transition-all duration-200 w-full sm:w-auto text-center backdrop-blur-sm"
            >
              {t.hero.ctaMenu}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile-specific object position adjustment */}
      <style jsx>{`
        @media (max-width: 640px) {
          .absolute.inset-0.z-0 img {
            object-position: 50% 30% !important;
          }
        }
      `}</style>
    </section>
  );
}
