export interface ZipList<T> {
    prev: T[];
    curr: T;
    next: T[];
}

export function fromArray<T>(items: T[]): ZipList<T> {
    return {
        prev: [],
        curr: items[0],
        next: items.slice(1)
    };
}

export function length<T>(list: ZipList<T>): number {
    return list.prev.length + 1 + list.next.length;
}

export function position<T>(list: ZipList<T>): number {
    return list.prev.length;
}

export function curr<T>(list: ZipList<T>): T {
    return list.curr;
}

export function moveTo<T>(newPos: number, list: ZipList<T>): ZipList<T> {
    const currPos = position(list);

    if (currPos === newPos) return list;

    if (newPos < currPos) return {
        prev: list.prev.slice(0, newPos),
        curr: list.prev[newPos],
        next: [...list.prev.slice(newPos + 1), list.curr, ...list.next]
    };

    return {
        prev: [...list.prev, list.curr, ...list.next.slice(0, newPos - currPos - 1)],
        curr: list.next[newPos - currPos - 1],
        next: list.next.slice(newPos - currPos)
    };
}