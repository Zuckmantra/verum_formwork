let carruselImages = document.querySelectorAll('#carrusel_images img');
let mainImage = document.querySelector('.visor_image');
let leftArrow = document.querySelector('.left-arrow');
let rightArrow = document.querySelector('.right-arrow');
let currentIndex = 0;

rightArrow.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex >= carruselImages.length) {
        currentIndex = 0;
    }
    updateMainImage();
});

leftArrow.addEventListener('click', () => {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = carruselImages.length - 1;
    }
    updateMainImage();
});

function updateMainImage() {
    mainImage.src = carruselImages[currentIndex].src;
}