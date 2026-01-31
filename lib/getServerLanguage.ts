/**
 * Language type matching the i18n content structure
 */
export type Language = 'es' | 'en';

/**
 * Extracts language from Next.js server component searchParams
 * Defaults to Spanish ('es') if not specified or invalid
 *
 * Usage in server components:
 * ```typescript
 * export default async function MyPage({
 *   searchParams
 * }: {
 *   searchParams: { lang?: string }
 * }) {
 *   const language = getServerLanguage(searchParams);
 *   // ... use language
 * }
 * ```
 */
export function getServerLanguage(searchParams: {
  lang?: string;
}): Language {
  const langParam = searchParams?.lang?.toLowerCase();

  if (langParam === 'en') {
    return 'en';
  }

  // Default to Spanish
  return 'es';
}
