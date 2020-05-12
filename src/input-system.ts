import type { State } from './state';
import type { EntitySystem } from './entity-system';
import { always, identity } from './fp';
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
    return state
        .modify<EntitySystem>(es => {
            const updatePlayerMovement = es
                .getEntityComponent('player', 'movement')
                .match(ms => {
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

                    return entitySystem.updateComponent(ms, movementSystem.movementComponent(ms.entityId, xSpeed, ySpeed));
                }, always(identity));

            const updatePlayerState = es
                .getEntityComponent('player', 'stateMachine')
                .match(playerSM => {
                    if (!inputState[moveDownKey] && !inputState[moveLeftKey] && !inputState[moveRightKey] && !inputState[moveUpKey]) {
                        return entitySystem.updateComponent(playerSM, playerSM.signal('holding nothing'));
                    }

                    let updatedPlayerSM = playerSM;

                    if (inputState[moveDownKey]) {
                        updatedPlayerSM = updatedPlayerSM.signal('holding down');
                    }

                    if (inputState[moveLeftKey]) {
                        updatedPlayerSM = updatedPlayerSM.signal('holding left');
                    }

                    if (inputState[moveRightKey]) {
                        updatedPlayerSM = updatedPlayerSM.signal('holding right');
                    }

                    if (inputState[moveUpKey]) {
                        updatedPlayerSM = updatedPlayerSM.signal('holding up');
                    }

                    return entitySystem.updateComponent(playerSM, updatedPlayerSM);
                }, always(identity));

            return es.evolve([updatePlayerMovement, updatePlayerState]);
        })
        .flatMap(() => state.pure(step))
}