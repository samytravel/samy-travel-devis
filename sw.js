const CACHE_NAME = 'samy-travel-v5';
const ASSETS = [
  '/samy-travel-devis/',
  '/samy-travel-devis/index.html',
  '/samy-travel-devis/css/style.css',
  '/samy-travel-devis/js/app.js',
  '/samy-travel-devis/images/logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Installation : mise en cache de tous les assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activation : suppression des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch : cache en priorité, réseau en fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // Si offline et page non cachée, retourner index.html
        if (event.request.destination === 'document') {
          return caches.match('/samy-travel-devis/index.html');
        }
      });
    })
  );
});
