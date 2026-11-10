import { absolute } from '../lib/paths';

export function GET() {
  const manifest = {
    name: 'Guilherme Trajano',
    start_url: absolute(),
    display: 'standalone',
    icons: [
      {
        src: absolute('apple-touch-icon.png'),
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
}
