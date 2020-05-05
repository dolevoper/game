import * as math from './math';

export type Position = [number, number];

type PositionBuilder = (pos: Position) => Position;

export function fromScalar(scalar: number): Position {
    return [scalar, scalar];
}

export function add([x1, y1]: Position): PositionBuilder;
export function add([x1, y1]: Position, pos: Position): Position;
export function add([x1, y1]: Position, pos?: Position): Position | PositionBuilder {
    const build: PositionBuilder = ([x2, y2]) => [x1 + x2, y1 + y2];

    return pos ? build(pos) : build;
}

export function build(builders: PositionBuilder[], position: Position): Position {
    return builders.reduce(
        (res, builder) => builder(res),
        position
    );
}

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

export function clamp([minX, minY]: Position, [x, y]: Position, [maxX, maxY]: Position): Position {
    return [math.clamp(minX, x, maxX), math.clamp(minY, y, maxY)];
}