import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  plugins:[react(),VitePWA({
    registerType:'prompt',
    includeAssets:['favicon.ico','icons/favicon-32.png','icons/apple-touch-icon.png'],
    manifest:{
      name:'Diagrama Pro',short_name:'Diagramas',description:'Editor pessoal de diagramas que funciona offline.',
      lang:'pt-BR',start_url:'/',scope:'/',display:'standalone',orientation:'any',
      theme_color:'#6558c9',background_color:'#f5f6f8',
      icons:[
        {src:'/icons/icon-192.png',sizes:'192x192',type:'image/png'},
        {src:'/icons/icon-512.png',sizes:'512x512',type:'image/png'},
        {src:'/icons/maskable-192.png',sizes:'192x192',type:'image/png',purpose:'maskable'},
        {src:'/icons/maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}
      ],
      shortcuts:[
        {name:'Novo mapa mental',short_name:'Mapa mental',url:'/?new=mindmap',icons:[{src:'/icons/icon-192.png',sizes:'192x192'}]},
        {name:'Novo fluxograma',short_name:'Fluxograma',url:'/?new=flowchart',icons:[{src:'/icons/icon-192.png',sizes:'192x192'}]},
        {name:'Meus diagramas',short_name:'Diagramas',url:'/?documents=1',icons:[{src:'/icons/icon-192.png',sizes:'192x192'}]}
      ],
      file_handlers:[{action:'/',accept:{'application/json':['.json','.diagrama.json']}}]
    },
    workbox:{navigateFallback:'/index.html',globPatterns:['**/*.{js,css,html,ico,png,svg,webmanifest,woff2}'],cleanupOutdatedCaches:true,clientsClaim:true,skipWaiting:false},
    devOptions:{enabled:false}
  })],
  server:{host:'0.0.0.0'},
  test:{environment:'jsdom',globals:true}
});