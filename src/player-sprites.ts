import { loadImage } from './core';
import type { PlayerStateSprites } from './player';
import * as sprite from './sprite';
import * as animatedSprite from './animated-sprite';

import PeoplesImage from './assets/AH_SpriteSheet_People1.png';

export async function load(): Promise<PlayerStateSprites> {
    const peoplesImage = await loadImage(PeoplesImage);

    return {
        'facing down': sprite.fromImage(peoplesImage, 16, 0, 1),
        'walking down': animatedSprite.fromSprites([
            sprite.fromImage(peoplesImage, 16, 0, 1),
            sprite.fromImage(peoplesImage, 16, 0, 2),
            sprite.fromImage(peoplesImage, 16, 0, 1),
            sprite.fromImage(peoplesImage, 16, 0, 0)
        ], 0.5)
    };
}