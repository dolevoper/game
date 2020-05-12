import type { State } from './state';
import type { EntitySystem } from './entity-system';
import { always } from './fp';
import * as state from './state';
import * as position from './position';
import * as entitySystem from './entity-system';
import * as positionComponent from './position-component';

const moveLeftKey = 37;
const moveUpKey = 38;
const moveRightKey = 39;
const moveDownKey = 40;

export interface MovementComponent {
    componentType: 'movement';
    entityId: string;
    xSpeed: number;
    ySpeed: number;
}

export function movementComponent(entityId: string, xSpeed: number, ySpeed: number): MovementComponent {
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
            (es, mc) => {
                const updateMovementComponent = es
                    .getEntityComponent(mc.entityId, 'input')
                    .map(inputComponent => {
                        const movementSpeed = 64;

                        let xSpeed = inputComponent.inputState[moveRightKey] && mc.xSpeed >= 0
                            ? movementSpeed
                            : inputComponent.inputState[moveLeftKey] ? -movementSpeed : 0;

                        let ySpeed = inputComponent.inputState[moveDownKey] && mc.ySpeed >= 0
                            ? movementSpeed
                            : inputComponent.inputState[moveUpKey] ? -movementSpeed : 0;

                        if (xSpeed && ySpeed) {
                            xSpeed *= 64 / Math.sqrt(xSpeed * xSpeed + ySpeed * ySpeed);
                            ySpeed *= 64 / Math.sqrt(xSpeed * xSpeed + ySpeed * ySpeed);
                        }

                        return [entitySystem.updateComponent(mc, movementComponent(mc.entityId, xSpeed, ySpeed))];
                    })
                    .withDefault([]);

                return es
                    .getEntityComponent(mc.entityId, 'position')
                    .match(
                        pc => {
                            let xSpeed = mc.xSpeed * step / 1000;
                            let ySpeed = mc.ySpeed * step / 1000;

                            xSpeed = mc.xSpeed > 0 ? Math.ceil(xSpeed) : Math.floor(xSpeed);
                            ySpeed = mc.ySpeed > 0 ? Math.ceil(ySpeed) : Math.floor(ySpeed);

                            return es.updateComponent(pc, positionComponent.positionComponent(pc.entityId, position.add(
                                [xSpeed, ySpeed],
                                pc.position
                            )))
                        },
                        always(es)
                    )
                    .evolve(updateMovementComponent);
            },
            es
        )
    );
}