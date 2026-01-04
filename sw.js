
const CACHE_NAME = 'love-app-v8';
const ASSETS = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://img.icons8.com/emoji/512/orange-heart.png',
  'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3',
  'https://images.unsplash.com/photo-1518568814500-bf5f8ca12f69?auto=format&fit=crop&w=1000&h=500&q=80',
  'https://img.icons8.com/ios-filled/96/ffffff/like.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        }),
        self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Manejo avanzado de notificaciones y botones
self.addEventListener('notificationclick', (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Si hacen clic en "Ver Mensaje" o en el cuerpo de la notificación
  if (event.action === 'open' || !event.action) {
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
          if (clientList.length > 0) {
            let client = clientList[0];
            for (let i = 0; i < clientList.length; i++) {
              if (clientList[i].focused) {
                client = clientList[i];
              }
            }
            return client.focus();
          }
          return clients.openWindow('./');
        })
      );
  } 
  // Si hacen clic en "Te Amo" (Podríamos agregar lógica aquí para registrarlo, por ahora solo cierra y enfoca)
  else if (event.action === 'love') {
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow('./');
        })
      );
  }
});
