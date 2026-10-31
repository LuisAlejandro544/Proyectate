import type { MetadataRoute } from 'next';

/**
 * Manifiesto PWA para instalación nativa en dispositivos móviles (Android/iOS)
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Proyecta - Red Social Anónima',
    short_name: 'Proyecta',
    description:
      'Red social para proyectarse anónimamente con desahogos, tendencias virales y motor WebAssembly.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#080B10',
    theme_color: '#080B10',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
