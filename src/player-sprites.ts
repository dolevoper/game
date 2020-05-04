import { loadImage } from './core';
import type { PlayerStateSprites } from './player';
import * as sprite from './sprite';

import PeoplesImage from './assets/AH_SpriteSheet_People1.png';

export async function load(): Promise<PlayerStateSprites> {
    const peoplesImage = await loadImage(PeoplesImage);

    return {
        'facing down': sprite.staticSprite(peoplesImage, 16, 0, 1),
        'facing up': sprite.staticSprite(peoplesImage, 16, 3, 1),
        'facing left': sprite.staticSprite(peoplesImage, 16, 1, 1),
        'facing right': sprite.staticSprite(peoplesImage, 16, 2, 1),
        'walking down': sprite.animatedSprite(peoplesImage, 16, [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 1]
        ], 0.5),
        'walking up': sprite.animatedSprite(peoplesImage, 16, [
            [3, 0],
            [3, 1],
            [3, 2],
            [3, 1]
        ], 0.5),
        'walking left': sprite.animatedSprite(peoplesImage, 16, [
            [1, 0],
            [1, 1],
            [1, 2],
            [1, 1]
        ], 0.5),
        'walking right': sprite.animatedSprite(peoplesImage, 16, [
            [2, 0],
            [2, 1],
            [2, 2],
            [2, 1]
        ], 0.5)
    };
}