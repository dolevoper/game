import type { Renderer } from './rendering';
import type { Position } from './position';
import type { Sprite } from './sprite';
import * as rendering from './rendering';
import * as position from './position';
import * as sprite from './sprite';

type Tile = { sprite: Sprite, position: Position };

export interface TileGrid {
    tileSize: number;
    width: number;
    height: number;
    tiles: Tile[];
}

type TileGridBuilder = (tileGrid: TileGrid) => TileGrid;

export function empty(tileSize: number, width: number, height: number): TileGrid {
    return {
        tileSize,
        width,
        height,
        tiles: []
    };
}

export function tile(sprite: Sprite, position: Position): TileGridBuilder;
export function tile(sprite: Sprite, position: Position, tileGrid: TileGrid): TileGrid;
export function tile(sprite: Sprite, position: Position, tileGrid?: TileGrid): TileGrid | TileGridBuilder {
    const build: TileGridBuilder = tileGrid => ({
        ...tileGrid,
        tiles: [
            ...tileGrid.tiles,
            { sprite, position }
        ]
    });

    return tileGrid ? build(tileGrid) : build;
}

export function fill(sprite: Sprite, from: Position, width: number, height: number): TileGridBuilder;
export function fill(sprite: Sprite, from: Position, width: number, height: number, tileGrid: TileGrid): TileGrid;
export function fill(sprite: Sprite, from: Position, width: number, height: number, tileGrid?: TileGrid): TileGrid | TileGridBuilder {
    const newTiles: Tile[] = Array<Sprite[]>(width).fill(Array<Sprite>(height).fill(sprite)).flatMap(
        (row, i) => row.map((sprite, j) => ({ sprite, position: [i + from[0], j + from[1]] }))
    )

    const build: TileGridBuilder = tileGrid => ({
        ...tileGrid,
        tiles: [
            ...tileGrid.tiles,
            ...newTiles
        ]
    });

    return tileGrid ? build(tileGrid) : build;
}

export function build(builders: TileGridBuilder[], tileGrid: TileGrid): TileGrid {
    return builders.reduce(
        (res, builder) => builder(res),
        tileGrid
    );
}

export function renderWidth({ width, tileSize }: TileGrid): number {
    return width * tileSize;
}

export function renderHeigth({ height, tileSize }: TileGrid): number {
    return height * tileSize;
}

export function render(transform: DOMMatrix, tileGrid: TileGrid): Renderer {
    const renderTile = createTileRenderer(transform, tileGrid.tileSize);

    return rendering.combineRenderers(
        tileGrid.tiles.map(renderTile)
    );
}

function createTileRenderer(transform: DOMMatrix, tileSize: number) {
    return function (tile: Tile): Renderer {
        return sprite.render(transform.translate(...position.scale(tileSize, tile.position)), tile.sprite);
    }
}