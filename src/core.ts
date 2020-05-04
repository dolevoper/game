export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.src = src;

        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', reject);
    });
}

export type Renderer = (ctx: CanvasRenderingContext2D) => void;

export function renderSolidBackground(color: string): Renderer {
    return ctx => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 900, 900)
    };
}

export type InputState = { [k: number]: boolean };