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

export function render(transform: DOMMatrix, sprite: Sprite): Renderer {
    return sprite.kind === 'static' ? renderStaticSprite(transform, sprite) : renderStaticSprite(transform, toStatic(sprite));
}

function renderStaticSprite(transform: DOMMatrix, { image, size, i, j }: StaticSprite): Renderer {
    return ctx => {
        const storedTransform = ctx.getTransform();

        ctx.transform(transform.a, transform.b, transform.c, transform.d, transform.e, transform.f);
        ctx.drawImage(
            image,
            j * size,
            i * size,
            size,
            size,
            0,
            0,
            size,
            size
        );

        ctx.setTransform(storedTransform);
    };
}

function toStatic(sprite: AnimatedSprite): StaticSprite {
    const [i, j] = zipList.curr(sprite);

    return staticSprite(sprite.image, sprite.size, i, j) as StaticSprite;
}