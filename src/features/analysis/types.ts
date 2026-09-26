import type { ScoreBand } from '@/lib/scoring'

export type DeviceProfile = 'mobile' | 'desktop'

export type AnalysisRequest = {
  url: string
  device: DeviceProfile
}

export type CategoryScore = {
  id: 'performance' | 'accessibility' | 'best-practices' | 'seo'
  label: string
  score: number
  /** One-line summary of what is dragging the score, shown under the meter. */
  note: string
}

export type WebVital = {
  code: 'LCP' | 'INP' | 'CLS'
  name: string
  value: string
  unit?: string
  band: ScoreBand
  /** Plain-language definition used by the tooltip. */
  definition: string
  explanation: string
  /** Bar geometry as percentages of the full track. */
  goodWidth: number
  warnWidth: number
  position: number
  goodLabel: string
  warnLabel: string
  annotation: string
}

export type TimingMetric = {
  code: 'FCP' | 'LCP' | 'TBT' | 'SI'
  name: string
  value: string
  band: ScoreBand
  target: string
  /** Fill and target-marker positions as percentages. */
  fillPercent: number
  targetPercent: number
}

export type IssueSeverity = 'high' | 'medium' | 'low'

export type Issue = {
  id: string
  title: string
  /** The file or request the issue points at. */
  target: string
  description: string
  severity: IssueSeverity
  savings: string
  icon: 'image' | 'code' | 'blocking' | 'server'
}

export type Recommendation = {
  id: string
  category: string
  /** Estimated metric improvement, e.g. "LCP −1.1 s". */
  gain: string
  problem: string
  why: string
  fix: string
  snippet: string
}

export type ResourceKind = 'js' | 'css' | 'img' | 'font'

export type ResourceRow = {
  id: string
  name: string
  path: string
  type: string
  kind: ResourceKind
  size: string
  /** Percentage of total page weight. */
  share: number
  time: string
  status: 'Large' | 'Review' | 'OK'
}

export type AnalysisReport = {
  runNumber: number
  request: AnalysisRequest
  createdAt: Date
  conditions: string
  dataNote: string
  verdict: { headline: string; detail: string }
  scores: CategoryScore[]
  vitals: WebVital[]
  timings: TimingMetric[]
  issues: Issue[]
  recommendations: Recommendation[]
  resources: ResourceRow[]
  totalWeight: string
}
