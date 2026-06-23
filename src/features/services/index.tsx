import { getPayload } from 'payload'
import { getLocale } from 'next-intl/server'
import { Grid, GridItem } from '@/components/layout/grid'
import { AnimatedSection } from '@/components/ui/animated-section'
import { TransitionLink } from '@/components/layout/transition/TransitionLink'
import config from '@/payload.config'

export async function ServicesPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const locale = (await getLocale()) as 'en' | 'fr'
  const services = await payload.findGlobal({ slug: 'services', locale })

  const items = services.services ?? []
  const email = services.email ?? 'contact@clarabaptista.com'

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <Grid className="min-h-[70vh]">
        <GridItem
          span={'full'}
          className="flex flex-col justify-center pt-24 md:pt-0 md:col-start-2! md:col-end-11!"
        >
          <AnimatedSection y={20} duration={0.9} delay={0.3} mountOnly>
            <h1 className="font-satoshi font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl text-white">
              {services.heroHeading}
            </h1>
            {services.heroSubheading && (
              <p className="text-white text-[16px] md:text-[18px] font-normal leading-relaxed mt-8 max-w-2xl">
                {services.heroSubheading}
              </p>
            )}
            {services.intro && (
              <p className="text-white/80 text-[15px] md:text-[16px] font-normal leading-relaxed mt-6 max-w-2xl">
                {services.intro}
              </p>
            )}
          </AnimatedSection>
        </GridItem>
      </Grid>

      {/* ── Services list ────────────────────────────────────── */}
      <Grid className="py-16 md:py-24">
        <GridItem span={'full'} className="md:col-start-2! md:col-end-12!">
          <ul className="flex flex-col gap-12 md:gap-16">
            {items.map((service, i) => (
              <AnimatedSection key={i} y={20} duration={0.8} delay={0.1 * i} mountOnly>
                <li className="border-t border-white/15 pt-6">
                  <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
                    {service.title}
                  </h2>
                  {service.description && (
                    <p className="text-white/80 text-[15px] md:text-[16px] leading-relaxed mt-3 max-w-2xl">
                      {service.description}
                    </p>
                  )}
                </li>
              </AnimatedSection>
            ))}
          </ul>
        </GridItem>
      </Grid>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Grid className="pb-24 md:pb-32">
        <GridItem span={'full'} className="md:col-start-2! md:col-end-12!">
          <AnimatedSection y={20} duration={0.9} mountOnly>
            <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tight">
              {services.ctaHeading}
            </h2>
            <TransitionLink
              href={`mailto:${email}`}
              className="inline-block text-white underline underline-offset-4 text-[16px] md:text-[18px] mt-4"
            >
              {email}
            </TransitionLink>
          </AnimatedSection>
        </GridItem>
      </Grid>
    </>
  )
}
