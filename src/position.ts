export type Position = [number, number];

export function moveDown([x, y]: Position): Position {
    return [x, y + 1];
}

export function moveUp([x, y]: Position): Position {
    return [x, y - 1];
}

export function moveLeft([x, y]: Position): Position {
    return [x - 1, y];
}

export function moveRight([x, y]: Position): Position {
    return [x + 1, y];
}