import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { translateTexts } from '@/lib/deepl/translate'

/**
 * One-off script: rebuild the French locale of every project from its English
 * source via DeepL, preserving array row IDs so content lands in the right place.
 *
 * - The project title (`name`) is intentionally kept as the English version.
 * - `description`, content section titles, and content descriptions are translated.
 *
 * Run with: pnpm payload run src/scripts/retranslate-projects-fr.ts
 */
async function main() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'projects',
    locale: 'en',
    depth: 0,
    limit: 1000,
    pagination: false,
  })

  console.log(`Found ${docs.length} project(s) to re-translate.\n`)

  for (const doc of docs) {
    const label = `[${doc.id}] ${doc.name ?? '(no name)'}`
    try {
      const content = (doc.content ?? []) as any[]

      // Collect every translatable string in a stable order.
      const texts: string[] = []
      texts.push(doc.description ?? '')
      for (const section of content) {
        texts.push(section.title ?? '')
        for (const d of section.contentDescription ?? []) {
          texts.push(d.text ?? '')
        }
      }

      const translated = await translateTexts(texts, 'FR')

      // Re-distribute translations in the same order, preserving row IDs.
      let idx = 0
      const frDescription = translated[idx++]
      const frContent = content.map((section) => ({
        ...section,
        title: translated[idx++],
        contentDescription: (section.contentDescription ?? []).map((d: any) => ({
          ...d,
          text: translated[idx++],
        })),
      }))

      await payload.update({
        collection: 'projects',
        id: doc.id,
        locale: 'fr',
        data: {
          // Keep the title as the English version.
          name: doc.name,
          description: frDescription,
          content: frContent,
        },
      })

      console.log(`✓ ${label}`)
    } catch (err) {
      console.error(`✗ ${label}`)
      console.error(err)
    }
  }

  console.log('\nDone.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
