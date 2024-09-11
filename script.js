const TOTAL_IMAGES = 27;

function createImageElement(index) {
    const img = document.createElement('img');
    img.dataset.src = `images/${index}-low.webp`;
    img.dataset.fullsrc = `images/${index}.webp`;
    img.alt = `Imagem ${index}`;
    img.loading = "lazy";
    img.addEventListener('click', () => openFullscreen(index));
    return img;
}

function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
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
        }, { rootMargin: "200px" });

        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

function openFullscreen(index) {
    const fullscreenDiv = document.getElementById('fullscreenImage');
    const fullscreenImg = fullscreenDiv.querySelector('img');
    
    fullscreenImg.src = `images/${index}.webp`;
    fullscreenDiv.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Animación de apertura
    animateFullscreenImage(fullscreenImg, 0, 0.9, 1, 1);
}

function closeFullscreen() {
    const fullscreenDiv = document.getElementById('fullscreenImage');
    const fullscreenImg = fullscreenDiv.querySelector('img');

    // Animación de cierre
    animateFullscreenImage(fullscreenImg, 1, 1, 0, 0.9);

    setTimeout(() => {
        fullscreenDiv.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function animateFullscreenImage(img, initialOpacity, initialScale, finalOpacity, finalScale) {
    img.style.opacity = initialOpacity;
    img.style.transform = `scale(${initialScale})`;
    requestAnimationFrame(() => {
        img.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
        img.style.opacity = finalOpacity;
        img.style.transform = `scale(${finalScale})`;
    });
}

function initializeGallery() {
    const gallery = document.getElementById('imageGallery');
    const fragment = document.createDocumentFragment();
    for (let i = 1; i <= TOTAL_IMAGES; i++) {
        fragment.appendChild(createImageElement(i));
    }
    gallery.appendChild(fragment);
    lazyLoadImages();
}

function initializeMetaverse() {
    const enterMetaverseButton = document.getElementById('enterMetaverse');
    const metaverseContainer = document.getElementById('metaverseContainer');

    if (enterMetaverseButton && metaverseContainer) {
        enterMetaverseButton.addEventListener('click', (e) => {
            e.preventDefault();
            metaverseContainer.style.display = 'block';
            metaverseContainer.innerHTML = '<h2>Welcome to the Metaverse!</h2><p>This is where the 3D gallery would be loaded.</p>';
        });
    }
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered successfully:', registration.scope);

                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Nueva versión disponible, mostrar prompt de recarga
                                if (confirm('Nova versão disponível! Deseja atualizar?')) {
                                    window.location.reload();
                                }
                            }
                        });
                    });
                })
                .catch(error => console.log('Falha ao registrar ServiceWorker:', error));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
    initializeMetaverse();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFullscreen();
    }
});

window.addEventListener('load', registerServiceWorker); a
