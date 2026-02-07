'use client'

import Image from 'next/image'
import { useLanguage } from '@/hooks/useLanguage'
import { allergenIconPath } from '@/sanity/lib/allergenIcons'

export interface AllergenBadge {
  slug: string
  title_en: string
  title_es: string
}

interface AllergenIconsProps {
  allergens: AllergenBadge[]
}

export default function AllergenIcons({ allergens }: AllergenIconsProps) {
  const { language } = useLanguage()

  if (!allergens || allergens.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {allergens.map((a) => (
        <Image
          key={a.slug}
          src={allergenIconPath(a.slug)}
          alt={language === 'es' ? a.title_es : a.title_en}
          title={language === 'es' ? a.title_es : a.title_en}
          width={28}
          height={28}
          className="inline-block"
        />
      ))}
    </div>
  )
}
