export interface StateMachineComponent {
    componentType: 'stateMachine';
    entityId: string;
    currentState: string;
    transitions: Record<string, Record<string, string>>;
    signal(sig: string): StateMachineComponent;
}

export function stateMachineComponent<T extends string, U extends string>(
    entityId: string,
    currentState: T,
    transitions: Record<T, Record<U, T>>
): StateMachineComponent {
    return {
        componentType: 'stateMachine',
        entityId,
        currentState,
        transitions,
        signal(sig: U) {
            return stateMachineComponent(entityId, transitions[currentState][sig], transitions);
        }
    }
}