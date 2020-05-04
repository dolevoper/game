import type { Renderer } from './rendering';
import type { Position } from './position';
import type { ZipList } from './zip-list';
import * as zipList from './zip-list';

interface StaticSprite {
    kind: 'static';
    image: CanvasImageSource;
    size: number;
    i: number;
    j: number;
}

interface AnimatedSprite extends ZipList<Position> {
    kind: 'animated';
    image: CanvasImageSource;
    size: number;
    frequency: number;
    step: number;
}

export type Sprite = StaticSprite | AnimatedSprite;

export function staticSprite(image: CanvasImageSource, size: number, i: number, j: number): Sprite {
    return {
        kind: 'static',
        image,
        size,
        i,
        j
    };
}

export function animatedSprite(image: CanvasImageSource, size: number, frames: Position[], frequency: number = 1): Sprite {
    return {
        kind: 'animated',
        ...zipList.fromArray(frames),
        image,
        size,
        frequency,
        step: 0
    };
}

export function mapStep(step: number, sprite: Sprite): Sprite {
    if (sprite.kind === 'static') return sprite;

    const frameCount = zipList.length(sprite);
    const requiredStep = 1000 / frameCount * sprite.frequency;

    step += sprite.step;

    if (step < requiredStep) return { ...sprite, step };

    const currFrame = zipList.position(sprite);
    const nextFrame = (currFrame + Math.floor(step / requiredStep)) % frameCount;

    return {
        ...sprite,
        ...zipList.moveTo(nextFrame, sprite),
        step: step % requiredStep
    };
}

export function render(sprite: Sprite, x: number, y: number): Renderer {
    return sprite.kind === 'static' ? renderStaticSprite(sprite, x, y) : renderStaticSprite(toStatic(sprite), x, y);
}

function renderStaticSprite({ image, size, i, j }: StaticSprite, x: number, y: number): Renderer {
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

function toStatic(sprite: AnimatedSprite): StaticSprite {
    const [i, j] = zipList.curr(sprite);

    return {
        kind: 'static',
        image: sprite.image,
        size: sprite.size,
        i,
        j
    };
}