import type { Renderer } from './rendering';
import type { Position } from './position';
import type { Sprite } from './sprite';
import * as rendering from './rendering';
import * as sprite from './sprite';

type Tile = { sprite: Sprite, position: Position };

export interface TileGrid {
    tileSize: number;
    width: number;
    height: number;
    tiles: Tile[];
}

export function empty(tileSize: number, width: number, height: number): TileGrid {
    return {
        tileSize,
        width,
        height,
        tiles: []
    };
}

export function tile(sprite: Sprite, position: Position, tileGrid: TileGrid): TileGrid {
    return {
        ...tileGrid,
        tiles: [
            ...tileGrid.tiles,
            { sprite, position }
        ]
    };
}

export function fill(sprite: Sprite, from: Position, width: number, height: number, tileGrid: TileGrid): TileGrid {
    const newTiles: Tile[] = Array<Sprite[]>(width).fill(Array<Sprite>(height).fill(sprite)).flatMap(
        (row, i) => row.map((sprite, j) => ({ sprite, position: [j + from[0], i + from[1]] }))
    )

    return {
        ...tileGrid,
        tiles: [
            ...tileGrid.tiles,
            ...newTiles
        ]
    }
}

export function render(tileGrid: TileGrid): Renderer {
    const renderTile = createTileRenderer(tileGrid.tileSize);

    return rendering.combineRenderers(
        tileGrid.tiles.map(renderTile)
    );
}

function createTileRenderer(tileSize: number) {
    return function (tile: Tile): Renderer {
        return sprite.render(tile.sprite, tile.position[0] * tileSize, tile.position[1] * tileSize);
    }
}