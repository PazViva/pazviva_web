importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCoA578-geupYcEAXaqyFo6bCdI4frCp9U',
  authDomain: 'projeto-paz-viva-app.firebaseapp.com',
  projectId: 'projeto-paz-viva-app',
  storageBucket: 'projeto-paz-viva-app.firebasestorage.app',
  messagingSenderId: '288083484298',
  appId: '1:288083484298:web:fcf0e92f5171b8e8399773'
});

const messaging = firebase.messaging();

// Manipula mensagens em segundo plano
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title || 'Momento de Gratidão';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/gratitude-icon-192.png',
    badge: '/gratitude-icon-192.png',
    tag: 'gratitude-notification',
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'Ver Gratidões'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Cache dinâmico para funcionamento offline
const CACHE_NAME = 'gratitude-app-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/gratitude-icon-192.png',
        '/gratitude-icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});