import type { ChestStateSprites } from './chest';
import { loadImage } from './core';
import * as sprite from './sprite'

import ObjectsTileset from './assets/AH_SpriteSheet_Objects.png';

export async function load(): Promise<ChestStateSprites> {
    const objectsImage = await loadImage(ObjectsTileset);

    return {
        close: sprite.staticSprite(objectsImage, 16, 0, 0),
        open: sprite.staticSprite(objectsImage, 16, 3, 0)
    };
}