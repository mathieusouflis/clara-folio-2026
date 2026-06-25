import localFont from 'next/font/local'

/**
 * Poppins - Main sans-serif font used as the default body font throughout the app.
 */
export const poppins = localFont({
  src: [
    { path: '../../assets/fonts/Poppins-Thin.woff', weight: '100', style: 'normal' },
    { path: '../../assets/fonts/Poppins-Regular.woff', weight: '400', style: 'normal' },
    { path: '../../assets/fonts/Poppins-Medium.woff', weight: '500', style: 'normal' },
    { path: '../../assets/fonts/Poppins-SemiBold.woff', weight: '600', style: 'normal' },
    { path: '../../assets/fonts/Poppins-Bold.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-poppins',
  preload: true,
  display: 'swap',
})

/**
 * Aston Script - Decorative script font for headlines and special elements
 * Use sparingly for visual impact
 */
export const astonScript = localFont({
  src: '../../assets/fonts/AstonScript.woff2',
  variable: '--font-aston-script',
  preload: true,
  weight: '400',
  display: 'swap',
})

export const allFonts = [poppins, astonScript]

export const fontVariables = {
  poppins: 'var(--font-poppins)',
  astonScript: 'var(--font-aston-script)',
} as const

/**
 * Helper function to get font className
 * @param fontName - The name of the font to use
 * @returns The className string for the font
 *
 * @example
 * <div className={getFontClass('astonScript')}>Styled text</div>
 */
export function getFontClass(fontName: keyof typeof fontVariables): string {
  const fontMap = {
    poppins: poppins.className,
    astonScript: astonScript.className,
  }
  return fontMap[fontName]
}

/**
 * Helper function to get font variable
 * @param fontName - The name of the font variable to use
 * @returns The CSS variable string for the font
 *
 * @example
 * <div style={{ fontFamily: getFontVariable('astonScript') }}>Styled text</div>
 */
export function getFontVariable(fontName: keyof typeof fontVariables): string {
  return fontVariables[fontName]
}
