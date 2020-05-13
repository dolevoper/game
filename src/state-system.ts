import type { State } from './state';
import type { EntitySystem } from './entity-system';
import { notEmpty } from './fp';
import * as state from './state';
import * as entitySystem from './entity-system';

export interface InputStateMachineComponent {
    componentType: 'inputStateMachine';
    entityId: string;
    currentState: string;
    transitions: { from: string, on?: number, to: string }[];
}

export function inputStateMachine(entityId: string, currentState: string, transitions: { from: string, on?: number, to: string }[]): InputStateMachineComponent {
    return {
        componentType: 'inputStateMachine',
        entityId,
        currentState,
        transitions
    };
}

export function update(step: number): State<EntitySystem, number> {
    return state
        .modify<EntitySystem>(es => {
            const updateInputStateMachines = es
                .getComponents('inputStateMachine')
                .map(component => {
                    const inputComponent = es.getEntityComponent(component.entityId, 'input');

                    return inputComponent
                        .map(input => {
                            const transition = component.transitions.find(({ from, on }) => component.currentState === from && (!on || input.inputState[on]));

                            return transition && entitySystem.updateComponent(component, inputStateMachine(component.entityId, transition.to, component.transitions));
                        })
                        .withDefault(undefined);
                })
                .filter(notEmpty);

            return es.evolve(updateInputStateMachines);
        })
        .flatMap(() => state.pure(step));
}