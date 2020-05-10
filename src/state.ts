import { Func, compose } from './fp';

export interface State<T, U> {
    run(state: T): [U, T];
}

export function pure<T, U>(value: U): State<T, U> {
    return {
        run(state) {
            return [value, state];
        }
    }
}

export function get<T>(): State<T, T> {
    return {
        run(state: T) {
            return [state, state];
        }
    };
}

export function put<T>(newState: T): State<T, void> {
    return {
        run() {
            return [, newState];
        }
    };
}

export function map<T, U, V>(fn: Func<U, V>): Func<State<T, U>, State<T, V>>;
export function map<T, U, V>(fn: Func<U, V>, m: State<T, U>): State<T, V>;
export function map<T, U, V>(fn: Func<U, V>, m?: State<T, U>): State<T, V> | Func<State<T, U>, State<T, V>> {
    const run: Func<State<T, U>, State<T, V>> = m => ({
        run(state) {
            const [value, newState] = m.run(state);

            return [fn(value), newState];
        }
    });

    return m ? run(m) : run;
}

export function flat<T, U>(m: State<T, State<T, U>>): State<T, U> {
    return {
        run(state) {
            const [value, newState] = m.run(state);

            return value.run(newState);
        }
    }
}

export function flatMap<T, U, V>(fn: Func<U, State<T, V>>): Func<State<T, U>, State<T, V>>;
export function flatMap<T, U, V>(fn: Func<U, State<T, V>>, m: State<T, U>): State<T, V>;
export function flatMap<T, U, V>(fn: Func<U, State<T, V>>, m?: State<T, U>): State<T, V> | Func<State<T, U>, State<T, V>> {
    const run: Func<State<T, U>, State<T, V>> = m => flat(map(fn, m));

    return m ? run(m) : run;
}

export function evalState<T, U>(state: T, m: State<T, U>): U {
    const [value, _] = m.run(state);

    return value;
}

export function execState<T, U>(state: T, m: State<T, U>): T {
    const [_, newState] = m.run(state);

    return newState;
}