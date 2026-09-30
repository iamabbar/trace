import type { StatusTone } from '@/components/ui/statusMark'

export type DeviceProfile = 'mobile' | 'desktop'

export type AnalysisRequest = {
  url: string
  device: DeviceProfile
}

export type CategoryScore = {
  id: 'performance' | 'accessibility' | 'best-practices' | 'seo'
  label: string
  score: number
  note: string
}

export type WebVital = {
  key: 'LCP' | 'TBT' | 'CLS'
  full: string
  value: string
  unit: string
  tone: StatusTone
  status: string
  delta: string
  description: string
  /** Threshold geometry: bands are flex-weighted, marker is a percentage. */
  goodFlex: number
  warnFlex: number
  poorFlex: number
  markerPercent: number
  label1: string
  label1Percent: number
  label2: string
  label2Percent: number
}

export type LabMetric = {
  key: 'FCP' | 'LCP' | 'TBT' | 'SI'
  full: string
  value: string
  target: string
  tone: StatusTone
  status: string
  fillPercent: number
  tickPercent: number
}

export type IssueSeverity = 'High' | 'Medium' | 'Low'

export type Issue = {
  id: string
  title: string
  severity: IssueSeverity
  icon: 'image' | 'slash' | 'code' | 'server'
  file: string
  description: string
  savings: string
  /** Anchor id of the matching recommendation, when there is one. */
  recommendationId?: string
}

export type Recommendation = {
  id: string
  category: string
  title: string
  savings: string
  why: string
  fix: string
  code: string
}

export type ResourceType = 'JavaScript' | 'CSS' | 'Image' | 'Font'

export type ResourceRow = {
  id: string
  name: string
  path: string
  type: ResourceType
  size: string
  share: number
  load: string
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
  lab: LabMetric[]
  issues: Issue[]
  recommendations: Recommendation[]
  resources: ResourceRow[]
  totalWeight: string
}
