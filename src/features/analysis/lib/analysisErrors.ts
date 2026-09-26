export type AnalysisError = {
  code: string
  title: string
  detail: string
  emphasis: string
  tips: { title: string; body: string }[]
}

export function buildAnalysisError(host: string): AnalysisError {
  return {
    code: 'ERR_HTTP_503',
    title: host,
    emphasis: '503 Service Unavailable',
    detail: 'three times in a row, so the audit couldn’t start.',
    tips: [
      {
        title: 'Is it public?',
        body: 'Staging sites behind a VPN, basic auth or an IP allowlist can’t be reached from here. Use a public preview URL or a tunnel.',
      },
      {
        title: 'Bot protection',
        body: 'A firewall or bot rule may be turning our test browser away. Allow the analyzer’s user agent and IP ranges, then run again.',
      },
      {
        title: 'Just deployed?',
        body: 'A rolling deploy can return 503 for a minute or two. Wait for it to settle and try once more.',
      },
    ],
  }
}

/* Until a backend exists, the hostname decides the outcome: any URL containing
   "fail" errors, everything else succeeds. */
export function shouldFail(url: string) {
  return url.toLowerCase().includes('fail')
}
