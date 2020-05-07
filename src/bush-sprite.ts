import type { Sprite } from './sprite';
import { loadImage } from './core';
import * as sprite from './sprite'

import ObjectsTileset from './assets/AH_Tileset.png';

export async function load(): Promise<Sprite> {
    const objectsImage = await loadImage(ObjectsTileset);

    return sprite.staticSprite(objectsImage, 16, 5, 0);
}