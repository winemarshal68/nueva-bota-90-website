'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { i18n } from '@/content/i18n';
import { MapPin, Clock, MessageCircle, Instagram } from 'lucide-react';

export default function ContactPage() {
  const { language } = useLanguage();
  const t = i18n[language];

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            {t.contactPage.title}
          </h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            {t.contactPage.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-xl text-stone-600 text-center mb-16 leading-relaxed">
            {t.contactPage.reserveText}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Location */}
            <div className="bg-stone-50 p-8 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <MapPin className="w-6 h-6 text-stone-900 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-serif font-bold text-stone-900 mb-3">
                    {t.info.locationTitle}
                  </h2>
                  <p className="text-stone-600 leading-relaxed mb-4">
                    {t.info.locationAddress}
                    <br />
                    {t.info.locationCity}
                  </p>
                  <a
                    href={t.links.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-stone-900 hover:text-stone-700 font-medium transition-colors"
                  >
                    {t.contactPage.ctaGoogleMaps} →
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-stone-50 p-8 rounded-lg">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-stone-900 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-serif font-bold text-stone-900 mb-3">
                    {t.info.hoursTitle}
                  </h2>
                  <p className="text-stone-600 leading-relaxed">
                    {t.info.hoursRestaurant}
                    <br />
                    {t.info.hoursKitchen}
                    <br />
                    <span className="text-stone-400 font-medium">{t.info.hoursClosed}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={t.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-stone-900 text-white font-semibold rounded hover:bg-stone-800 transition-colors w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              {t.contactPage.ctaWhatsApp}
            </a>
            <a
              href={t.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-stone-900 text-stone-900 font-semibold rounded hover:bg-stone-900 hover:text-white transition-colors w-full sm:w-auto justify-center"
            >
              <Instagram className="w-5 h-5" />
              {t.contactPage.ctaInstagram}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
