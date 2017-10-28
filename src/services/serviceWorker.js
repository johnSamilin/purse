const version = 'v1.0.5';
const precachedUrls = [
  '/bootstrap.min.css',
  '/giphy-downsized.gif',
  '/loader.gif',
  '/app.js',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(version).then(function(cache) {
      return cache.addAll(precachedUrls);
    })
  );
});

self.addEventListener('fetch', function(event) {    
    event.respondWith(
      caches.open(version)
        .then((cache) => {
          cache.match(event.request)
            .then((response) => {
              return response || fetch(event.request)
                .then(res => {
                  cache.add(res);
                });
            })
        })
    );
});