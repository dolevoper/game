import type { Renderer } from './core';
import type { Position } from './position';
import type { Sprite } from './sprite';
import * as sprite from './sprite';

export interface Tile {
    sprite: Sprite;
    position: Position;
}

export function fromSprite(sprite: Sprite, position: Position): Tile {
    return {
        sprite,
        position
    };
}

export function mapStep(step: number, tile: Tile) {
    return {
        ...tile,
        sprite: sprite.mapStep(step, tile.sprite)
    };
}

export function render(tile: Tile): Renderer {
    const size = tile.sprite.size;
    const [x, y] = tile.position;
    
    return sprite.render(tile.sprite, x * size, y * size);
}