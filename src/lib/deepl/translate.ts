const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate'

export async function translateTexts(
  texts: string[],
  targetLang: string,
  sourceLang = 'EN',
): Promise<string[]> {
  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) return texts

  const nonEmpty = texts.filter(Boolean)
  if (nonEmpty.length === 0) return texts

  const response = await fetch(DEEPL_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `DeepL-Auth-Key ${apiKey}` },
    body: JSON.stringify({ text: texts, target_lang: targetLang, source_lang: sourceLang }),
  })

  if (!response.ok) {
    console.error(`DeepL error: ${response.status} ${await response.text()}`)
    return texts
  }

  const data = (await response.json()) as { translations: { text: string }[] }
  return data.translations.map((t) => t.text)
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  const results = await translateTexts([text], targetLang)
  return results[0] ?? text
}
