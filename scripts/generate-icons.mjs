import sharp from 'sharp';
import { mkdir,readFile } from 'node:fs/promises';
const svg=await readFile(new URL('../resources/icon.svg',import.meta.url));
await mkdir(new URL('../public/icons/',import.meta.url),{recursive:true});
await mkdir(new URL('../resources/',import.meta.url),{recursive:true});
async function make(path,size,padding=0){const inner=size-2*padding;const png=await sharp(svg).resize(inner,inner).extend({top:padding,bottom:padding,left:padding,right:padding,background:{r:101,g:88,b:201,alpha:1}}).png().toBuffer();await sharp(png).resize(size,size).png().toFile(path);}
await make(new URL('../public/icons/icon-192.png',import.meta.url),192);
await make(new URL('../public/icons/icon-512.png',import.meta.url),512);
await make(new URL('../public/icons/maskable-192.png',import.meta.url),192,20);
await make(new URL('../public/icons/maskable-512.png',import.meta.url),512,52);
await make(new URL('../public/icons/apple-touch-icon.png',import.meta.url),180,0);
await make(new URL('../public/icons/favicon-32.png',import.meta.url),32,0);
await make(new URL('../resources/icon.png',import.meta.url),1024,0);
const splash=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732"><rect width="100%" height="100%" fill="#f5f6f8"/><rect x="1091" y="1091" width="550" height="550" rx="120" fill="#6558c9"/><path d="M1366 1220v90m0 0-120 90m120-90 120 90" stroke="#fff" stroke-width="30" stroke-linecap="round"/><g fill="#fff"><rect x="1300" y="1140" width="132" height="80" rx="18"/><rect x="1155" y="1400" width="160" height="110" rx="20"/><rect x="1417" y="1400" width="160" height="110" rx="20"/></g></svg>');
await sharp(splash).png().toFile(new URL('../resources/splash.png',import.meta.url));
console.log('Ícones PWA e recursos Capacitor gerados.');
