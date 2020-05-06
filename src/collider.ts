import type { Position } from './position';

export interface Collider {
    position: Position;
    width: number;
    height: number;
}

export function isColliding(
    { position: [x1, y1], width: width1, height: height1 }: Collider,
    { position: [x2, y2], width: width2, height: height2}: Collider
): boolean {
    return x1 < x2 + width2 &&
        x1 + width1 > x2 &&
        y1 < y2 + height2 &&
        y1 + height1 > y2;
}