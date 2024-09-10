// Constantes
const CACHE_NAME = 'image-cache-v1';
const IMAGE_URLS = [
    'images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg', 'images/5.jpg',
    'images/6.jpg', 'images/7.jpg', 'images/8.jpg', 'images/9.jpg', 'images/10.jpg',
    'images/11.jpg', 'images/12.jpg', 'images/13.jpg', 'images/14.jpg', 'images/15.jpg',
    'images/16.jpg', 'images/17.jpg', 'images/18.jpg', 'images/19.jpg', 'images/20.jpg',
    'images/21.jpg', 'images/22.jpg', 'images/23.jpg', 'images/24.jpg', 'images/25.jpg',
    'images/26.jpg', 'images/27.jpg'
];

// Función para precargar imágenes en el caché
async function precacheImages() {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(IMAGE_URLS);
}

// Función para cargar una imagen desde el caché o la red
async function loadImage(src) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(src);
    
    if (cachedResponse) {
        return cachedResponse;
    }

    const networkResponse = await fetch(src);
    cache.put(src, networkResponse.clone());
    return networkResponse;
}

// Función para cargar imágenes de forma lazy
function lazyLoadImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                loadImage(src).then(response => response.blob())
                    .then(blob => {
                        const objectURL = URL.createObjectURL(blob);
                        img.src = objectURL;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    });
            }
        });
    }, { rootMargin: "0px 0px 200px 0px" });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Función para abrir imagen en pantalla completa
function openFullscreen(src) {
    const fullscreenDiv = document.getElementById('fullscreenImage');
    const fullscreenImg = fullscreenDiv.querySelector('img');
    
    loadImage(src)
        .then(response => response.blob())
        .then(blob => {
            const objectURL = URL.createObjectURL(blob);
            fullscreenImg.src = objectURL;
            fullscreenDiv.style.display = 'flex';
        });
}

// Función para cerrar imagen en pantalla completa
function closeFullscreen() {
    document.getElementById('fullscreenImage').style.display = 'none';
}

// Inicialización
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registrado con éxito:', registration.scope);
        }).catch(error => {
            console.log('Registro de ServiceWorker fallido:', error);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    precacheImages().then(() => {
        console.log('Imágenes precargadas con éxito');
    });
    lazyLoadImages();
});