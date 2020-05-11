export type Func<T, U> = (p: T) => U;
export type SumType<T, K extends keyof T, V extends T[K]> = T extends Record<K, V> ? T : never;

type CompositionResult<A, B, C, D, E, F> = Func<A, F> | Func<B, F> | Func<C, F> | Func<D, F> | Func<E, F>;

export function compose<A, B, C, D, E, F>(f1: Func<E, F>, f2?: Func<D, E>, f3?: Func<C, D>, f4?: Func<B, C>, f5?: Func<A, B>): CompositionResult<A, B, C, D, E, F> {
    if (f5 && f4 && f3 && f2) return compose5(f1, f2, f3, f4, f5);
    if (f4 && f3 && f2) return compose4(f1, f2, f3, f4);
    if (f3 && f2) return compose3(f1, f2, f3);
    if (f2) return compose2(f1, f2);

    return f1;
}

function compose2<A, B, C>(f1: Func<B, C>, f2: Func<A, B>): Func<A, C> {
    return (p: A) => f1(f2(p));
}

function compose3<A, B, C, D>(f1: Func<C, D>, f2: Func<B, C>, f3: Func<A, B>): Func<A, D> {
    return (p: A) => f1(f2(f3(p)));
}

function compose4<A, B, C, D, E>(f1: Func<D, E>, f2: Func<C, D>, f3: Func<B, C>, f4: Func<A, B>): Func<A, E> {
    return (p: A) => f1(f2(f3(f4(p))));
}

function compose5<A, B, C, D, E, F>(f1: Func<E, F>, f2: Func<D, E>, f3: Func<C, D>, f4: Func<B, C>, f5: Func<A, B>): Func<A, F> {
    return (p: A) => f1(f2(f3(f4(f5(p)))));
}

export function identity<T>(value: T): T { return value; }

export function always<T>(value: T): () => T { return () => value; }