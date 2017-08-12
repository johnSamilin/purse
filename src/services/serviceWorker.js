self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/bootstrap.min.css',
        '/giphy-downsized.gif',
        '/200w_d.gif',
        '/app.js?v=1.0',
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
});
