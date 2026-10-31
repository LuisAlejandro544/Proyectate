import type { Metadata, Viewport } from 'next';
import './globals.css';

/**
 * Configuración de Viewport para dispositivos móviles y PWA
 * Asegura ergonomía táctil en teléfonos y previene zoom accidental al enfocar inputs.
 */
export const viewport: Viewport = {
  themeColor: '#0a0d14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/**
 * Metadatos principales de la aplicación sincronizados con metadata.json
 */
export const metadata: Metadata = {
  title: 'Proyecta - Red Social Anónima',
  description:
    'Red social inspirada en X para proyectarse anónimamente con desahogos, tendencias virales y motor de análisis criptográfico con WebAssembly.',
  applicationName: 'Proyecta',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Proyecta',
  },
  openGraph: {
    title: 'Proyecta - Red Social Anónima',
    description:
      'Red social inspirada en X para proyectarse anónimamente con desahogos, tendencias virales y motor de análisis criptográfico con WebAssembly.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proyecta - Red Social Anónima',
    description:
      'Red social inspirada en X para proyectarse anónimamente con desahogos, tendencias virales y motor de análisis criptográfico con WebAssembly.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body
        className="bg-[#080B10] text-slate-100 antialiased min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
