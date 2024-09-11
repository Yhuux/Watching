const TOTAL_IMAGES = 27;

function createImageElement(index) {
    const picture = document.createElement('picture');
    
    // Crear fuentes para diferentes resoluciones
    const sourceAvif = document.createElement('source');
    sourceAvif.srcset = `images/${index}.avif`;
    sourceAvif.type = 'image/avif';
    picture.appendChild(sourceAvif);

    const sourceWebp = document.createElement('source');
    sourceWebp.srcset = `images/${index}.webp`;
    sourceWebp.type = 'image/webp';
    picture.appendChild(sourceWebp);

    const img = document.createElement('img');
    img.src = `images/${index}-low.webp`;
    img.dataset.fullsrc = `images/${index}.webp`;
    img.alt = `Imagen ${index}`;
    img.loading = 'lazy';
    img.addEventListener('click', () => openFullscreen(index));
    
    picture.appendChild(img);
    return picture;
}

function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.querySelector('img').src = img.querySelector('img').dataset.fullsrc;
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });
        document.querySelectorAll('picture').forEach(picture => observer.observe(picture));
    }
}

function openFullscreen(index) {
    const fullscreenDiv = document.getElementById('fullscreenImage');
    const fullscreenImg = fullscreenDiv.querySelector('img');
    fullscreenImg.src = `images/${index}.webp`;
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

document.addEventListener('DOMContentLoaded', initializeGallery);

// Comunicación con Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data === 'updateAvailable') {
            alert('Nueva versión disponible. Actualiza para obtener los últimos cambios.');
        }
    });
}