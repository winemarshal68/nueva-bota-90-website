import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from '@/sanity/schema'
import { studioStructure } from '@/sanity/structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

if (!projectId) {
  throw new Error(
    'Missing required environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
  )
}

export default defineConfig({
  name: 'nueva-bota-90',
  title: 'Nueva Bota 90',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool({ structure: studioStructure }), visionTool()],
  schema,
})
