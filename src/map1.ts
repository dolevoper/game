import { loadImage } from './core';
import type { GameMap } from './game-map';
import * as sprite from './sprite'
import * as gameMap from './game-map';
import * as tileGrid from './tile-grid';

import GrassTileset from './assets/AH_Autotile_Grass.png';

export async function load(): Promise<GameMap> {
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

    const grid = tileGrid.fill(
        grass,
        [0, 0],
        50,
        50,
        tileGrid.empty(16, 50, 50)
    );

    return gameMap.fromTileGrid(grid);
}