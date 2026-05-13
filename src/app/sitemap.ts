import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://sentinel.hackura.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/auth/login',
    '/auth/signup',
    '/security',
    '/privacy',
    '/terms',
    '/docs/api',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
