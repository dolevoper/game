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

export interface InputComponent {
    componentType: 'input';
    entityId: string;
    inputState: InputState;
}

function inputComponent(entityId: string, inputState: InputState): InputComponent {
    return {
        componentType: 'input',
        entityId,
        inputState
    };
}

export function emptyInputComponent(entityId: string): InputComponent {
    return inputComponent(entityId, {});
}

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

            const updateInputComponents = es
                .getComponents('input')
                .map(oldInputComponent => entitySystem.updateComponent(oldInputComponent, inputComponent(oldInputComponent.entityId, { ...inputState })));

            return es.evolve([...updateInputComponents, updatePlayerState]);
        })
        .flatMap(() => state.pure(step))
}