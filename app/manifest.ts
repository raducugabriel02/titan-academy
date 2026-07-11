import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Titan Academy',
    short_name: 'Titan',
    description: 'Arsenalul tău digital pentru performanță maximă.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#f97316',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    screenshots: [],
    categories: ['fitness', 'health', 'sports'],
  };
}
