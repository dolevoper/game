import { always } from './fp';
import type { State } from './state';
import type { EntitySystem } from './entity-system';
import * as state from './state';
import * as position from './position';
import * as positionComponent from './position-component';

export interface MovementComponent {
    componentType: 'movement';
    entityId: string;
    xSpeed: number;
    ySpeed: number;
}

export function from(entityId: string, xSpeed: number, ySpeed: number): MovementComponent {
    return {
        componentType: 'movement',
        entityId,
        xSpeed,
        ySpeed
    };
}

export function update(step: number): State<EntitySystem, void> {
    return state.modify(es => es
        .getComponents('movement')
        .reduce(
            (es, mc) => es
                .getEntityComponent(mc.entityId, 'position')
                .match(
                    pc => {
                        let xSpeed = mc.xSpeed * step / 1000;
                        let ySpeed = mc.ySpeed * step / 1000;

                        xSpeed = mc.xSpeed > 0 ? Math.ceil(xSpeed) : Math.floor(xSpeed);
                        ySpeed = mc.ySpeed > 0 ? Math.ceil(ySpeed) : Math.floor(ySpeed);

                        return es.updateComponent(pc, positionComponent.from(pc.entityId, position.add(
                            [xSpeed, ySpeed],
                            pc.position
                        )))
                    },
                    always(es)
                ),
            es
        )
    );
}