import type { State } from './state';
import type { Position } from './position';
import type { EntitySystem } from './entity-system';
import * as state from './state';
import * as position from './position';
import * as entitySystem from './entity-system';

export interface ColliderComponent {
    componentType: 'collider';
    entityId: string;
    position: Position;
    width: number;
    height: number;
    collisions: string[];
}

export function colliderComponent(entityId: string, position: Position, width: number, height: number, collisions: string[]): ColliderComponent {
    return {
        componentType: 'collider',
        entityId,
        position,
        width,
        height,
        collisions
    };
}

export function boxCollider(entityId: string, position: Position, width: number, height: number): ColliderComponent {
    return colliderComponent(entityId, position, width, height, []);
}

export function update(): State<EntitySystem, void> {
    return state.modify(es => {
        const collidersWithPositions: [ColliderComponent, Position][] = es
            .getComponents('collider')
            .map(component => [
                component,
                es
                    .getEntityComponent(component.entityId, 'position')
                    .map(pc => pc.position)
                    .withDefault([0, 0])
            ]);

        const updateColliders = collidersWithPositions
            .map(([collider1, pos1]) => {
                const realPos1 = position.add(collider1.position, pos1);

                const collisions = collidersWithPositions
                    .filter(([collider2, pos2]) => {
                        const realPos2 = position.add(collider2.position, pos2);

                        return collider1 !== collider2 &&
                            realPos1[0] < realPos2[0] + collider2.width &&
                            realPos1[0] + collider1.width > realPos2[0] &&
                            realPos1[1] < realPos2[1] + collider2.height &&
                            realPos1[1] + collider1.height > realPos2[1];
                    })
                    .map(([collider2]) => collider2.entityId);

                return entitySystem.updateComponent(collider1, colliderComponent(
                    collider1.entityId,
                    collider1.position,
                    collider1.width,
                    collider1.height,
                    collisions
                ));
            });

        return es.evolve(updateColliders);
    });
}