import { Func, identity, always } from './fp';

interface Just<T> {
    kind: 'just';
    value: T;
}

interface Nothing {
    kind: 'nothing';
}

export type Maybe<T> = Just<T> | Nothing;

export function just<T>(value: T): Maybe<T> {
    return {
        kind: 'just',
        value
    };
}

export function nothing<T>(): Maybe<T> {
    return {
        kind: 'nothing'
    };
}

type MaybeResolver<T, U> = (m: Maybe<T>) => U;

export function match<T, U>(matchers: { just: Func<T, U>, nothing: () => U }): MaybeResolver<T, U>;
export function match<T, U>(matchers: { just: Func<T, U>, nothing: () => U }, maybe: Maybe<T>): U;
export function match<T, U>(matchers: { just: Func<T, U>, nothing: () => U }, maybe?: Maybe<T>): U | MaybeResolver<T, U> {
    const resolve: MaybeResolver<T, U> = maybe => {
        if (maybe.kind === 'just') return matchers.just(maybe.value);

        return matchers.nothing();
    };

    return maybe ? resolve(maybe) : resolve;
}

export function withDefault<T>(defaultValue: T): MaybeResolver<T, T>;
export function withDefault<T>(defaultValue: T, maybe: Maybe<T>): T;
export function withDefault<T>(defaultValue: T, maybe?: Maybe<T>): T | MaybeResolver<T, T> {
    const resolve: MaybeResolver<T, T> = maybe => match({
        just: identity,
        nothing: always(defaultValue)
    }, maybe);

    return maybe ? resolve(maybe) : resolve;
}

export function map<T, U>(projection: Func<T, U>): MaybeResolver<T, Maybe<U>>;
export function map<T, U>(projection: Func<T, U>, maybe: Maybe<T>): Maybe<U>;
export function map<T, U>(projection: Func<T, U>, maybe?: Maybe<T>): Maybe<U> | MaybeResolver<T, Maybe<U>> {
    const resolve: MaybeResolver<T, Maybe<U>> = maybe => match({
        just: value => just(projection(value)),
        nothing: always(nothing())
    }, maybe);

    return maybe ? resolve(maybe) : resolve;
}