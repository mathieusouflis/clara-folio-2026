import Image from 'next/image'
import { getPayload } from 'payload'
import { Grid, GridItem } from '@/components/layout/grid'
import { AnimatedSection } from '@/components/ui/animated-section'
import config from '@/payload.config'

export async function AboutPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const aboutGlobal = await payload.findGlobal({ slug: 'about' })

  const experiences = aboutGlobal.experiences
  const education = aboutGlobal.education
  const hardSkillsCategories = aboutGlobal.hardSkillsCategories
  const softSkills = aboutGlobal.softSkills
  const languages = aboutGlobal.languages

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <Grid className="min-h-screen">
        {/* Image : à gauche sur desktop, pleine largeur sur mobile */}
        <GridItem
          span={'full'}
          className="flex flex-col justify-center pt-20 md:pt-0 md:col-start-2! md:col-end-6!"
        >
          <AnimatedSection x={-30} y={0} duration={1} delay={0.3} mountOnly>
            <Image
              className="h-auto aspect-5/6 w-full max-h-[70vh] md:max-h-none object-cover"
              src={typeof aboutGlobal.image === 'number' ? '' : (aboutGlobal.image.url ?? '')}
              alt={typeof aboutGlobal.image === 'number' ? '' : aboutGlobal.image.alt}
              width={1920}
              height={1080}
            />
          </AnimatedSection>
        </GridItem>

        {/* Texte : à droite sur desktop, sous l'image sur mobile */}
        <GridItem
          span={'full'}
          className="flex flex-col gap-8 md:gap-16 justify-start py-8 md:py-0 md:col-start-6! md:col-end-12! md:justify-center"
        >
          <AnimatedSection y={20} duration={0.9} delay={0.5} mountOnly>
            <h1 className="font-aston-script text-5xl md:text-6xl lg:text-7xl text-white md:whitespace-nowrap">
              {aboutGlobal.name}
            </h1>
            {aboutGlobal.description && (
              <div className="flex flex-col gap-1 mt-8 md:mt-16">
                <h2 className="text-white text-[14px] md:text-[16px] font-bold uppercase tracking-wider">
                  Who ?
                </h2>
                <p className="text-white text-[15px] md:text-[16px] font-normal leading-relaxed">
                  {aboutGlobal.description}
                </p>
              </div>
            )}
          </AnimatedSection>
        </GridItem>
      </Grid>

      {/* ── Sections de données ──────────────────────────────── */}
      {(experiences?.length ||
        education?.length ||
        hardSkillsCategories?.length ||
        softSkills?.length ||
        languages?.length) ? (
        <Grid className="gap-y-20! md:gap-y-28! mt-16 md:mt-0 mb-16">

          {experiences && experiences.length !== 0 && (
            <GridItem start={2} end={12} span={'full'} className="flex flex-col gap-3">
              <AnimatedSection selector=":scope > *" stagger={0.06} y={15} duration={0.7}>
                <h2 className="text-white text-[13px] md:text-[16px] font-bold uppercase tracking-wider mb-2">
                  Experiences
                </h2>
                <div className="flex flex-col divide-y divide-white/10">
                  {experiences.map((exp, idx) => (
                    <div key={`exp-${idx}`} className="flex flex-wrap gap-x-6 gap-y-0.5 py-2 text-white text-[14px] md:text-[16px]">
                      <span className="shrink-0 opacity-60 tabular-nums w-28">
                        {exp.startYear} / {exp.endYear || 'now'}
                      </span>
                      <span className="shrink-0 font-medium min-w-[120px]">{exp.enterpriseName}</span>
                      <span className="flex-1 min-w-[140px]">{exp.jobPost}</span>
                      <span className="shrink-0 opacity-60 text-right">{exp.jobType}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </GridItem>
          )}

          {education && education.length !== 0 && (
            <GridItem start={2} end={12} span={'full'} className="md:col-start-7! flex flex-col gap-3">
              <AnimatedSection selector=":scope > *" stagger={0.06} y={15} duration={0.7}>
                <h2 className="text-white text-[13px] md:text-[16px] font-bold uppercase tracking-wider mb-2">
                  Education
                </h2>
                <div className="flex flex-col divide-y divide-white/10">
                  {education
                    .sort((a, b) => {
                      if (!a.endYear) return 1
                      if (!b.endYear) return -1
                      return b.endYear - a.endYear
                    })
                    .map((edu, idx) => (
                      <div key={`edu-${idx}`} className="flex flex-wrap gap-x-6 gap-y-0.5 py-2 text-white text-[14px] md:text-[16px]">
                        <span className="shrink-0 opacity-60 tabular-nums w-28">
                          {edu.startYear} / {edu.endYear || 'now'}
                        </span>
                        <span className="flex-1 min-w-[120px]">{edu.schoolType}</span>
                        <span className="shrink-0 opacity-60 text-right">{edu.schoolName}</span>
                      </div>
                    ))}
                </div>
              </AnimatedSection>
            </GridItem>
          )}

          {hardSkillsCategories && hardSkillsCategories.length !== 0 && (
            <GridItem start={2} end={12} span={'full'} className="flex flex-col gap-3">
              <AnimatedSection selector=":scope > *" stagger={0.06} y={15} duration={0.7}>
                <h2 className="text-white text-[13px] md:text-[16px] font-bold uppercase tracking-wider mb-2">
                  Hard skills
                </h2>
                <div className="flex flex-col divide-y divide-white/10">
                  {hardSkillsCategories.map((cat, idx) => (
                    <div key={`cat-${idx}`} className="flex flex-wrap gap-x-6 py-2 text-white text-[14px] md:text-[16px]">
                      <span className="shrink-0 font-medium w-28 md:w-36">{cat.categoryName}</span>
                      <span className="flex-1 opacity-80">{cat.hardSkills?.map((s) => s.name).join(', ')}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </GridItem>
          )}

          {softSkills && softSkills.length !== 0 && (
            <GridItem start={2} end={12} span={'full'} className="md:col-start-7! flex flex-col gap-3">
              <AnimatedSection selector=":scope > *" stagger={0.06} y={15} duration={0.7}>
                <h2 className="text-white text-[13px] md:text-[16px] font-bold uppercase tracking-wider mb-2">
                  Soft skills
                </h2>
                <div className="flex flex-col divide-y divide-white/10">
                  {softSkills.map((skill, idx) => (
                    <div key={`soft-${idx}`} className="flex justify-between gap-4 py-2 text-white text-[14px] md:text-[16px]">
                      <span>{skill.name}</span>
                      <span className="opacity-60 text-right">{skill.description}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </GridItem>
          )}

          {languages && languages.length !== 0 && (
            <GridItem start={2} end={12} span={'full'} className="flex flex-col gap-3">
              <AnimatedSection selector=":scope > *" stagger={0.06} y={15} duration={0.7}>
                <h2 className="text-white text-[13px] md:text-[16px] font-bold uppercase tracking-wider mb-2">
                  Languages
                </h2>
                <div className="flex flex-col divide-y divide-white/10">
                  {languages.map((lang, idx) => (
                    <div key={`lang-${idx}`} className="flex justify-between gap-4 py-2 text-white text-[14px] md:text-[16px]">
                      <span className="font-medium">{lang.name}</span>
                      <span className="opacity-70">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </GridItem>
          )}
        </Grid>
      ) : null}
    </>
  )
}
