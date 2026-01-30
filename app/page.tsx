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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
            {t.about.heading}
          </h2>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
            {t.about.text}
          </p>
        </div>
      </section>

      {/* Gallery Preview */}
      <ImageStrip images={galleryImages} alt="Nueva Bota 90 interior" />

      {/* Info Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Location */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              {t.info.locationTitle}
            </h3>
            <p className="text-stone-600 leading-relaxed">
              {t.info.locationAddress}
              <br />
              {t.info.locationCity}
            </p>
            <a
              href={t.links.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-stone-900 hover:text-stone-700 font-medium transition-colors"
            >
              {t.contactPage.ctaGoogleMaps} →
            </a>
          </div>

          {/* Hours */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              {t.info.hoursTitle}
            </h3>
            <p className="text-stone-600 leading-relaxed">
              {t.info.hoursRestaurant}
              <br />
              {t.info.hoursKitchen}
              <br />
              <span className="text-stone-400">{t.info.hoursClosed}</span>
            </p>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              {t.info.contactTitle}
            </h3>
            <div className="space-y-3">
              <a
                href={t.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-stone-600 hover:text-stone-900 transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={t.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-stone-600 hover:text-stone-900 transition-colors"
              >
                Instagram
              </a>
              <Link
                href="/contacto"
                className="block text-stone-900 hover:text-stone-700 font-medium transition-colors"
              >
                {t.nav.contact} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
