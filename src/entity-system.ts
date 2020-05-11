import type { Func, SumType } from './fp';
import type { Maybe } from './maybe';
import type { ComponentType, Component } from './component';
import * as maybe from './maybe';

type Entity = { [K in ComponentType]: Maybe<number> };

export interface EntitySystem {
    entities: { [id: number]: Entity };
    components: { [K in ComponentType]: SumType<Component, 'componentType', K>[] };
}

export function empty(): EntitySystem {
    return {
        entities: {},
        components: {
            render: [],
            position: [],
            movement: []
        }
    };
}

export function components<K extends ComponentType>(componentType: K, entitySystem: EntitySystem): SumType<Component, 'componentType', K>[] {
    return entitySystem.components[componentType] as SumType<Component, 'componentType', K>[];
}

export function component<K extends ComponentType>(entityId: number, componentType: K, entitySystem: EntitySystem): Maybe<SumType<Component, 'componentType', K>> {
    return maybe.map(componentId => components(componentType, entitySystem)[componentId], entitySystem.entities[entityId][componentType]);
}

type EntitySystemBuilder = Func<EntitySystem, EntitySystem>;

export function addComponent(component: Component): EntitySystemBuilder;
export function addComponent(component: Component, entitySystem: EntitySystem): EntitySystem;
export function addComponent(component: Component, entitySystem?: EntitySystem): EntitySystem | EntitySystemBuilder {
    const build: EntitySystemBuilder = entitySystem => ({
        entities: {
            ...entitySystem.entities,
            [component.entityId]: {
                ...entitySystem.entities[component.entityId],
                [component.componentType]: maybe.just(entitySystem.components[component.componentType].length)
            }
        },
        components: {
            ...entitySystem.components,
            [component.componentType]: [...entitySystem.components[component.componentType], component]
        }
    });

    return entitySystem ? build(entitySystem): build;
}

export function updateComponent<K extends ComponentType>(oldComponent: SumType<Component, 'componentType', K>, newComponent: SumType<Component, 'componentType', K>, entitySystem: EntitySystem): EntitySystem {
    return {
        ...entitySystem,
        components: {
            ...entitySystem.components,
            [oldComponent.componentType]: components(oldComponent.componentType, entitySystem).map(
                currComponent => currComponent === oldComponent ? newComponent : currComponent
            )
        }
    };
}

export function build(builders: EntitySystemBuilder[], entitySystem: EntitySystem): EntitySystem {
    return builders.reduce(
        (res, builder) => builder(res),
        entitySystem
    );
}