import { getPayload } from 'payload'
import { getLocale } from 'next-intl/server'
import config from '@/payload.config'
import { HomePage } from './index-page'

export async function HomePageWrapper() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const locale = (await getLocale()) as 'en' | 'fr'
  const categories = await payload.find({
    collection: 'categories',
    locale,
    populate: {
      projects: {
        image: true,
      },
    },
    limit: 0,
  })

  const categoriesList = categories.docs || []
  const projectsList = categoriesList
    .flatMap((c) => c.showcasedProjects || [])
    .filter((p) => typeof p !== 'number')

  return <HomePage projectsList={projectsList} />
}
