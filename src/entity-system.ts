import type { Func } from './fp';
import type { ComponentType, Component } from './component';

type DiscriminatedUnion<T, K extends keyof T, V extends T[K]> = T extends Record<K, V> ? T : never;

export interface EntitySystem {
    components: { [K in ComponentType]: DiscriminatedUnion<Component, 'componentType', K>[] };
}

export function empty(): EntitySystem {
    return {
        components: {
            render: [],
            position: []
        }
    };
}

type EntitySystemBuilder = Func<EntitySystem, EntitySystem>;

export function addComponent(component: Component): EntitySystemBuilder;
export function addComponent(component: Component, entitySystem: EntitySystem): EntitySystem;
export function addComponent(component: Component, entitySystem?: EntitySystem): EntitySystem | EntitySystemBuilder {
    const build: EntitySystemBuilder = entitySystem => ({
        components: {
            ...entitySystem.components,
            [component.componentType]: [...entitySystem.components[component.componentType], component]
        }
    });

    return entitySystem ? build(entitySystem): build;
}

export function build(builders: EntitySystemBuilder[], entitySystem: EntitySystem): EntitySystem {
    return builders.reduce(
        (res, builder) => builder(res),
        entitySystem
    );
}