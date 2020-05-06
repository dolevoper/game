import type { TileBlock } from './tile-block';
import { loadImage } from './core';
import * as sprite from './sprite'
import * as tileBlock from './tile-block';

import HouseWallTileset from './assets/AH_Autotile_House_Wall.png';

export async function load(): Promise<TileBlock> {
    const houseWallImage = await loadImage(HouseWallTileset);

    return tileBlock.fromSprites(
        [10 * 16, 7 * 16],
        4,
        2,
        sprite.staticSprite(houseWallImage, 16, 0, 1),
        sprite.staticSprite(houseWallImage, 16, 0, 3),
        sprite.staticSprite(houseWallImage, 16, 2, 1),
        sprite.staticSprite(houseWallImage, 16, 2, 3),
        sprite.staticSprite(houseWallImage, 16, 0, 2),
        sprite.staticSprite(houseWallImage, 16, 1, 1),
        sprite.staticSprite(houseWallImage, 16, 1, 3),
        sprite.staticSprite(houseWallImage, 16, 2, 2),
        sprite.staticSprite(houseWallImage, 16, 1, 2)
    );
}