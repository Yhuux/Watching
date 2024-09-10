const CACHE_NAME = 'marcel-amesti-cache-v4';
const ASSETS_CACHE = 'assets-cache-v1';
const IMAGES_CACHE = 'images-cache-v1';
const TOTAL_IMAGES = 27;

const STATIC_ASSETS = [
    '/',
    'index.html',
    'style.css',
    'script.js'
];

const IMAGE_ASSETS = [
    ...Array.from({ length: TOTAL_IMAGES }, (_, i) => `/images/${i + 1}.webp`),
    ...Array.from({ length: TOTAL_IMAGES }, (_, i) => `/images/${i + 1}-low.webp`)
];

// Instalar y almacenar en caché los recursos críticos
self.addEventListener('install', event => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(ASSETS_CACHE);
            await cache.addAll(STATIC_ASSETS);
            // Cargar imágenes en segundo plano
            const imageCache = await caches.open(IMAGES_CACHE);
            await imageCache.addAll(IMAGE_ASSETS);
            self.skipWaiting();
        })()
    );
});

// Activar y limpiar cachés obsoletos
self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => {
                    if (![CACHE_NAME, ASSETS_CACHE, IMAGES_CACHE].includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
            self.clients.claim();
        })()
    );
});

// Estrategia avanzada de fetch
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Network-first para API
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(event.request));
    }
    // Cache-first para recursos estáticos y estratégicamente cargados
    else if (STATIC_ASSETS.includes(url.pathname)) {
        event.respondWith(cacheFirst(event.request, ASSETS_CACHE));
    }
    // Cache con 'stale-while-revalidate' para imágenes
    else if (IMAGE_ASSETS.includes(url.pathname)) {
        event.respondWith(staleWhileRevalidate(event.request, IMAGES_CACHE));
    }
});

// Cache-first para recursos estáticos
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    return cachedResponse || fetchAndCache(request, cacheName);
}

// Network-first para recursos dinámicos
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        return caches.match(request);
    }
}

// Stale-while-revalidate para imágenes o recursos de baja prioridad
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    const fetchPromise = fetch(request).then(networkResponse => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
    });
    return cachedResponse || fetchPromise;
}

// Cachear y devolver recursos
async function fetchAndCache(request, cacheName) {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
    }
    return networkResponse;
}