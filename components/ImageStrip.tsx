import Image from 'next/image';

interface ImageStripProps {
  images: string[];
  alt?: string;
}

export default function ImageStrip({ images, alt = 'Gallery image' }: ImageStripProps) {
  return (
    <section className="py-0 overflow-hidden bg-stone-100">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5">
          {images.map((src, index) => (
            <div key={index} className="relative aspect-square overflow-hidden bg-stone-200 group">
              <Image
                src={src}
                alt={`${alt} ${index + 1}`}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
