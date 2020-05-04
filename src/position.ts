export type Position = [number, number];

export function moveDown([x, y]: Position, amount: number = 1): Position {
    return [x, y + amount];
}

export function moveUp([x, y]: Position, amount: number = 1): Position {
    return [x, y - amount];
}

export function moveLeft([x, y]: Position, amount: number = 1): Position {
    return [x - amount, y];
}

export function moveRight([x, y]: Position, amount: number = 1): Position {
    return [x + amount, y];
}