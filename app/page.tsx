'use client';

import Hero from '@/components/Hero';
import ImageStrip from '@/components/ImageStrip';
import { useLanguage } from '@/hooks/useLanguage';
import { i18n } from '@/content/i18n';
import Link from 'next/link';
import galleryManifestData from '@/content/images.json';
import type { ImageManifest } from '@/types/images';

export default function Home() {
  const { language } = useLanguage();
  const t = i18n[language];

  // Type cast the imported JSON
  const galleryManifest = galleryManifestData as ImageManifest;

  // Use first 12 images from manifest, or fallback to Unsplash placeholders
  const galleryImages = galleryManifest.length > 0
    ? galleryManifest.slice(0, 12).map(img => img.src)
    : [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=800&fit=crop',
      ];

  return (
    <>
      <Hero />

      {/* About Section */}
      <section className="px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-stone-900 mb-5">
            {t.about.heading}
          </h2>
          <p className="text-lg text-stone-700 leading-relaxed max-w-2xl mx-auto mb-10 font-light">
            {t.about.text}
          </p>
          <Link
            href="/menu"
            className="inline-block px-7 py-3 bg-stone-900 text-white text-sm font-medium rounded-sm hover:bg-stone-800 transition-all duration-200 tracking-wide"
          >
            {t.hero.ctaMenu}
          </Link>
        </div>
      </section>

      {/* Gallery Preview */}
      <ImageStrip images={galleryImages} alt="Nueva Bota 90 interior" />
    </>
  );
}
