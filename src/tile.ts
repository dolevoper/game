import { Renderer } from './core';

export interface Tile {
    image: CanvasImageSource;
    tileSize: number;
    i: number;
    j: number;
}

export function tile(image: CanvasImageSource, tileSize: number, i: number, j: number): Tile {
    return { image, tileSize, i, j };
}

export function renderTile(tile: Tile, x: number, y: number): Renderer {
    return function (ctx: CanvasRenderingContext2D) {
        ctx.drawImage(tile.image, tile.j * tile.tileSize, tile.i * tile.tileSize, tile.tileSize, tile.tileSize, x * tile.tileSize, y * tile.tileSize, tile.tileSize, tile.tileSize);
    }
}