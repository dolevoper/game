import { always } from './fp';
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

export function update(step: number): State<EntitySystem, void> {
    return state.modify(es => {
        return entitySystem
            .components('movement', es)
            .reduce(
                (es, mc) => maybe.match({
                    just: pc => {
                        let xSpeed = mc.xSpeed * step / 1000;
                        let ySpeed = mc.ySpeed * step / 1000;

                        xSpeed = mc.xSpeed > 0 ? Math.ceil(xSpeed) : Math.floor(xSpeed);
                        ySpeed = mc.ySpeed > 0 ? Math.ceil(ySpeed) : Math.floor(ySpeed);

                        return entitySystem.updateComponent(pc, positionComponent.from(pc.entityId, position.add(
                            [xSpeed, ySpeed],
                            pc.position
                        )), es)
                    },
                    nothing: always(es)
                }, entitySystem.component(mc.entityId, 'position', es)),
                es
            )
    });
}