import type { TileGrid } from './tile-grid';
import type { Collider } from './collider';
import { loadImage } from './core';
import * as sprite from './sprite'
import * as tileGrid from './tile-grid';
import * as collider from './collider';

import GrassTileset from './assets/AH_Autotile_Grass.png';
import HouseWallTileset from './assets/AH_Autotile_House_Wall.png';
import HouseRoofTileset from './assets/AH_Autotile_House_Roof.png';

export async function load(): Promise<{ layer1: TileGrid, layer2: TileGrid, colliders: Collider[] }> {
    const tileSize = 16;
    const [grassImage, houseWallImage, houseRoofImage] = await Promise.all([
        loadImage(GrassTileset),
        loadImage(HouseWallTileset),
        loadImage(HouseRoofTileset)
    ]);

    const layer1 = tileGrid.fromTileset(tileSize, [
        sprite.staticSprite(grassImage, tileSize, 0, 8),
        sprite.staticSprite(grassImage, tileSize, 0, 11),
        sprite.staticSprite(grassImage, tileSize, 3, 8),
        sprite.staticSprite(grassImage, tileSize, 3, 11),
        sprite.staticSprite(grassImage, tileSize, 0, 10),
        sprite.staticSprite(grassImage, tileSize, 1, 8),
        sprite.staticSprite(grassImage, tileSize, 2, 11),
        sprite.staticSprite(grassImage, tileSize, 3, 9),
        sprite.staticSprite(grassImage, tileSize, 2, 9),
        sprite.staticSprite(houseWallImage, tileSize, 0, 1),
        sprite.staticSprite(houseWallImage, tileSize, 0, 3),
        sprite.staticSprite(houseWallImage, tileSize, 2, 1),
        sprite.staticSprite(houseWallImage, tileSize, 2, 3),
        sprite.staticSprite(houseWallImage, tileSize, 0, 2),
        sprite.staticSprite(houseWallImage, tileSize, 1, 1),
        sprite.staticSprite(houseWallImage, tileSize, 1, 3),
        sprite.staticSprite(houseWallImage, tileSize, 2, 2),
        sprite.staticSprite(houseWallImage, tileSize, 1, 2),
        sprite.staticSprite(houseRoofImage, tileSize, 3, 8),
        sprite.staticSprite(houseRoofImage, tileSize, 3, 11),
        sprite.staticSprite(houseRoofImage, tileSize, 3, 9)
    ], `0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,18,20,20,19,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,9,13,13,10,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,14,17,17,15,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,11,16,16,12,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
        2,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,3`);

    const layer2 = tileGrid.build([
        tileGrid.tile(sprite.staticSprite(houseRoofImage, tileSize, 0, 8), [10, 5]),
        tileGrid.fill(sprite.staticSprite(houseRoofImage, tileSize, 0, 9), [11, 5], 2, 1),
        tileGrid.tile(sprite.staticSprite(houseRoofImage, tileSize, 0, 11), [13, 5])
    ], tileGrid.empty(tileSize, 20, 20));

    return {
        layer1,
        layer2,
        colliders: [collider.fromRect(
            [10 * tileSize, 5 * tileSize + (tileSize / 2)],
            4 * tileSize,
            4 * tileSize
        )]
    };
}