import { Renderer } from './core';

export interface Sprite {
    image: CanvasImageSource;
    size: number;
    i: number;
    j: number;
}

export function fromImage(image: CanvasImageSource, size: number, i: number, j: number): Sprite {
    return { image, size, i, j };
}

export function render({ image, size, i, j }: Sprite, x: number, y: number): Renderer {
    return ctx => ctx.drawImage(
        image,
        j * size,
        i * size,
        size,
        size,
        x,
        y,
        size,
        size
    );
}

export function renderOnGrid(sprite: Sprite, x: number, y: number): Renderer {
    return render(sprite, x * sprite.size, y * sprite.size);
}