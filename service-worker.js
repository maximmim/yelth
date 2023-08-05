const CACHE_NAME = 'Yelt';
const STATIC_RESOURCES = [
  '/',
  '/html/index.html',
  '/html/menu.html',
  '/css/styles.css',
  '/js/script.js',
  '/img/logo.png',
  '/img/end.png',



  '/img/logdo.png',
  '/img/play.png',
  '/img/copy.png',
  '/img/exit.png',
  '/html/tables.html',
  '/html/createmap.html',
  '/img/stone.png',
  '/img/enemy.png',
  '/img/enemy_close.png',
  '/img/enemy_open.png',


  '/img/skins/skin_d1.png',
  '/img/skins/skin_d2.png',
  '/img/skins/skin_d3.png',
  '/img/skins/skin_d4.png',
  '/img/skins/skin_d5.png',
  '/img/skins/skin_d6.png',
  '/img/skins/playr_white.png',
  '/img/skins/skin.png',
  '/img/skins/benat_close.png',
  '/img/skins/benat_open.png',
  '/img/skins/kiril_d2.png',
  '/img/skins/kiril_d1.png',
  '/img/skins/alina_d2.png',
  '/img/skins/zayush.png',
  '/img/skins/zayush_d2.png',


  // Добавьте другие статические ресурсы, которые вы хотите кэшировать
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Загрузка всех статических ресурсов в кэш
      return cache.addAll(STATIC_RESOURCES);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST' || event.request.url.startsWith('chrome-extension://')) {
    // Игнорируем POST запросы и запросы с chrome-extension:// схемой
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        // Проверяем наличие обновленных ресурсов
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Клонируем полученный ответ, чтобы использовать его как ответ в сети и сохранить в кэше
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});
