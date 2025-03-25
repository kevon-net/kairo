import { EXPIRY } from '@/data/constants';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = EXPIRY.DAY;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://example.com';

  const staticRoutes = [
    '', // homepage
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...staticRoutes];
}
