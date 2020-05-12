import type { Position } from './position';

export interface PositionComponent {
    componentType: 'position';
    entityId: string;
    position: Position;
}

export function from(entityId: string, position: Position): PositionComponent {
    return {
        componentType: 'position',
        entityId,
        position
    };
}