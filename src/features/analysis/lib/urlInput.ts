export type UrlCheck =
  | { status: 'empty' }
  | { status: 'valid'; url: string }
  | { status: 'invalid'; message: string; suggestion?: string }

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])
const SCHEME_PATTERN = /^([a-zA-Z][\w+.-]*):\/\//

function capitalize(sentence: string) {
  const [first, ...rest] = sentence
  return first ? first.toUpperCase() + rest.join('') : sentence
}

export function checkUrl(raw: string): UrlCheck {
  const value = raw.trim()
  if (!value) return { status: 'empty' }

  const schemeMatch = SCHEME_PATTERN.exec(value)
  const schemeName = schemeMatch?.[1]
  const schemeIsBad =
    schemeName !== undefined && !ALLOWED_PROTOCOLS.has(`${schemeName.toLowerCase()}:`)
  const withoutScheme = value.slice(schemeMatch?.[0].length ?? 0)

  // A bare "example.com" is the common case, so assume https rather than reject.
  const candidate = schemeName && !schemeIsBad ? value : `https://${withoutScheme}`

  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    return { status: 'invalid', message: 'That does not look like a web address.' }
  }

  const host = parsed.hostname
  const hasDomainEnding =
    host.includes('.') && !host.startsWith('.') && !host.endsWith('.')

  const problems: string[] = []
  if (schemeIsBad) problems.push(`“${schemeName}://” isn’t a valid protocol`)
  if (!hasDomainEnding) problems.push('the address is missing a domain ending like .com')

  if (problems.length > 0) {
    const path = (parsed.pathname === '/' ? '' : parsed.pathname) + parsed.search
    return {
      status: 'invalid',
      message: `${capitalize(problems.join(', and '))}.`,
      suggestion: `https://${hasDomainEnding ? host : `${host}.com`}${path}`,
    }
  }

  return { status: 'valid', url: parsed.toString() }
}

export function hostOf(url: string) {
  try {
    const parsed = new URL(url)
    return `${parsed.hostname}${parsed.pathname}`
  } catch {
    return url
  }
}
