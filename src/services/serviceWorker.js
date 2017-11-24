const version = 'v1.0.9';
const baseUrl = 'https://purseapp.herokuapp.com';
const precachedUrls = [
  '/',
  '/index.html',
  '/bootstrap.min.css',
  '/giphy-downsized.gif',
  '/loader.gif',
  '/app.js',
  '/app.css',
  '/vendor.js',
  '/material_icons.woff2',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(version).then(function(cache) {
      return cache.addAll(precachedUrls);
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (precachedUrls.includes(event.request.url.substr(baseUrl.length))) {
    event.respondWith(
      caches.open(version)
        .then((cache) => {
          cache.match(event.request)
            .then((response) => {
              return response || fetch(event.request);
            })
        })
    );
  }
});
