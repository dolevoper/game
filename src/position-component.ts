import type { Position } from './position';

export interface PositionComponent {
    componentType: 'position';
    entityId: number;
    position: Position;
}

export function from(entityId: number, position: Position): PositionComponent {
    return {
        componentType: 'position',
        entityId,
        position
    };
}