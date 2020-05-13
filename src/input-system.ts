import type { State } from './state';
import type { EntitySystem } from './entity-system';
import * as state from './state';
import * as entitySystem from './entity-system';

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
            const updateInputComponents = es
                .getComponents('input')
                .map(oldInputComponent => entitySystem.updateComponent(oldInputComponent, inputComponent(oldInputComponent.entityId, { ...inputState })));

            return es.evolve(updateInputComponents);
        })
        .flatMap(() => state.pure(step))
}