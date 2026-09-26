import type { StatusTone } from '@/components/ui/statusMark'

export type ScoreBand = 'good' | 'warn' | 'poor'

export const SCORE_THRESHOLDS = { good: 90, warn: 50 } as const

export function scoreBand(score: number): ScoreBand {
  if (score >= SCORE_THRESHOLDS.good) return 'good'
  if (score >= SCORE_THRESHOLDS.warn) return 'warn'
  return 'poor'
}

export const BAND_LABELS: Record<ScoreBand, string> = {
  good: 'Good',
  warn: 'Needs improvement',
  poor: 'Poor',
}

export const BAND_TONES: Record<ScoreBand, StatusTone> = {
  good: 'good',
  warn: 'warn',
  poor: 'poor',
}
