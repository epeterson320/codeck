var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  './',
  'index.html',
  'dist/bundle.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});
