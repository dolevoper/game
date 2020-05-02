export const loadImage = path => new Promise((resolve, reject) => {
    const image = new Image();

    image.src = path;

    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
});