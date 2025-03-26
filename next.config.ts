import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  sassOptions: {
    implementation: 'sass-embedded',
    additionalData: `@use "${path.join(process.cwd(), '_mantine').replace(/\\/g, '/')}" as mantine;`,
  },

  images: {
    unoptimized: false,
    dangerouslyAllowSVG: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.icons8.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-google-site-verification',
            value: 'x-google-site-verification-code',
          },
          {
            key: 'x-bing-site-verification',
            value: 'x-bing-site-verification-code',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
