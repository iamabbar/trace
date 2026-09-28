import axios from 'axios'

import type { AnalysisReport, AnalysisRequest } from '@/features/analysis/types'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
})

export async function analyzeUrl(request: AnalysisRequest): Promise<AnalysisReport> {
  const { data } = await client.post<AnalysisReport>('/api/analyze', request)

  return { ...data, createdAt: new Date(data.createdAt) }
}
