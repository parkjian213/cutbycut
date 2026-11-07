// 네트워크를 3초까지 기다리고, 안 되면 저장해 둔 앱을 연다. 와이파이·데이터가 없어도 열린다.
const C="cutbycut-30";const F=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 const q=e.request;if(q.method!=="GET"||new URL(q.url).origin!==location.origin)return;
 const cached=()=>caches.match(q,{ignoreSearch:true}).then(m=>m||caches.match("./index.html"));
 const net=fetch(q).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(q,c))}return r});
 e.respondWith(new Promise(res=>{let done=false;const t=setTimeout(()=>{cached().then(m=>{if(m&&!done){done=true;res(m)}})},3000);
  net.then(r=>{if(!done){done=true;clearTimeout(t);res(r)}}).catch(()=>{clearTimeout(t);cached().then(m=>{if(!done){done=true;res(m||Response.error())}})})}));
});
