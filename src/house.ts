import type { Position } from './position';
import type { TileBlock } from './tile-block';
import type { Collider } from './collider';
import { loadImage } from './core';
import * as sprite from './sprite'
import * as tileBlock from './tile-block';

import HouseWallTileset from './assets/AH_Autotile_House_Wall.png';

export interface House extends TileBlock {
    collider: Collider;
}

export async function load(): Promise<House> {
    const houseWallImage = await loadImage(HouseWallTileset);
    const position: Position = [10 * 16, 7 * 16];
    const width = 4;
    const height = 2;
    const tileSize = 16;

    const block = tileBlock.fromSprites(
        position,
        width,
        height,
        sprite.staticSprite(houseWallImage, tileSize, 0, 1),
        sprite.staticSprite(houseWallImage, tileSize, 0, 3),
        sprite.staticSprite(houseWallImage, tileSize, 2, 1),
        sprite.staticSprite(houseWallImage, tileSize, 2, 3),
        sprite.staticSprite(houseWallImage, tileSize, 0, 2),
        sprite.staticSprite(houseWallImage, tileSize, 1, 1),
        sprite.staticSprite(houseWallImage, tileSize, 1, 3),
        sprite.staticSprite(houseWallImage, tileSize, 2, 2),
        sprite.staticSprite(houseWallImage, tileSize, 1, 2)
    );

    return {
        ...block,
        collider: {
            position,
            width: width * tileSize,
            height: height * tileSize - (tileSize / 2)
        }
    }
}