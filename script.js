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

function openFullscreen(index) {
    const fullscreenDiv = document.getElementById('fullscreenImage');
    const fullscreenImg = fullscreenDiv.querySelector('img');
    fullscreenImg.src = `images/${index}.webp`;
    fullscreenDiv.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add opening animation
    fullscreenImg.style.opacity = '0';
    fullscreenImg.style.transform = 'scale(0.9)';
    setTimeout(() => {
        fullscreenImg.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
        fullscreenImg.style.opacity = '1';
        fullscreenImg.style.transform = 'scale(1)';
    }, 50);
}

function closeFullscreen() {
    const fullscreenDiv = document.getElementById('fullscreenImage');
    const fullscreenImg = fullscreenDiv.querySelector('img');
    
    // Add closing animation
    fullscreenImg.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
    fullscreenImg.style.opacity = '0';
    fullscreenImg.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        fullscreenDiv.style.display = 'none';
        document.body.style.overflow = 'auto';
        fullscreenImg.style.transition = '';
    }, 300);
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
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('ServiceWorker registered successfully:', registration.scope))
            .catch(error => console.log('ServiceWorker registration failed:', error));
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
