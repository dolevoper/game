import type { Position } from './position';

export interface PositionComponent {
    componentType: 'position';
    entityId: string;
    position: Position;
}

export function positionComponent(entityId: string, position: Position): PositionComponent {
    return {
        componentType: 'position',
        entityId,
        position
    };
}