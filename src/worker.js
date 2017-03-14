export default function installServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          // Registration was successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch((err) => {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
}
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/static/style.css',
  'https://unpkg.com/big.js@3.1.3/big.min.js',
  'https://unpkg.com/d3@4.7.1/build/d3.min.js',
  '/dist/bundle.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
