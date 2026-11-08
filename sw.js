// AgriVision PWA Service Worker - Offline Cache Manager
const CACHE_NAME = 'agrivision-v1.4.3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './manifest.json',
  './libs/three.min.js',
  './libs/OrbitControls.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './data/database.json',
  './js/db.js',
  './js/auth.js',
  './js/app.js',
  './js/planner2d.js',
  './js/planner3d.js',
  './js/method_optimizer.js',
  './js/crop_advisor.js',
  './js/disease_scanner.js',
  './js/iot_controller.js',
  './js/weather_calendar.js',
  './js/telugu_voice.js',
  './js/profile.js',
  './images/crops/chili.jpg',
  './images/crops/guava.jpg',
  './images/crops/millet.jpg',
  './images/crops/mango.jpg',
  './images/crops/paddy.jpg',
  './images/fertilizers/vermicompost.jpg',
  './images/fertilizers/neem_cake.jpg',
  './images/fertilizers/npk_granules.jpg',
  './images/fertilizers/jeevamrutham.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Purging stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // 1. Always bypass cache for dynamic API routes
  if (event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2. Network-First strategy for HTML, CSS, and JS so deployments reflect immediately
  const isCodeAsset = event.request.mode === 'navigate' ||
                      event.request.url.includes('.html') ||
                      event.request.url.includes('.css') ||
                      event.request.url.includes('.js');

  if (isCodeAsset) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 3. Cache-First with Network fallback for static images, models, and icons
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
