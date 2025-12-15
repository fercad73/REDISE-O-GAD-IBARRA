// Service Worker para GAD Ibarra
const CACHE_NAME = 'gad-ibarra-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación y limpieza de caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia: Cache First, Network Fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve del cache si existe
        if (response) {
          return response;
        }
        
        // Si no está en cache, haz la petición
        return fetch(event.request).then(response => {
          // Verifica si la respuesta es válida
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clona la respuesta para guardarla en cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Fallback para offline
        if (event.request.url.includes('.html')) {
          return caches.match('/index.html');
        }
        return new Response('Estás offline. Por favor, verifica tu conexión.');
      })
  );
});