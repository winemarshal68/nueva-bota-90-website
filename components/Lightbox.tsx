'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({ images, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:text-stone-300 transition-colors z-10"
        aria-label="Close"
      >
        <X size={32} />
      </button>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={onPrev}
          className="absolute left-4 p-2 text-white hover:text-stone-300 transition-colors z-10"
          aria-label="Previous"
        >
          <ChevronLeft size={40} />
        </button>
      )}

      {/* Image */}
      <div className="relative w-full h-full flex items-center justify-center p-16">
        <div className="relative max-w-7xl max-h-full w-full h-full">
          <Image
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
            quality={90}
          />
        </div>
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 p-2 text-white hover:text-stone-300 transition-colors z-10"
          aria-label="Next"
        >
          <ChevronRight size={40} />
        </button>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
