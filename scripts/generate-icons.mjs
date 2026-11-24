import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const svg = await readFile(new URL('../resources/icon.svg', import.meta.url));
await mkdir(new URL('../public/icons/', import.meta.url), { recursive: true });
await mkdir(new URL('../resources/', import.meta.url), { recursive: true });

async function make(path, size, padding = 0) {
  const inner = size - padding * 2;
  const png = await sharp(svg)
    .resize(inner, inner)
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 101, g: 88, b: 201, alpha: 1 },
    })
    .png()
    .toBuffer();
  await sharp(png).resize(size, size).png().toFile(path);
}

const output = (path) => fileURLToPath(new URL(path, import.meta.url));
await make(output('../public/icons/icon-192.png'), 192);
await make(output('../public/icons/icon-512.png'), 512);
await make(output('../public/icons/maskable-192.png'), 192, 20);
await make(output('../public/icons/maskable-512.png'), 512, 52);
await make(output('../public/icons/apple-touch-icon.png'), 180);
await make(output('../public/icons/favicon-32.png'), 32);
await make(output('../resources/icon.png'), 1024);

const splash = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732"><rect width="100%" height="100%" fill="#f5f6f8"/><rect x="1091" y="1091" width="550" height="550" rx="120" fill="#6558c9"/><path d="M1366 1220v90m0 0-120 90m120-90 120 90" stroke="#fff" stroke-width="30" stroke-linecap="round"/><g fill="#fff"><rect x="1300" y="1140" width="132" height="80" rx="18"/><rect x="1155" y="1400" width="160" height="110" rx="20"/><rect x="1417" y="1400" width="160" height="110" rx="20"/></g></svg>');
await sharp(splash).png().toFile(output('../resources/splash.png'));
console.log('Ícones PWA e recursos Capacitor gerados.');
