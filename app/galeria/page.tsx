'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { i18n } from '@/content/i18n';
import Lightbox from '@/components/Lightbox';
import galleryManifestData from '@/content/images.json';
import type { ImageManifest } from '@/types/images';

export default function GalleryPage() {
  const { language } = useLanguage();
  const t = i18n[language];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Type cast the imported JSON
  const galleryManifest = galleryManifestData as ImageManifest;

  // Use manifest images or fallback to placeholders
  const images = galleryManifest.length > 0
    ? galleryManifest.map(img => img.src)
    : [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=800&fit=crop',
      ];

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            {t.galleryPage.title}
          </h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            {t.galleryPage.subtitle}
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {images.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-stone-600">
                No hay fotos disponibles. Agrega fotos a public/images/nueva-bota-90/
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((src, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
                >
                  <Image
                    src={src}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
}
