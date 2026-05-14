export type DocPageMeta = {
  title: string;
  description: string;
  href: string;
  summary?: string;
  section: string;
  badge?: string;
};

export type DocNavGroup = {
  title: string;
  items: DocPageMeta[];
};

export const DOC_NAV: DocNavGroup[] = [
  {
    title: 'Start Here',
    items: [
      {
        title: 'Home',
        description: 'Overview and launchpad for the Hackura docs system.',
        href: '/docs',
        summary: 'Documentation home',
        section: 'Start Here',
      },
      {
        title: 'Getting Started',
        description: 'Authentication, first scan, and platform overview.',
        href: '/docs/getting-started',
        summary: 'Quick onboarding',
        section: 'Start Here',
      },
      {
        title: 'Architecture',
        description: 'Frontend, API, recon, graph intelligence, and AuraDB flow.',
        href: '/docs/architecture',
        summary: 'System design',
        section: 'Start Here',
      },
    ],
  },
  {
    title: 'Core Platform',
    items: [
      {
        title: 'Scanning',
        description: 'URL analysis, DNS enrichment, ASN, GeoIP, redirects, and indicators.',
        href: '/docs/scanning',
        summary: 'Scan pipeline',
        section: 'Core Platform',
      },
      {
        title: 'Threat Graph',
        description: 'Nodes, relationships, confidence, and infrastructure mapping.',
        href: '/docs/threat-graph',
        summary: 'Graph intelligence',
        section: 'Core Platform',
      },
      {
        title: 'Risk Engine',
        description: 'Scoring, confidence weighting, and AI-assisted analysis.',
        href: '/docs/risk-engine',
        summary: 'Risk model',
        section: 'Core Platform',
      },
      {
        title: 'Examples',
        description: 'Practical scan workflows and integration snippets.',
        href: '/docs/examples',
        summary: 'Usage examples',
        section: 'Core Platform',
      },
    ],
  },
  {
    title: 'Developers',
    items: [
      {
        title: 'API',
        description: 'API entry point and nested auth, scans, graph, and threats docs.',
        href: '/docs/api',
        summary: 'API reference',
        section: 'Developers',
      },
      {
        title: 'Integrations',
        description: 'VirusTotal, AbuseIPDB, Supabase, OpenAI, and Neo4j connectors.',
        href: '/docs/integrations',
        summary: 'Integrations',
        section: 'Developers',
      },
      {
        title: 'CLI',
        description: 'Terminal workflows for scanning and reporting.',
        href: '/docs/cli',
        summary: 'Command line',
        section: 'Developers',
      },
    ],
  },
  {
    title: 'Platform Trust',
    items: [
      {
        title: 'Security',
        description: 'Rate limiting, SSRF protections, privacy, and secure graph handling.',
        href: '/docs/security',
        summary: 'Security posture',
        section: 'Platform Trust',
      },
      {
        title: 'FAQ',
        description: 'Common answers for developers and operators.',
        href: '/docs/faq',
        summary: 'Answers',
        section: 'Platform Trust',
      },
      {
        title: 'Changelog',
        description: 'Recent product and docs updates.',
        href: '/docs/changelog',
        summary: 'Latest changes',
        section: 'Platform Trust',
      },
      {
        title: 'Roadmap',
        description: 'What is coming next for the platform.',
        href: '/docs/roadmap',
        summary: 'Future plans',
        section: 'Platform Trust',
      },
    ],
  },
];

export const DOC_PAGES: DocPageMeta[] = DOC_NAV.flatMap((group) => group.items);

export const DOC_API_PAGES: DocPageMeta[] = [
  {
    title: 'Authentication',
    description: 'API keys, headers, and auth examples.',
    href: '/docs/api/auth',
    summary: 'Auth reference',
    section: 'API',
    badge: 'API',
  },
  {
    title: 'Scans',
    description: 'Scan endpoints, payloads, and results.',
    href: '/docs/api/scans',
    summary: 'Scan endpoints',
    section: 'API',
    badge: 'API',
  },
  {
    title: 'Graph',
    description: 'Graph API, node model, and relationships.',
    href: '/docs/api/graph',
    summary: 'Graph endpoints',
    section: 'API',
    badge: 'API',
  },
  {
    title: 'Threats',
    description: 'Threat indicators, scoring, and intelligence fields.',
    href: '/docs/api/threats',
    summary: 'Threat payloads',
    section: 'API',
    badge: 'API',
  },
];
