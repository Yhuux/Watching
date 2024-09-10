const TOTAL_IMAGES = 27;

function createImageElement(index) {
    const img = document.createElement('img');
    img.dataset.src = `images/${index}.webp`;
    img.alt = `Imagem ${index}`;
    img.loading = "lazy";
    img.addEventListener('click', () => openFullscreen(`images/${index}.webp`));
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
    }, { rootMargin: "200px" });

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

    enterMetaverseButton.addEventListener('click', (e) => {
        e.preventDefault();
        metaverseContainer.style.display = 'block';
        // Aquí iría la lógica para cargar y mostrar el metaverse
        // Por ahora, solo mostraremos un mensaje
        metaverseContainer.innerHTML = '<h2>Welcome to the Metaverse!</h2><p>This is where the 3D gallery would be loaded.</p>';
    });
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('ServiceWorker registrado con éxito:', registration.scope))
            .catch(error => console.log('Registro de ServiceWorker fallido:', error));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
    initializeMetaverse();
    registerServiceWorker();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFullscreen();
    }
});
