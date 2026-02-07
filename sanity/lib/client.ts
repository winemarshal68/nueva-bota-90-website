import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-01-01'

if (!projectId) {
  throw new Error(
    'Missing required environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
  )
}

/** Public read-only client (no token, safe for browser/server components) */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
