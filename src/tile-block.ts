import type { Position } from './position';
import type { Renderer } from './rendering';
import type { Sprite } from './sprite';
import type { TileGrid } from './tile-grid';
import * as tileGrid from './tile-grid';

export interface TileBlock extends TileGrid {
    position: Position;
}

export function fromSprites(
    position: Position,
    width: number,
    height: number,
    cornerTL: Sprite,
    cornerTR: Sprite,
    cornerBL: Sprite,
    cornerBR: Sprite,
    edgeT: Sprite,
    edgeL: Sprite,
    edgeR: Sprite,
    edgeB: Sprite,
    center: Sprite
): TileBlock {
    const grid = tileGrid.build([
        tileGrid.tile(cornerTL, [0, 0]),
        tileGrid.tile(cornerTR, [width - 1, 0]),
        tileGrid.tile(cornerBL, [0, height - 1]),
        tileGrid.tile(cornerBR, [width - 1, height - 1]),
        tileGrid.fill(edgeT, [1, 0], width - 2, 1),
        tileGrid.fill(edgeL, [0, 1], 1, height - 2),
        tileGrid.fill(edgeR, [width - 1, 1], 1, height - 2),
        tileGrid.fill(edgeB, [1, height - 1], width - 2, 1),
        tileGrid.fill(center, [1, 1], width - 2, height - 2)
    ], tileGrid.empty(16, width, height));

    return {
        ...grid,
        position
    };
}

export function render(tileBlock: TileBlock): Renderer {
    return tileGrid.render(new DOMMatrix().translate(...tileBlock.position), tileBlock);
}