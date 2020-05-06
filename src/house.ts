import type { Position } from './position';
import type { TileGrid } from './tile-grid';
import { loadImage } from './core';
import * as sprite from './sprite'
import * as tileGrid from './tile-grid';

import HouseWallTileset from './assets/AH_Autotile_House_Wall.png';

export async function load(): Promise<TileGrid & { position: Position }> {
    const houseWallImage = await loadImage(HouseWallTileset);

    const houseWallCornerTL = sprite.staticSprite(houseWallImage, 16, 0, 1);
    const houseWallCornerTR = sprite.staticSprite(houseWallImage, 16, 0, 3);
    const houseWallCornerBL = sprite.staticSprite(houseWallImage, 16, 2, 1);
    const houseWallCornerBR = sprite.staticSprite(houseWallImage, 16, 2, 3);
    const houseWallEdgeT = sprite.staticSprite(houseWallImage, 16, 0, 2);
    const houseWallEdgeL = sprite.staticSprite(houseWallImage, 16, 1, 1);
    const houseWallEdgeR = sprite.staticSprite(houseWallImage, 16, 1, 3);
    const houseWallEdgeB = sprite.staticSprite(houseWallImage, 16, 2, 2);
    const houseWall = sprite.staticSprite(houseWallImage, 16, 1, 2);

    const gridWidth = 4;
    const gridHeight = 2;

    const grid = tileGrid.build([
        tileGrid.tile(houseWallCornerTL, [0, 0]),
        tileGrid.tile(houseWallCornerTR, [gridWidth - 1, 0]),
        tileGrid.tile(houseWallCornerBL, [0, gridHeight - 1]),
        tileGrid.tile(houseWallCornerBR, [gridWidth - 1, gridHeight - 1]),
        tileGrid.fill(houseWallEdgeT, [1, 0], gridWidth - 2, 1),
        tileGrid.fill(houseWallEdgeL, [0, 1], 1, gridHeight - 2),
        tileGrid.fill(houseWallEdgeR, [gridWidth - 1, 1], 1, gridHeight - 2),
        tileGrid.fill(houseWallEdgeB, [1, gridHeight - 1], gridWidth - 2, 1),
        tileGrid.fill(houseWall, [1, 1], gridWidth - 2, gridHeight - 2)
    ], tileGrid.empty(16, gridWidth, gridHeight));

    return {
        ...grid,
        position: [10 * 16, 7 * 16]
    };
}