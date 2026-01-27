const CACHE="ultra-v1";
const ASSETS=["./","./index.html","./manifest.webmanifest","./sw.js","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(ASSETS);self.skipWaiting();})()));
self.addEventListener("activate",e=>e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.map(k=>k===CACHE?null:caches.delete(k)));await self.clients.claim();})()));
self.addEventListener("fetch",e=>{
  const req=e.request;
  if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;
  const isHTML=req.headers.get("accept")?.includes("text/html");
  if(isHTML){
    e.respondWith((async()=>{try{const fresh=await fetch(req);(await caches.open(CACHE)).put(req,fresh.clone());return fresh;}catch{return (await caches.match(req))||(await caches.match("./index.html"));}})());
    return;
  }
  e.respondWith((async()=>{const cached=await caches.match(req);if(cached) return cached;const fresh=await fetch(req);(await caches.open(CACHE)).put(req,fresh.clone());return fresh;})());
});
