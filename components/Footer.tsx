'use client';

import { MapPin, Clock, Instagram, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { i18n } from '@/content/i18n';

export default function Footer() {
  const { language } = useLanguage();
  const t = i18n[language];

  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Location */}
          <div>
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-stone-400" />
              <div>
                <h3 className="font-semibold text-lg mb-2">{t.info.locationTitle}</h3>
                <p className="text-stone-300 leading-relaxed">
                  {t.info.locationAddress}
                  <br />
                  {t.info.locationCity}
                </p>
                <a
                  href={t.links.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-stone-400 hover:text-white transition-colors"
                >
                  {t.contactPage.ctaGoogleMaps} →
                </a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <div className="flex items-start gap-3 mb-3">
              <Clock className="w-5 h-5 mt-1 flex-shrink-0 text-stone-400" />
              <div>
                <h3 className="font-semibold text-lg mb-2">{t.info.hoursTitle}</h3>
                <p className="text-stone-300 leading-relaxed">
                  {t.info.hoursRestaurant}
                  <br />
                  {t.info.hoursKitchen}
                  <br />
                  <span className="text-stone-400">{t.info.hoursClosed}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.info.contactTitle}</h3>
            <div className="flex gap-4">
              <a
                href={t.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={t.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-stone-400 text-sm">{t.footer.rights}</p>
            <div className="text-2xl font-serif font-bold">Nueva Bota 90</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
