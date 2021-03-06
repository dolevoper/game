export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.src = src;

        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', reject);
    });
}