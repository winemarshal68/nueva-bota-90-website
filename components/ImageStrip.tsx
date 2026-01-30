import Image from 'next/image';

interface ImageStripProps {
  images: string[];
  alt?: string;
}

export default function ImageStrip({ images, alt = 'Gallery image' }: ImageStripProps) {
  return (
    <section className="py-0 overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {images.map((src, index) => (
          <div key={index} className="relative aspect-square overflow-hidden">
            <Image
              src={src}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
