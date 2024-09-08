function openFullscreen(src) {
    const fullscreenDiv = document.getElementById('fullscreenImage');
    const fullscreenImg = fullscreenDiv.querySelector('img');
    fullscreenImg.src = src;
    fullscreenDiv.style.display = 'flex';
}

function closeFullscreen() {
    document.getElementById('fullscreenImage').style.display = 'none';
}
