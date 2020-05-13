import { Func } from './fp';

interface Just<T> {
    kind: 'just';
    value: T;
    map<U>(fn: Func<T, U>): Maybe<U>;
    flatMap<U>(fn: Func<T, Maybe<U>>): Maybe<U>;
    match<U>(ifJust: Func<T, U>, ifNothing: Func<void, U>): U;
    withDefault(value: T): T;
}

interface Nothing<T> {
    kind: 'nothing';
    map<U>(fn: Func<T, U>): Maybe<U>;
    flatMap<U>(fn: Func<T, Maybe<U>>): Maybe<U>;
    match<U>(ifJust: Func<T, U>, ifNothing: Func<void, U>): U;
    withDefault(value: T): T;
}

export type Maybe<T> = Just<T> | Nothing<T>;

export function just<T>(value: T): Maybe<T> {
    return {
        kind: 'just',
        value,
        map(fn) {
            return just(fn(value));
        },
        flatMap(fn) {
            return fn(value);
        },
        match(ifJust) {
            return ifJust(value);
        },
        withDefault() {
            return value;
        }
    };
}

export function nothing<T>(): Maybe<T> {
    return {
        kind: 'nothing',
        map() {
            return nothing();
        },
        flatMap() {
            return nothing();
        },
        match(_, ifNothing) {
            return ifNothing();
        },
        withDefault(value) {
            return value;
        }
    };
}