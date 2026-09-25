import { useState } from 'react'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { ScoreMeter } from '@/components/ui/scoreMeter'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/ui/statusBadge'
import { Tabs, TabsCount, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TextField } from '@/components/ui/textField'
import { ThresholdBar } from '@/components/ui/thresholdBar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTheme } from '@/hooks/useTheme'
import { BAND_LABELS, BAND_TONES, scoreBand } from '@/lib/scoring'

const SCORES = [82, 94, 91, 47]
const SEVERITIES = [
  { label: 'All', count: 6 },
  { label: 'High', count: 2 },
  { label: 'Medium', count: 3 },
  { label: 'Low', count: 1 },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {children}
      </CardContent>
    </Card>
  )
}

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [severity, setSeverity] = useState('All')

  return (
    <TooltipProvider>
      <div className="blueprint-grid min-h-dvh">
        <header className="border-border bg-card flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2.5">
            <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-xs">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M2.5 11.5a5.5 5.5 0 0 1 11 0" />
                <path d="M8 11.5 10.8 7" />
              </svg>
            </span>
            <span className="font-semibold tracking-tight">trace</span>
          </div>
          <Button
            size="icon-sm"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
            }
          >
            {theme === 'dark' ? '☀' : '☾'}
          </Button>
        </header>

        <main className="mx-auto flex max-w-5xl flex-col gap-5 px-6 py-12">
          <p className="text-muted-foreground font-mono text-[11px] font-medium tracking-[0.08em] uppercase">
            Component system
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <Section title="Buttons">
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="primary">Analyze website</Button>
                <Button variant="secondary">Export</Button>
                <Button variant="ghost">Cancel</Button>
                <Button variant="destructive">Delete run</Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="primary" size="lg">
                  Large 48
                </Button>
                <Button size="default">Medium 36</Button>
                <Button size="sm">Small 30</Button>
                <Button disabled>Disabled</Button>
              </div>
            </Section>

            <Section title="Status badges">
              <div className="flex flex-wrap gap-2">
                <StatusBadge tone="good">Good</StatusBadge>
                <StatusBadge tone="warn">Needs improvement</StatusBadge>
                <StatusBadge tone="poor">Poor</StatusBadge>
                <StatusBadge tone="info">Info</StatusBadge>
                <StatusBadge tone="neutral">Low</StatusBadge>
              </div>
              <p className="text-muted-foreground text-xs">
                Circle = good, square = needs improvement, triangle = poor — never color
                alone.
              </p>
            </Section>

            <Section title="Inputs">
              <TextField
                label="Website URL"
                prefix="$ analyze"
                placeholder="https://example.com"
              />
              <TextField
                label="Website URL"
                prefix="$ analyze"
                defaultValue="htps://example"
                error="“htps://” isn’t a valid protocol."
              />
            </Section>

            <Section title="Score meters">
              <ul className="flex flex-col gap-3">
                {SCORES.map((score) => {
                  const band = scoreBand(score)
                  return (
                    <li key={score} className="flex items-center gap-3">
                      <span className="w-8 font-mono text-lg font-medium tabular-nums">
                        {score}
                      </span>
                      <ScoreMeter score={score} className="grow" />
                      <StatusBadge tone={BAND_TONES[band]}>
                        {BAND_LABELS[band]}
                      </StatusBadge>
                    </li>
                  )
                })}
              </ul>
            </Section>

            <Section title="Threshold bar">
              <ThresholdBar
                position={48}
                goodWidth={41.6}
                warnWidth={25}
                goodLabel="2.5s"
                warnLabel="4.0s"
                annotation={{ text: '+0.4 s over', tone: 'warn' }}
              />
            </Section>

            <Section title="Tabs & filters">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">
                    All <TabsCount>11</TabsCount>
                  </TabsTrigger>
                  <TabsTrigger value="js">
                    JavaScript <TabsCount>4</TabsCount>
                  </TabsTrigger>
                  <TabsTrigger value="css">
                    CSS <TabsCount>2</TabsCount>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex flex-wrap gap-1.5">
                {SEVERITIES.map((item) => (
                  <Chip
                    key={item.label}
                    count={item.count}
                    selected={severity === item.label}
                    onClick={() => {
                      setSeverity(item.label)
                    }}
                  >
                    {item.label}
                  </Chip>
                ))}
              </div>
            </Section>

            <Section title="Alerts">
              <Alert tone="info">
                <AlertTitle>Lab data only.</AlertTitle> Not enough real-visitor traffic
                yet.
              </Alert>
              <Alert tone="warn">
                <AlertTitle>Results varied 12 points</AlertTitle> across 3 runs.
              </Alert>
              <Alert tone="poor">
                <AlertTitle>Accessibility audit failed.</AlertTitle> Other categories
                completed.
              </Alert>
              <Alert tone="good">
                <AlertTitle>LCP now passes.</AlertTitle> 2.1 s, down from 4.8 s.
              </Alert>
            </Section>

            <Section title="Tooltip & skeletons">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="ghost">
                    About LCP
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Time until the biggest image or text block is visible. Good is 2.5 s or
                  less.
                </TooltipContent>
              </Tooltip>
              <div className="flex flex-col gap-3">
                <Skeleton className="h-3 w-2/5" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-1.5" />
              </div>
            </Section>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
