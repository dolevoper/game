import type { ZipList } from './zip-list';
import type { Sprite } from './sprite';
import * as zipList from './zip-list';

export interface AnimatedSprite extends ZipList<Sprite> {
    frequency: number;
    step: number;
}

export function fromSprites(sprites: Sprite[], frequency: number = 1): AnimatedSprite {
    return {
        ...zipList.fromArray(sprites),
        frequency,
        step: 0
    };
}

export function mapFrequency(fn: Func<number, number>, sprite: AnimatedSprite): AnimatedSprite {
    return {
        ...sprite,
        frequency: fn(sprite.frequency)
    };
}

export function mapStep(step: number, sprite: AnimatedSprite): AnimatedSprite {
    const frameCount = zipList.length(sprite);
    const requiredStep = 1000 / frameCount * sprite.frequency;

    step += sprite.step;

    if (step < requiredStep) return { ...sprite, step };

    const currFrame = zipList.position(sprite);
    const nextFrame = (currFrame + Math.floor(step / requiredStep)) % frameCount;

    return {
        ...zipList.moveTo(nextFrame, sprite),
        frequency: sprite.frequency,
        step: step % requiredStep
    };
}

export function sprite(animation: AnimatedSprite): Sprite {
    return zipList.curr(animation);
}

type Func<T, U> = (param: T) => U;

// function always<T>(p: T): Func<T, T> { return () => p; }