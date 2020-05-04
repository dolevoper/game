import type { Renderer } from './rendering';
import type { TileGrid } from './tile-grid';
import * as tileGrid from './tile-grid';

export interface GameMap extends TileGrid {}

export function fromTileGrid(grid: TileGrid): GameMap {
    return {
        ...grid
    };
}

export function width(gameMap: GameMap): number {
    return gameMap.width * gameMap.tileSize;
}

export function height(gameMap: GameMap): number {
    return gameMap.height * gameMap.tileSize;
}

export function render(gameMap: GameMap): Renderer {
    return tileGrid.render(gameMap);
}