import { getPayload } from 'payload'
import config from '@/payload.config'
import { FooterClient } from './footer-client'

export async function Footer() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const footerGlobal = await payload.findGlobal({ slug: 'footer' })

  return <FooterClient socialLinks={footerGlobal.socialLinks ?? []} />
}
