import type { AnimatedSprite } from './animated-sprite';
import { loadImage } from './core';
import * as animatedSprite from './animated-sprite';
import * as sprite from './sprite';

import PeoplesImage from './assets/AH_SpriteSheet_People1.png';

export async function load(): Promise<AnimatedSprite> {
    const peoplesImage = await loadImage(PeoplesImage);

    return animatedSprite.fromSprites([
        sprite.fromImage(peoplesImage, 16, 0, 1),
        sprite.fromImage(peoplesImage, 16, 0, 2),
        sprite.fromImage(peoplesImage, 16, 0, 1),
        sprite.fromImage(peoplesImage, 16, 0, 0)
    ], 0.5);
}