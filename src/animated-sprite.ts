import { Renderer } from './core';
import type { ZipList } from './zip-list';
import type { Sprite } from './sprite';
import * as zipList from './zip-list';
import * as sprite from './sprite';

export interface AnimatedSprite extends ZipList<Sprite> {
    frequency: number;
    step: number;
}

export function isAnimatedSprite(s: any): s is AnimatedSprite {
    return !isNaN(s.frequency);
}

export function fromSprites(s: Sprite[], frequency: number = 1): AnimatedSprite {
    return {
        ...zipList.fromArray(s),
        frequency,
        step: 0
    };
}

export function mapFrequency(fn: Func<number, number>, s: AnimatedSprite): AnimatedSprite {
    return {
        ...s,
        frequency: fn(s.frequency)
    };
}

export function mapStep(step: number, s: AnimatedSprite): AnimatedSprite {
    const frameCount = zipList.length(s);
    const requiredStep = 1000 / frameCount * s.frequency;

    step += s.step;

    if (step < requiredStep) return { ...s, step };

    const currFrame = zipList.position(s);
    const nextFrame = (currFrame + Math.floor(step / requiredStep)) % frameCount;

    return {
        ...zipList.moveTo(nextFrame, s),
        frequency: s.frequency,
        step: step % requiredStep
    };
}

export function render(s: AnimatedSprite, x: number, y: number): Renderer {
    return sprite.render(s.curr, x, y);
}

type Func<T, U> = (param: T) => U;

// function always<T>(p: T): Func<T, T> { return () => p; }