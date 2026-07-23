const CACHE_NAME = 'awa-bakery-v5';
const urlsToCache = [
  './game.html',
  './style.css',
  './script.js',
  './assets/images/oven1.png',
  './assets/images/oven2.png',
  './assets/images/oven3.png',
  './assets/images/oven4.png',
  './assets/images/oven5.png',
  './assets/images/rolling pin.png',
  './assets/images/dough mixer.png',
  './assets/images/background.jpg',
  './assets/sounds/oven-timer.mp3',
  './assets/sounds/cash-register.mp3'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force activate new Service Worker
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Network-first strategy
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache the latest version
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(event.request);
      })
  );
});
