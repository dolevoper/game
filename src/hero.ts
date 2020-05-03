import { loadImage } from './core';
import { Sprite, sprite } from './sprite';
import PeoplesImage from './assets/AH_SpriteSheet_People1.png';

export async function load(): Promise<Sprite> {
    const peoplesImage = await loadImage(PeoplesImage);

    return sprite(peoplesImage, 16, [
        [0, 1],
        [0, 2],
        [0, 1],
        [0, 0]
    ], 0.5);
}