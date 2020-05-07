import type { Position } from './position';
import type { Renderer } from './rendering';
import type { Sprite } from './sprite';
import * as sprite from './sprite';

export interface GameObject {
    sprite: Sprite;
    position: Position;
}

export function from(sprite: Sprite, position: Position): GameObject {
    return {
        sprite,
        position
    };
}

export function render(gameObject: GameObject): Renderer {
    return sprite.render(new DOMMatrix().translate(...gameObject.position), gameObject.sprite);
}