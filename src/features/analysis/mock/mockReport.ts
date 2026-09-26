import type {
  AnalysisReport,
  AnalysisRequest,
  CategoryScore,
  Issue,
  Recommendation,
  ResourceRow,
  TimingMetric,
  WebVital,
} from '@/features/analysis/types'

const SCORES: CategoryScore[] = [
  {
    id: 'performance',
    label: 'Performance',
    score: 82,
    note: '6 issues · up to 1.4 s faster',
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    score: 94,
    note: '2 low-contrast buttons',
  },
  {
    id: 'best-practices',
    label: 'Best Practices',
    score: 91,
    note: '1 console error on load',
  },
  { id: 'seo', label: 'SEO', score: 88, note: 'Missing meta description' },
]

const VITALS: WebVital[] = [
  {
    code: 'LCP',
    name: 'Largest Contentful Paint',
    value: '2.9',
    unit: 's',
    band: 'warn',
    definition:
      'Time until the biggest image or text block is visible. Good is 2.5 s or less.',
    explanation:
      "How long until the main content shows up. On this page, that's the hero image — visitors stare at an incomplete page for almost 3 seconds.",
    goodWidth: 41.6,
    warnWidth: 25,
    position: 48,
    goodLabel: '2.5s',
    warnLabel: '4.0s',
    annotation: '+0.4 s over',
  },
  {
    code: 'INP',
    name: 'Interaction to Next Paint',
    value: '180',
    unit: 'ms',
    band: 'good',
    definition:
      'Delay between a click, tap or key press and the screen updating. Good is 200 ms or less.',
    explanation:
      'How quickly the page reacts when someone clicks or types. Buttons and menus here feel responsive — close to the limit on slower phones.',
    goodWidth: 25,
    warnWidth: 37.5,
    position: 22.5,
    goodLabel: '200ms',
    warnLabel: '500ms',
    annotation: '20 ms headroom',
  },
  {
    code: 'CLS',
    name: 'Cumulative Layout Shift',
    value: '0.14',
    band: 'warn',
    definition:
      'How much visible content moves unexpectedly while loading. Good is 0.1 or less.',
    explanation:
      'How much the page jumps around while loading. A cookie banner arrives late and pushes the content down — easy to mis-tap.',
    goodWidth: 25,
    warnWidth: 37.5,
    position: 35,
    goodLabel: '0.10',
    warnLabel: '0.25',
    annotation: '+0.04 over',
  },
]

const TIMINGS: TimingMetric[] = [
  {
    code: 'FCP',
    name: 'First Contentful Paint',
    value: '1.4 s',
    band: 'good',
    target: '1.8 s',
    fillPercent: 35,
    targetPercent: 45,
  },
  {
    code: 'LCP',
    name: 'Largest Contentful Paint',
    value: '2.9 s',
    band: 'warn',
    target: '2.5 s',
    fillPercent: 48,
    targetPercent: 42,
  },
  {
    code: 'TBT',
    name: 'Total Blocking Time',
    value: '240 ms',
    band: 'warn',
    target: '200 ms',
    fillPercent: 30,
    targetPercent: 25,
  },
  {
    code: 'SI',
    name: 'Speed Index',
    value: '2.8 s',
    band: 'good',
    target: '3.4 s',
    fillPercent: 47,
    targetPercent: 57,
  },
]

const ISSUES: Issue[] = [
  {
    id: 'large-image',
    title: 'Large image detected',
    target: 'hero.webp — 2.4 MB',
    description:
      'This image is significantly larger than necessary and may delay the largest contentful paint.',
    severity: 'high',
    savings: 'LCP −1.1 s',
    icon: 'image',
  },
  {
    id: 'render-blocking',
    title: 'Render-blocking resources',
    target: 'styles.css, fonts.css — 324 KB',
    description:
      'The browser waits for these files before drawing anything, so visitors see a blank page for longer.',
    severity: 'high',
    savings: 'FCP −640 ms',
    icon: 'blocking',
  },
  {
    id: 'excessive-js',
    title: 'Excessive JavaScript',
    target: 'main.js — 1.8 MB (612 KB gzipped)',
    description:
      'A large bundle takes time to download, parse and run, which keeps the page from responding to input.',
    severity: 'medium',
    savings: 'TBT −180 ms',
    icon: 'code',
  },
  {
    id: 'unused-js',
    title: 'Unused JavaScript',
    target: 'vendor.js — 58% unused (420 KB)',
    description:
      'Code that ships but never runs on this page still costs download and parse time.',
    severity: 'medium',
    savings: '420 KB',
    icon: 'code',
  },
  {
    id: 'unoptimized-images',
    title: 'Unoptimized images',
    target: 'product-grid.jpg + 7 more — 1.3 MB',
    description:
      'Product thumbnails are served as full-size JPEGs without modern formats or responsive sizes.',
    severity: 'medium',
    savings: '1.3 MB',
    icon: 'image',
  },
  {
    id: 'slow-ttfb',
    title: 'Slow server response',
    target: 'document — TTFB 740 ms',
    description:
      'The server takes a while to send the first byte, and every other metric waits on it. Check caching and database queries.',
    severity: 'low',
    savings: 'FCP −340 ms',
    icon: 'server',
  },
]

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'hero-image',
    category: 'Images',
    gain: 'LCP −1.1 s',
    problem: 'Large hero image',
    why: "Large images can significantly increase LCP. The hero is the largest element, so the page isn't \u201cdone\u201d until it arrives.",
    fix: 'Convert to WebP/AVIF and serve an appropriately sized image.',
    snippet: `<img src="hero-1200.avif"
  srcset="hero-800.avif 800w,
          hero-1600.avif 1600w"
  sizes="100vw" fetchpriority="high">`,
  },
  {
    id: 'critical-css',
    category: 'CSS · Fonts',
    gain: 'FCP −640 ms',
    problem: 'Render-blocking stylesheets',
    why: "The browser can't paint anything until these files download. Visitors see a blank screen in the meantime.",
    fix: 'Inline critical CSS for above-the-fold content and load the rest asynchronously.',
    snippet: `<link rel="preload" href="styles.css"
  as="style"
  onload="this.rel='stylesheet'">`,
  },
  {
    id: 'split-bundle',
    category: 'JavaScript',
    gain: 'TBT −180 ms',
    problem: 'Oversized main bundle',
    why: '1.8 MB of JavaScript keeps the main thread busy, so the page looks ready before it can respond.',
    fix: 'Split routes into separate chunks and lazy-load components below the fold.',
    snippet: `const Reviews = lazy(() =>
  import('./Reviews'));`,
  },
]

const RESOURCES: ResourceRow[] = [
  {
    id: 'hero',
    name: 'hero.webp',
    path: '/assets/img/hero.webp',
    type: 'Image',
    kind: 'img',
    size: '2.4 MB',
    share: 38,
    time: '1.9 s',
    status: 'Large',
  },
  {
    id: 'main',
    name: 'main.js',
    path: '/static/js/main.8c1f2e.js',
    type: 'JavaScript',
    kind: 'js',
    size: '1.8 MB',
    share: 28,
    time: '1.4 s',
    status: 'Large',
  },
  {
    id: 'grid',
    name: 'product-grid.jpg',
    path: '/assets/img/product-grid.jpg',
    type: 'Image',
    kind: 'img',
    size: '860 KB',
    share: 13,
    time: '820 ms',
    status: 'Review',
  },
  {
    id: 'vendor',
    name: 'vendor.js',
    path: '/static/js/vendor.41ab09.js',
    type: 'JavaScript',
    kind: 'js',
    size: '724 KB',
    share: 11,
    time: '690 ms',
    status: 'Review',
  },
  {
    id: 'styles',
    name: 'styles.css',
    path: '/static/css/styles.css',
    type: 'CSS',
    kind: 'css',
    size: '320 KB',
    share: 5,
    time: '310 ms',
    status: 'OK',
  },
  {
    id: 'gtm',
    name: 'gtm.js',
    path: 'googletagmanager.com/gtm.js',
    type: 'JavaScript',
    kind: 'js',
    size: '96 KB',
    share: 1.5,
    time: '240 ms',
    status: 'OK',
  },
  {
    id: 'sans',
    name: 'sans-var.woff2',
    path: '/fonts/sans-var.woff2',
    type: 'Font',
    kind: 'font',
    size: '88 KB',
    share: 1.4,
    time: '180 ms',
    status: 'OK',
  },
  {
    id: 'analytics',
    name: 'analytics.js',
    path: '/static/js/analytics.js',
    type: 'JavaScript',
    kind: 'js',
    size: '48 KB',
    share: 0.8,
    time: '120 ms',
    status: 'OK',
  },
  {
    id: 'mono',
    name: 'mono.woff2',
    path: '/fonts/mono.woff2',
    type: 'Font',
    kind: 'font',
    size: '42 KB',
    share: 0.7,
    time: '110 ms',
    status: 'OK',
  },
  {
    id: 'logo',
    name: 'logo.svg',
    path: '/assets/img/logo.svg',
    type: 'Image',
    kind: 'img',
    size: '6 KB',
    share: 0.1,
    time: '40 ms',
    status: 'OK',
  },
  {
    id: 'fonts-css',
    name: 'fonts.css',
    path: '/static/css/fonts.css',
    type: 'CSS',
    kind: 'css',
    size: '4 KB',
    share: 0.1,
    time: '60 ms',
    status: 'OK',
  },
]

export function buildMockReport(request: AnalysisRequest): AnalysisReport {
  return {
    runNumber: 14,
    request,
    createdAt: new Date(),
    conditions:
      request.device === 'mobile'
        ? 'Mobile · Slow 4G · 4× CPU slowdown'
        : 'Desktop · Cable · No CPU slowdown',
    dataNote: 'Lab data + 28-day field data',
    verdict: {
      headline: 'Solid foundation — the main content just appears too late.',
      detail:
        'The largest element takes 2.9 s to render, mostly because of a 2.4 MB hero image. Fixing the 2 high-severity issues could make it appear about 1.1 s sooner.',
    },
    scores: SCORES,
    vitals: VITALS,
    timings: TIMINGS,
    issues: ISSUES,
    recommendations: RECOMMENDATIONS,
    resources: RESOURCES,
    totalWeight: '6.4 MB',
  }
}
