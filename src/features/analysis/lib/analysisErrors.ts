export type AnalysisErrorKind = 'unreachable' | 'timeout' | 'blocked' | 'failed'

export type AnalysisErrorAction = {
  label: string
  variant: 'primary' | 'secondary' | 'ghost'
}

export type AnalysisError = {
  kind: AnalysisErrorKind
  /** Small uppercase label above the title. */
  eyebrow: string
  /** Machine-facing code shown alongside the eyebrow. */
  code: string
  tone: 'poor' | 'warn' | 'neutral'
  icon: 'server' | 'clock' | 'shield' | 'warning'
  title: string
  description: string
  /** Technical lines, shown verbatim in mono. */
  detail: string[]
  hint: string
  actions: AnalysisErrorAction[]
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

export function buildAnalysisError(kind: AnalysisErrorKind, url: string): AnalysisError {
  const host = hostOf(url)

  switch (kind) {
    case 'unreachable':
      return {
        kind,
        eyebrow: 'Website unavailable',
        code: 'ERR_CONNECTION_REFUSED',
        tone: 'poor',
        icon: 'server',
        title: `We couldn’t reach ${host}`,
        description:
          'The domain resolved, but the server refused the connection on all 3 attempts. The site may be down, or only reachable from a private network or VPN.',
        detail: [
          `GET ${url} → no response`,
          'Resolved 93.184.xx.xx · 3 attempts over 12 s',
        ],
        hint: 'Testing a staging site? Use a public preview URL or a tunnel.',
        actions: [
          { label: 'Try again', variant: 'primary' },
          { label: 'Edit URL', variant: 'secondary' },
        ],
      }

    case 'timeout':
      return {
        kind,
        eyebrow: 'Analysis timeout',
        code: 'TIMEOUT · 60 s',
        tone: 'warn',
        icon: 'clock',
        title: 'The page never finished loading',
        description:
          'We stopped after 60 seconds because the network never went quiet. This is usually a long-lived connection, an autoplaying video or a slow third-party script.',
        detail: [
          'Still open at 60 s:',
          `wss://chat.${host}/socket`,
          '/media/intro-loop.mp4 (streaming)',
        ],
        hint: 'Partial results up to 60 s are saved and can still be viewed.',
        actions: [
          { label: 'Retry with 120 s limit', variant: 'primary' },
          { label: 'Block third-party scripts', variant: 'secondary' },
          { label: 'View partial report', variant: 'ghost' },
        ],
      }

    case 'blocked':
      return {
        kind,
        eyebrow: 'Website blocks analysis',
        code: 'HTTP 403',
        tone: 'warn',
        icon: 'shield',
        title: `${host} turned our test browser away`,
        description:
          'The site answered with 403 Forbidden and a verification page instead of your content. Bot protection or a firewall rule likely flagged the automated visit.',
        detail: [
          'Response: 403 · 14 KB · challenge page detected',
          'User agent: Chrome (headless) · mobile emulation',
        ],
        hint: 'If you own the site, allow our analyzer’s user agent and IP ranges, then run again.',
        actions: [
          { label: 'How to allow the analyzer', variant: 'primary' },
          { label: 'Run again', variant: 'secondary' },
        ],
      }

    case 'failed':
      return {
        kind,
        eyebrow: 'Analysis error',
        code: 'run_8f2c1a',
        tone: 'neutral',
        icon: 'warning',
        title: 'The audit stopped partway through',
        description:
          'Our test browser crashed while running the accessibility audit. The problem is on our side, not your site — performance results were captured before it stopped.',
        detail: [
          'Failed step: accessibility audit (3 of 4)',
          'Browser exited with code 139 · 22.8 s into run',
        ],
        hint: 'Running again usually works. If it keeps happening, send us the run ID.',
        actions: [
          { label: 'Run again', variant: 'primary' },
          { label: 'Copy error details', variant: 'secondary' },
          { label: 'Report a problem', variant: 'ghost' },
        ],
      }
  }
}

/* Until a backend exists, the hostname decides the outcome so every state stays
   reachable: analyze offline.example.com to see the unreachable card. */
const MOCK_TRIGGERS: Record<string, AnalysisErrorKind> = {
  offline: 'unreachable',
  timeout: 'timeout',
  blocked: 'blocked',
  broken: 'failed',
}

export function mockErrorFor(url: string): AnalysisErrorKind | undefined {
  const host = hostOf(url).toLowerCase()
  return Object.entries(MOCK_TRIGGERS).find(([token]) => host.includes(token))?.[1]
}
