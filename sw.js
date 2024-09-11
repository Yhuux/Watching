const CACHE_NAME = 'marcel-amesti-cache-v5';
const ASSETS_CACHE = 'assets-cache-v2';
const IMAGES_CACHE = 'images-cache-v2';
const TOTAL_IMAGES = 27;

const STATIC_ASSETS = ['/', 'index.html', 'style.css', 'script.js'];

const IMAGE_ASSETS = Array.from({ length: TOTAL_IMAGES }, (_, i) => `/images/${i + 1}.webp`);

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(ASSETS_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (STATIC_ASSETS.includes(new URL(event.request.url).pathname)) {
        event.respondWith(caches.match(event.request));
    } else if (IMAGE_ASSETS.includes(new URL(event.request.url).pathname)) {
        event.respondWith(staleWhileRevalidate(event.request, IMAGES_CACHE));
    }
});

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    const fetchPromise = fetch(request).then(networkResponse => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
    });
    return cachedResponse || fetchPromise;
}