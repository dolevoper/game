import type { Func } from './fp';

export interface State<T, U> {
    run(s: T): [U, T];
    map<V>(fn: Func<U, V>): State<T, V>;
    flatMap<V>(fn: Func<U, State<T, V>>): State<T, V>;
    evalWith(s: T): U;
    execWith(s: T): T;
}

function state<T, U>(run: Func<T, [U, T]>): State<T, U> {
    return {
        run,
        map(fn) {
            return state(s => {
                const [value, newState] = run(s);

                return [fn(value), newState];
            });
        },
        flatMap(fn) {
            return state(s => {
                const [value, newState] = run(s);

                return fn(value).run(newState);
            });
        },
        evalWith(s) {
            return run(s)[0];
        },
        execWith(s) {
            return run(s)[1];
        }
    }
}

export function pure<T, U>(value: U): State<T, U> {
    return state(s => [value, s]);
}

export function get<T>(): State<T, T>;
export function get<T, U>(fn: Func<T, U>): State<T, U>;
export function get<T, U>(fn?: Func<T, U>): State<T, T> | State<T, U> {
    return fn ? state(s => [fn(s), s]) : state(s => [s, s]);
}

export function put<T>(newState: T): State<T, void> {
    return state(() => [, newState]);
}

export function modify<T>(fn: Func<T, T>): State<T, void> {
    return get<T>().flatMap(s => put(fn(s)));
}