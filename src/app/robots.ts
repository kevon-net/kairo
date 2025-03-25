import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/*?ref=*', // Prevent crawling of referral URLs
        '/*?utm_*', // Prevent crawling of UTM URLs
        // Add more private routes here
      ],
    },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
