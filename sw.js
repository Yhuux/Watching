const CACHE_NAME = 'marcel-amesti-cache-v5';
const ASSETS_CACHE = 'assets-cache-v2';
const IMAGES_CACHE = 'images-cache-v2';
const TOTAL_IMAGES = 27;

const STATIC_ASSETS = [
    '/',
    'index.html',
    'style.css',
    'script.js'
];

const IMAGE_ASSETS = [
    ...Array.from({ length: TOTAL_IMAGES }, (_, i) => `/images/${i + 1}.webp`),
    ...Array.from({ length: TOTAL_IMAGES }, (_, i) => `/images/${i + 1}-low.webp`),
    ...Array.from({ length: TOTAL_IMAGES }, (_, i) => `/images/${i + 1}.avif`),
    ...Array.from({ length: TOTAL_IMAGES }, (_, i) => `/images/${i + 1}-low.avif`)
];

self.addEventListener('install', event => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(ASSETS_CACHE);
            await cache.addAll(STATIC_ASSETS);
            const imageCache = await caches.open(IMAGES_CACHE);
            await imageCache.addAll(IMAGE_ASSETS);
            self.skipWaiting();
        })()
    );
});

self.addEventListener('