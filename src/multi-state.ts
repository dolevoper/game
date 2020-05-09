import type { Sprite } from './sprite';
import { Func } from './fp';
import * as sprite from './sprite';

export type StateSprites<T extends string> = { [k in T]: Sprite };

export interface MultiState<T extends string> {
    state: T;
    sprite: Sprite;
    stateSprites: StateSprites<T>;
}

export function from<T extends string, U extends T>(state: U, stateSprites: StateSprites<T>): MultiState<T> {
    return {
        state,
        sprite: stateSprites[state],
        stateSprites
    };
}

type MultiStateBuilder<T extends string> = (multiState: MultiState<T>) => MultiState<T>;

export function mapState<T extends string>(projection: Func<T, T>): MultiStateBuilder<T>;
export function mapState<T extends string>(projection: Func<T, T>, multiState: MultiState<T>): MultiState<T>;
export function mapState<T extends string>(projection: Func<T, T>, multiState?: MultiState<T>): MultiState<T> | MultiStateBuilder<T> {
    const build: MultiStateBuilder<T> = multiState => {
        const newState = projection(multiState.state);

        return newState === multiState.state ? multiState : {
            state: newState,
            sprite: multiState.stateSprites[newState],
            stateSprites: multiState.stateSprites
        };
    };

    return multiState ? build(multiState) : build;
}

export function mapStep<T extends string>(step: number): MultiStateBuilder<T>;
export function mapStep<T extends string>(step: number, multiState: MultiState<T>): MultiState<T>;
export function mapStep<T extends string>(step: number, multiState?: MultiState<T>): MultiState<T> | MultiStateBuilder<T> {
    const build: MultiStateBuilder<T> = multiState => ({
        ...multiState,
        sprite: sprite.mapStep(step, multiState.sprite)
    });

    return multiState ? build(multiState) : build;
}

export function build<T extends string>(builders: MultiStateBuilder<T>[], multiState: MultiState<T>): MultiState<T> {
    return builders.reduce(
        (res, next) => next(res),
        multiState
    );
}