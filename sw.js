const CACHE_NAME = 'marcel-amesti-cache-v3';
const TOTAL_IMAGES = 27;

const STATIC_ASSETS = [
    '/',
    'index.html',
    'style.css',
    'script.js'
];

const IMAGE_ASSETS = [
    ...Array.from({length: TOTAL_IMAGES}, (_, i) => `/images/${i + 1}.webp`),
    ...Array.from({length: TOTAL_IMAGES}, (_, i) => `/images/${i + 1}-low.webp`)
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // Cache static assets immediately
            cache.addAll(STATIC_ASSETS);
            // Cache image assets in the background
            cache.addAll(IMAGE_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Network-first strategy for API calls or dynamic content
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(event.request));
    } 
    // Cache-first strategy for static assets and images
    else if (STATIC_ASSETS.includes(url.pathname) || IMAGE_ASSETS.includes(url.pathname)) {
        event.respondWith(cacheFirst(event.request));
    }
    // Stale-while-revalidate for other requests
    else {
        event.respondWith(staleWhileRevalidate(event.request));
    }
});

function cacheFirst(request) {
    return caches.match(request)
        .then(response => response || fetchAndCache(request));
}

function networkFirst(request) {
    return fetch(request)
        .then(response => {
            if (response.ok) {
                return caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(request, response.clone());
                        return response;
                    });
            }
            throw new Error('Network response was not ok.');
        })
        .catch(() => caches.match(request));
}

function staleWhileRevalidate(request) {
    return caches.match(request)
        .then(cachedResponse => {
            const fetchPromise = fetch(request)
                .then(response => {
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(request, response.clone()));
                    return response;
                });
            return cachedResponse || fetchPromise;
        });
}

function fetchAndCache(request) {
    return fetch(request)
        .then(response => {
            if (response.ok) {
                caches.open(CACHE_NAME)
                    .then(cache => cache.put(request, response.clone()));
            }
            return response.clone();
        });
}
