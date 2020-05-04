import { loadImage } from './core';
import type { PlayerStateSprites } from './player';
import * as sprite from './sprite';
import * as animatedSprite from './animated-sprite';

import PeoplesImage from './assets/AH_SpriteSheet_People1.png';

export async function load(): Promise<PlayerStateSprites> {
    const peoplesImage = await loadImage(PeoplesImage);

    return {
        'facing down': sprite.fromImage(peoplesImage, 16, 0, 1),
        'facing up': sprite.fromImage(peoplesImage, 16, 3, 1),
        'facing left': sprite.fromImage(peoplesImage, 16, 1, 1),
        'facing right': sprite.fromImage(peoplesImage, 16, 2, 1),
        'walking down': animatedSprite.fromSprites([
            sprite.fromImage(peoplesImage, 16, 0, 0),
            sprite.fromImage(peoplesImage, 16, 0, 1),
            sprite.fromImage(peoplesImage, 16, 0, 2),
            sprite.fromImage(peoplesImage, 16, 0, 1)
        ], 0.5),
        'walking up': animatedSprite.fromSprites([
            sprite.fromImage(peoplesImage, 16, 3, 0),
            sprite.fromImage(peoplesImage, 16, 3, 1),
            sprite.fromImage(peoplesImage, 16, 3, 2),
            sprite.fromImage(peoplesImage, 16, 3, 1)
        ], 0.5),
        'walking left': animatedSprite.fromSprites([
            sprite.fromImage(peoplesImage, 16, 1, 0),
            sprite.fromImage(peoplesImage, 16, 1, 1),
            sprite.fromImage(peoplesImage, 16, 1, 2),
            sprite.fromImage(peoplesImage, 16, 1, 1)
        ], 0.5),
        'walking right': animatedSprite.fromSprites([
            sprite.fromImage(peoplesImage, 16, 2, 0),
            sprite.fromImage(peoplesImage, 16, 2, 1),
            sprite.fromImage(peoplesImage, 16, 2, 2),
            sprite.fromImage(peoplesImage, 16, 2, 1)
        ], 0.5)
    };
}