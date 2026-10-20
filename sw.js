/* 중1 문제은행 PWA Service Worker — SRF 앱과 같은 방식
   네트워크 우선 + 캐시 폴백 (오프라인에서도 마지막으로 받은 화면으로 문제 풀이 가능). */
const CACHE = 'exam-app-v17';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Firebase·폰트 등 외부 요청은 항상 네트워크
  e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); return res; }).catch(() => caches.match(req)));
});
