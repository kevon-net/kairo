import { fileURLToPath } from 'url';
import path from 'node:path';

/** @type {import('next').NextConfig} */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  sassOptions: {
    prependData: `@import "../../_mantine.scss";`,
  },

  images: {
    // unoptimized: true,
    // dangerouslyAllowSVG: true,
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
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.wikimedia.org',
        port: '',
        pathname: '/**',
      },
    ],
  },

  webpack: (config) => {
    config.externals = [...config.externals, 'bcrypt'];

    config.resolve.alias = {
      ...config.resolve.alias,
      '@repo/enums': path.resolve(__dirname, '../../packages/enums/src'),
    };

    return config;
  },
};

export default nextConfig;
