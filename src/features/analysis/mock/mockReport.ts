import type {
  AnalysisReport,
  AnalysisRequest,
  CategoryScore,
  Issue,
  LabMetric,
  Recommendation,
  ResourceRow,
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

/* Band widths come from the real Core Web Vitals thresholds: the good band runs
   to `a`, the needs-improvement band to `b`, and the track ends at `max`. */
function bands(value: number, a: number, b: number, max: number) {
  return {
    goodFlex: a,
    warnFlex: b - a,
    poorFlex: max - b,
    markerPercent: Math.min(100, (value / max) * 100),
    label1Percent: (a / max) * 100,
    label2Percent: (b / max) * 100,
  }
}

const VITALS: WebVital[] = [
  {
    key: 'LCP',
    full: 'Largest Contentful Paint',
    value: '2.9',
    unit: 's',
    tone: 'warn',
    status: 'Needs improvement',
    delta: '+0.4 s over',
    description:
      'How long until the main content shows up. On this page, that’s the hero image. Visitors stare at an incomplete page for almost 3 seconds.',
    label1: '2.5 s',
    label2: '4.0 s',
    ...bands(2.9, 2.5, 4, 6),
  },
  {
    key: 'INP',
    full: 'Interaction to Next Paint',
    value: '180',
    unit: 'ms',
    tone: 'good',
    status: 'Good',
    delta: '20 ms headroom',
    description:
      'How quickly the page reacts when someone clicks or types. Buttons and menus here feel responsive, but close to the limit on slower phones.',
    label1: '200 ms',
    label2: '500 ms',
    ...bands(180, 200, 500, 800),
  },
  {
    key: 'CLS',
    full: 'Cumulative Layout Shift',
    value: '0.14',
    unit: '',
    tone: 'warn',
    status: 'Needs improvement',
    delta: '+0.04 over',
    description:
      'How much the page jumps around while loading. A cookie banner arrives late and pushes the content down, which makes it easy to mis-tap.',
    label1: '0.10',
    label2: '0.25',
    ...bands(0.14, 0.1, 0.25, 0.4),
  },
]

const LAB: LabMetric[] = [
  {
    key: 'FCP',
    full: 'First Contentful Paint',
    value: '1.4 s',
    target: '1.8 s',
    tone: 'good',
    status: 'Good',
    fillPercent: 35,
    tickPercent: 45,
  },
  {
    key: 'LCP',
    full: 'Largest Contentful Paint',
    value: '2.9 s',
    target: '2.5 s',
    tone: 'warn',
    status: 'Over',
    fillPercent: 48,
    tickPercent: 42,
  },
  {
    key: 'TBT',
    full: 'Total Blocking Time',
    value: '240 ms',
    target: '200 ms',
    tone: 'warn',
    status: 'Over',
    fillPercent: 30,
    tickPercent: 25,
  },
  {
    key: 'SI',
    full: 'Speed Index',
    value: '2.8 s',
    target: '3.4 s',
    tone: 'good',
    status: 'Good',
    fillPercent: 47,
    tickPercent: 57,
  },
]

const ISSUES: Issue[] = [
  {
    id: 'large-image',
    title: 'Large image detected',
    severity: 'High',
    icon: 'image',
    file: 'hero.webp · 2.4 MB',
    description:
      'This image is significantly larger than necessary and may delay the largest contentful paint.',
    savings: 'LCP −1.1 s',
    recommendationId: 'rec-images',
  },
  {
    id: 'render-blocking',
    title: 'Render-blocking resources',
    severity: 'High',
    icon: 'slash',
    file: 'styles.css, fonts.css · 324 KB',
    description:
      'The browser waits for these files before drawing anything, so visitors see a blank page for longer.',
    savings: 'FCP −640 ms',
    recommendationId: 'rec-css',
  },
  {
    id: 'excessive-js',
    title: 'Excessive JavaScript',
    severity: 'Medium',
    icon: 'code',
    file: 'main.js · 1.8 MB (612 KB gzipped)',
    description:
      'A large bundle takes time to download, parse and run, which keeps the page from responding to input.',
    savings: 'TBT −180 ms',
    recommendationId: 'rec-js',
  },
  {
    id: 'unused-js',
    title: 'Unused JavaScript',
    severity: 'Medium',
    icon: 'code',
    file: 'vendor.js · 58% unused (420 KB)',
    description:
      'Code that ships but never runs on this page still costs download and parse time.',
    savings: '420 KB',
    recommendationId: 'rec-js',
  },
  {
    id: 'unoptimized-images',
    title: 'Unoptimized images',
    severity: 'Medium',
    icon: 'image',
    file: 'product-grid.jpg + 7 more · 1.3 MB',
    description:
      'Product thumbnails are served as full-size JPEGs without modern formats or responsive sizes.',
    savings: '1.3 MB',
    recommendationId: 'rec-images',
  },
  {
    id: 'slow-ttfb',
    title: 'Slow server response',
    severity: 'Low',
    icon: 'server',
    file: 'document · TTFB 740 ms',
    description:
      'The server takes a while to send the first byte, and every other metric waits on it. Check caching and database queries.',
    savings: 'FCP −340 ms',
  },
]

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-images',
    category: 'IMAGES',
    title: 'Large hero image',
    savings: 'LCP −1.1 s',
    why: 'Large images can significantly increase LCP. The hero is the largest element, so the page isn’t “done” until it arrives.',
    fix: 'Convert to WebP/AVIF and serve an appropriately sized image.',
    code: '<img src="hero-1200.avif"\n  srcset="hero-800.avif 800w,\n          hero-1600.avif 1600w"\n  sizes="100vw" fetchpriority="high">',
  },
  {
    id: 'rec-css',
    category: 'CSS · FONTS',
    title: 'Render-blocking stylesheets',
    savings: 'FCP −640 ms',
    why: 'The browser can’t paint anything until these files download. Visitors see a blank screen in the meantime.',
    fix: 'Inline critical CSS for above-the-fold content and load the rest asynchronously.',
    code: '<link rel="preload" href="styles.css"\n  as="style"\n  onload="this.rel=\'stylesheet\'">',
  },
  {
    id: 'rec-js',
    category: 'JAVASCRIPT',
    title: 'Oversized main bundle',
    savings: 'TBT −180 ms',
    why: '1.8 MB of JavaScript keeps the main thread busy, so the page looks ready before it can respond.',
    fix: 'Split routes into separate chunks and lazy-load components below the fold.',
    code: "const Reviews = lazy(() =>\n  import('./Reviews'));",
  },
]

const RESOURCES: ResourceRow[] = [
  {
    id: 'hero',
    name: 'hero.webp',
    path: '/assets/img/hero.webp',
    type: 'Image',
    size: '2.4 MB',
    share: 38,
    load: '1.9 s',
    status: 'Large',
  },
  {
    id: 'main',
    name: 'main.js',
    path: '/static/js/main.8c1f2e.js',
    type: 'JavaScript',
    size: '1.8 MB',
    share: 28,
    load: '1.4 s',
    status: 'Large',
  },
  {
    id: 'grid',
    name: 'product-grid.jpg',
    path: '/assets/img/product-grid.jpg',
    type: 'Image',
    size: '860 KB',
    share: 13,
    load: '820 ms',
    status: 'Review',
  },
  {
    id: 'vendor',
    name: 'vendor.js',
    path: '/static/js/vendor.41ab09.js',
    type: 'JavaScript',
    size: '724 KB',
    share: 11,
    load: '690 ms',
    status: 'Review',
  },
  {
    id: 'styles',
    name: 'styles.css',
    path: '/static/css/styles.css',
    type: 'CSS',
    size: '320 KB',
    share: 5,
    load: '310 ms',
    status: 'OK',
  },
  {
    id: 'gtm',
    name: 'gtm.js',
    path: 'googletagmanager.com/gtm.js',
    type: 'JavaScript',
    size: '96 KB',
    share: 1.5,
    load: '240 ms',
    status: 'OK',
  },
  {
    id: 'sans',
    name: 'sans-var.woff2',
    path: '/fonts/sans-var.woff2',
    type: 'Font',
    size: '88 KB',
    share: 1.4,
    load: '180 ms',
    status: 'OK',
  },
  {
    id: 'analytics',
    name: 'analytics.js',
    path: '/static/js/analytics.js',
    type: 'JavaScript',
    size: '48 KB',
    share: 0.8,
    load: '120 ms',
    status: 'OK',
  },
  {
    id: 'mono',
    name: 'mono.woff2',
    path: '/fonts/mono.woff2',
    type: 'Font',
    size: '42 KB',
    share: 0.7,
    load: '110 ms',
    status: 'OK',
  },
  {
    id: 'logo',
    name: 'logo.svg',
    path: '/assets/img/logo.svg',
    type: 'Image',
    size: '6 KB',
    share: 0.1,
    load: '40 ms',
    status: 'OK',
  },
  {
    id: 'fonts-css',
    name: 'fonts.css',
    path: '/static/css/fonts.css',
    type: 'CSS',
    size: '4 KB',
    share: 0.1,
    load: '60 ms',
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
      headline: 'Solid foundation, but the main content appears too late.',
      detail:
        'The largest element takes 2.9 s to render, mostly because of a 2.4 MB hero image. Fixing the 2 high-severity issues could make it appear about 1.1 s sooner.',
    },
    scores: SCORES,
    vitals: VITALS,
    lab: LAB,
    issues: ISSUES,
    recommendations: RECOMMENDATIONS,
    resources: RESOURCES,
    totalWeight: '6.4 MB',
  }
}
