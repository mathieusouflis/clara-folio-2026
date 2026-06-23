import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

// Locale-aware default so the page ships with real bilingual draft copy on first
// load (dev push / migrate). Clara edits everything in the admin afterwards.
const byLocale =
  (en: string, fr: string) =>
  ({ locale }: { locale?: string }) =>
    locale === 'fr' ? fr : en

export const Services: GlobalConfig = {
  slug: 'services',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        revalidatePath('/services')
        revalidatePath('/fr/services')
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'heroHeading',
      type: 'text',
      localized: true,
      defaultValue: byLocale(
        'Freelance Graphic Designer in Paris',
        'Graphiste freelance à Paris',
      ),
    },
    {
      name: 'heroSubheading',
      type: 'textarea',
      localized: true,
      defaultValue: byLocale(
        'Branding, visual identity, and print design for brands that want to stand out.',
        "Branding, identité visuelle et design print pour les marques qui veulent se démarquer.",
      ),
    },
    {
      name: 'intro',
      type: 'textarea',
      localized: true,
      defaultValue: byLocale(
        "I'm Clara Baptista, a freelance graphic designer based in Paris. I help startups, independent businesses, and cultural projects build distinctive visual identities — from logo and brand system to print and editorial design. Every project starts with your story and ends with a coherent, memorable identity.",
        "Je suis Clara Baptista, graphiste freelance à Paris. J'accompagne les startups, les entreprises indépendantes et les projets culturels dans la création d'identités visuelles fortes — du logo au système de marque, jusqu'au design print et éditorial. Chaque projet part de votre histoire pour aboutir à une identité cohérente et mémorable.",
      ),
    },
    {
      name: 'services',
      type: 'array',
      localized: true,
      labels: { singular: 'Service', plural: 'Services' },
      defaultValue: ({ locale }: { locale?: string }) =>
        locale === 'fr'
          ? [
              {
                title: 'Branding & identité visuelle',
                description:
                  'Logo, couleurs, typographie et système de marque complet pour rendre votre activité immédiatement reconnaissable.',
              },
              {
                title: 'Design print & éditorial',
                description:
                  "Brochures, livres, packaging, affiches — un travail print soigné, jusqu'aux fichiers prêts à l'impression.",
              },
              {
                title: 'Direction artistique',
                description:
                  'Une direction créative cohérente sur tous vos supports, en ligne comme hors ligne.',
              },
              {
                title: 'Création de logo',
                description:
                  "Un logo unique et intemporel, pensé pour fonctionner dans tous les formats et tous les usages.",
              },
            ]
          : [
              {
                title: 'Branding & Visual Identity',
                description:
                  'Logo, colour, typography, and a complete brand system that makes your business instantly recognizable.',
              },
              {
                title: 'Print & Editorial Design',
                description:
                  'Brochures, books, packaging, posters — print work crafted with care, down to production-ready files.',
              },
              {
                title: 'Art Direction',
                description:
                  'A consistent creative direction across all your touchpoints, online and offline.',
              },
              {
                title: 'Logo Design',
                description:
                  'A unique, timeless logo built to scale across every format and use.',
              },
            ],
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'ctaHeading',
      type: 'text',
      localized: true,
      defaultValue: byLocale("Have a project in mind? Let's talk.", 'Un projet en tête ? Parlons-en.'),
    },
    {
      name: 'email',
      type: 'text',
      defaultValue: 'contact@clarabaptista.com',
    },
    {
      name: 'metaTitle',
      type: 'text',
      localized: true,
      defaultValue: byLocale(
        'Freelance Graphic Designer in Paris — Branding & Print | Clara Baptista',
        'Graphiste freelance à Paris — Branding & print | Clara Baptista',
      ),
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      localized: true,
      defaultValue: byLocale(
        'Clara Baptista, freelance graphic designer in Paris. Branding, visual identity, logo and print design for brands that want to stand out. Get in touch.',
        "Clara Baptista, graphiste freelance à Paris. Branding, identité visuelle, logo et design print pour les marques qui veulent se démarquer. Contactez-moi.",
      ),
    },
  ],
}
