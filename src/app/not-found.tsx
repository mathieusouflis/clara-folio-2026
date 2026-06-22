import './(frontend)/styles.css'
import { NextIntlClientProvider } from 'next-intl'
import { NotFoundPage } from '@/components/layout/not-found'
import { allFonts } from '@/lib/fonts'
import enMessages from '../../messages/en.json'

export default function NotFound() {
  const fontVariables = allFonts.map((font) => font.variable).join(' ')
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <NotFoundPage />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
