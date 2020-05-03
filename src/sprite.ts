import { Renderer } from './core';
import * as zipList from './zip-list';

export interface Sprite {
    image: CanvasImageSource;
    frameSize: number;
    state: zipList.ZipList<[number, number]>;
    frequency: number;
    step: number;
}

export function sprite(image: CanvasImageSource, frameSize: number, frames: [number, number][], frequency: number = 1): Sprite {
    return {
        image,
        frameSize,
        state: zipList.fromArray(frames),
        frequency,
        step: 0
    };
}

export function updateSprite(sprite: Sprite, step: number): Sprite {
    const frameCount = zipList.length(sprite.state);
    const requiredStep = 1000 / frameCount * sprite.frequency;

    step += sprite.step;

    if (step < requiredStep) return {
        ...sprite,
        step
    };

    const currFrame = zipList.position(sprite.state);
    const nextFrame = (currFrame + Math.floor(step / requiredStep)) % frameCount;

    return {
        ...sprite,
        state: zipList.moveTo(nextFrame, sprite.state),
        step: step % requiredStep
    };
}

export function renderSprite(sprite: Sprite, x: number, y: number): Renderer {
    const [i, j] = zipList.curr(sprite.state);
    
    return ctx => ctx.drawImage(
        sprite.image,
        j * sprite.frameSize,
        i * sprite.frameSize,
        sprite.frameSize,
        sprite.frameSize,
        x * sprite.frameSize,
        y * sprite.frameSize,
        sprite.frameSize,
        sprite.frameSize
    );
}