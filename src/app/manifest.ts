import { appDesc, appName } from '@/data/app';
import { PARAM_NAME } from '@/data/constants';
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: `devokrann-${appName.toLowerCase()}`,
    name: appName,
    short_name: appName,
    description: appDesc,
    lang: 'en',
    dir: 'ltr',
    scope: '/',
    start_url: PARAM_NAME.REDIRECT_AUTH,
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone'],
    theme_color: '#ffffff',
    background_color: '#F2E7DC',
    orientation: 'portrait-primary',
    categories: ['productivity'],
    prefer_related_applications: false,
    launch_handler: {
      client_mode: ['navigate-existing', 'auto'],
    },
    screenshots: [
      {
        src: '/images/screenshots/manifest/desktop/home.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Home Page',
      },
      {
        src: '/images/screenshots/manifest/desktop/inbox.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Inbox Page',
      },
      {
        src: '/images/screenshots/manifest/mobile/home.jpeg',
        sizes: '540x1110',
        type: 'image/jpeg',
        form_factor: 'narrow',
        label: 'Home Page',
      },
      {
        src: '/images/screenshots/manifest/mobile/inbox.jpeg',
        sizes: '540x1110',
        type: 'image/jpeg',
        form_factor: 'narrow',
        label: 'Inbox Page',
      },
    ],
    icons: [
      {
        src: '/images/brand/icon/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/brand/icon/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
