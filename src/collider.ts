import type { Position } from './position';

export interface Collider {
    position: Position;
    width: number;
    height: number;
}

type CollisionChecker = (c: Collider) => boolean;

export function fromRect(position: Position, width: number, height: number): Collider {
    return { position, width, height };
}

export function isColliding(collider1: Collider): CollisionChecker;
export function isColliding(collider1: Collider, collider2: Collider): boolean;
export function isColliding(
    { position: [x1, y1], width: width1, height: height1 }: Collider,
    collider?: Collider
): boolean | CollisionChecker {
    const check: CollisionChecker = ({ position: [x2, y2], width: width2, height: height2 }) => x1 < x2 + width2 &&
        x1 + width1 > x2 &&
        y1 < y2 + height2 &&
        y1 + height1 > y2;

    return collider ? check(collider) : check;
}