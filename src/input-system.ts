import type { State } from './state';
import type { EntitySystem } from './entity-system';
import { always } from './fp';
import * as maybe from './maybe';
import * as state from './state';
import * as entitySystem from './entity-system';
import * as movementSystem from './movement-system';

const moveLeftKey = 37;
const moveUpKey = 38;
const moveRightKey = 39;
const moveDownKey = 40;

type InputState = { [k: number]: boolean };

let inputState: InputState = {};

document.addEventListener('keydown', function (e) {
    inputState[e.keyCode] = true;
});

document.addEventListener('keyup', function (e) {
    delete inputState[e.keyCode];
});

export function update(step: number): State<EntitySystem, number> {
    return state.flatMap(
        () => state.pure(step),
        state.modify(es => {
            const playerMovementSystem = entitySystem.component(0, 'movement', es);

            return maybe.match({
                nothing: always(es),
                just: ms => {
                    const movementSpeed = 64;

                    let xSpeed = inputState[moveRightKey] && ms.xSpeed >= 0
                        ? movementSpeed
                        : inputState[moveLeftKey] ? -movementSpeed : 0;

                    let ySpeed = inputState[moveDownKey] && ms.ySpeed >= 0
                        ? movementSpeed
                        : inputState[moveUpKey] ? -movementSpeed : 0;

                    if (xSpeed && ySpeed) {
                        xSpeed *= 64 / Math.sqrt(xSpeed * xSpeed + ySpeed * ySpeed);
                        ySpeed *= 64 / Math.sqrt(xSpeed * xSpeed + ySpeed * ySpeed);
                    }

                    return entitySystem.updateComponent(ms, movementSystem.from(ms.entityId, xSpeed, ySpeed), es);
                }
            }, playerMovementSystem);
        })
    );
}