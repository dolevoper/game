import { Func, always } from './fp';
import type { State } from './state';
import type { EntitySystem } from './entity-system';
import * as maybe from './maybe';
import * as state from './state';
import * as position from './position';
import * as entitySystem from './entity-system';
import * as positionComponent from './position-component';

export interface MovementComponent {
    componentType: 'movement';
    entityId: number;
    xSpeed: number;
    ySpeed: number;
}

export function from(entityId: number, xSpeed: number, ySpeed: number): MovementComponent {
    return {
        componentType: 'movement',
        entityId,
        xSpeed,
        ySpeed
    };
}

export function update(step: number): Func<void, State<EntitySystem, void>> {
    return () => state.modify(es => {
        return entitySystem
            .components('movement', es)
            .reduce(
                (es, mc) => maybe.match({
                    just: pc => entitySystem.updateComponent(pc, positionComponent.from(pc.entityId, position.add(
                        [mc.xSpeed * step / 1000, mc.ySpeed * step / 1000],
                        pc.position
                    )), es),
                    nothing: always(es)
                }, entitySystem.component(mc.entityId, 'position', es)),
                es
            )
    });
}