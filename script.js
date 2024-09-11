const TOTAL_IMAGES = 27;

function createImageElement(index) {
    const picture = document.createElement('picture');

    // Crear el elemento source para AVIF
    const sourceAvif = document.createElement('source');
    sourceAvif.type = 'image/avif';
    sourceAvif.dataset.srcset = `images/${index}-low.avif 500w, images/${index}.avif 1000w`;
    sourceAvif.srcset = `images/${index}-low.avif 500w, images/${index}.avif 1000w`;

    // Crear el elemento source para WebP
    const sourceWebp = document.createElement('source');
    sourceWebp.type = 'image/webp';
    sourceWebp.dataset.srcset = `images/${index}-low.webp 500w, images/${index}.webp 1000w`;
    sourceWebp.srcset = `images/${index}-low.webp 500w, images/${index}.webp 1000w`;

    // Crear el elemento img con lazy loading
    const img = document.createElement('img');
    img.dataset.src = `images/${index}-low.webp`;
    img.dataset.fullsrc = `images/${index}.webp`;
    img.alt = `Imagen ${index}`;
    img.loading = "lazy";
    img.width = 500;
    img.height = 375;
    img.addEventListener('click', () => openFullscreen(index));

    // Agregar elementos al <picture>
    picture.appendChild(sourceAvif);
    picture.appendChild(sourceWebp);
    picture.appendChild(img);

    return picture;
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
        // Fallback para navegadores que no soportan IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}
