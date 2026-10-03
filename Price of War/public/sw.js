// Minimal service worker — its only job is to exist, so the browser considers this
// site an installable PWA. It caches nothing beyond a light shell and just falls back
// to the network for everything, so it never risks serving stale game code.
const CACHE_NAME = 'price-of-war-shell-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
