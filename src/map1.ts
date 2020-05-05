import type { TileGrid } from './tile-grid';
import { loadImage } from './core';
import * as sprite from './sprite'
import * as tileGrid from './tile-grid';

import GrassTileset from './assets/AH_Autotile_Grass.png';

export async function load(): Promise<TileGrid> {
    const grassImage = await loadImage(GrassTileset);

    const grassCornerTL = sprite.staticSprite(grassImage, 16, 0, 8);
    const grassCornerTR = sprite.staticSprite(grassImage, 16, 0, 11);
    const grassCornerBL = sprite.staticSprite(grassImage, 16, 3, 8);
    const grassCornerBR = sprite.staticSprite(grassImage, 16, 3, 11);
    const grassEdgeT = sprite.staticSprite(grassImage, 16, 0, 10);
    const grassEdgeL = sprite.staticSprite(grassImage, 16, 1, 8);
    const grassEdgeR = sprite.staticSprite(grassImage, 16, 2, 11);
    const grassEdgeB = sprite.staticSprite(grassImage, 16, 3, 9);
    const grass = sprite.staticSprite(grassImage, 16, 2, 9);

    const gridWidth = 20;
    const gridHeight = 10;

    const grid = tileGrid.build([
        tileGrid.tile(grassCornerTL, [0, 0]),
        tileGrid.tile(grassCornerTR, [gridWidth - 1, 0]),
        tileGrid.tile(grassCornerBL, [0, gridHeight - 1]),
        tileGrid.tile(grassCornerBR, [gridWidth - 1, gridHeight - 1]),
        tileGrid.fill(grassEdgeT, [1, 0], gridWidth - 2, 1),
        tileGrid.fill(grassEdgeL, [0, 1], 1, gridHeight - 2),
        tileGrid.fill(grassEdgeR, [gridWidth - 1, 1], 1, gridHeight - 2),
        tileGrid.fill(grassEdgeB, [1, gridHeight - 1], gridWidth - 2, 1),
        tileGrid.fill(grass, [1, 1], gridWidth - 2, gridHeight - 2)
    ], tileGrid.empty(16, gridWidth, gridHeight));

    return grid;
}