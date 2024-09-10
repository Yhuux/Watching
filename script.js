const TOTAL_IMAGES = 27;

function createImageElement(index) {
    const img = document.createElement('img');
    img.dataset.src = `images/${index}.jpg`;
    img.alt = `Imagem ${index}`;
    img.addEventListener('click', () => openFullscreen(`images/${index}.jpg`));
    return img;
}

function lazyLoadImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                img.src = src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "0px 0px 200px 0px" });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

function openFullscreen(src) {
    const fullscreenDiv = document.getElementById('fullscreenImage');
    const fullscreenImg = fullscreenDiv.querySelector('img');
    fullscreenImg.src = src;
    fullscreenDiv.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
    const fullscreenDiv = document.getElementById('fullscreenImage');
    fullscreenDiv.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function initializeGallery() {
    const gallery = document.getElementById('imageGallery');
    for (let i = 1; i <= TOTAL_IMAGES; i++) {
        gallery.appendChild(createImageElement(i));
    }
    lazyLoadImages();
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('ServiceWorker registrado con éxito:', registration.scope))
            .catch(error => console.log('Registro de ServiceWorker fallido:', error));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
    registerServiceWorker();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFullscreen();
    }
});