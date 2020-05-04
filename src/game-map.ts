import type { Renderer } from './core';
import type { Sprite } from './sprite';
import type { Tile } from './tile';
import * as tile from './tile';

export interface GameMap {
    tiles: Tile[]
}

export function fromSpriteMatrix(matrix: Sprite[][]): GameMap {
    return {
        tiles: matrix.flatMap((row, i) => row.map((sprite, j) => tile.fromSprite(sprite, [j, i])))
    };
}

export function render(gameMap: GameMap): Renderer {
    return ctx => gameMap.tiles.map(tile.render).forEach(renderer => renderer(ctx));
}