import localFont from 'next/font/local'

/**
 * Satoshi - Main sans-serif font used as the default body font throughout the app.
 * Variable font for optimal performance and flexibility
 */
export const satoshi = localFont({
  src: '../../assets/fonts/Satoshi-Variable.woff2',
  variable: '--font-satoshi',
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

export const allFonts = [satoshi, astonScript]

export const fontVariables = {
  satoshi: 'var(--font-satoshi)',
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
    satoshi: satoshi.className,
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
