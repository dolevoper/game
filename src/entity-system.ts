import type { SumType } from './fp';
import type { Maybe } from './maybe';
import type { ComponentType, Component } from './component';
import * as maybe from './maybe';

type Entity = { [K in ComponentType]: Maybe<number> };

export interface EntitySystem {
    entities: { [id: number]: Entity };
    components: { [K in ComponentType]: SumType<Component, 'componentType', K>[] };
    getComponents<K extends ComponentType>(componentType: K): SumType<Component, 'componentType', K>[];
    getEntityComponent<K extends ComponentType>(entityId: number, componentType: K): Maybe<SumType<Component, 'componentType', K>>;
    addComponent(component: Component): EntitySystem;
    updateComponent(oldComponent: Component, newComponent: Component): EntitySystem;
}

function entitySystem(entities: { [id: number]: Entity }, components: { [K in ComponentType]: SumType<Component, 'componentType', K>[] }): EntitySystem {
    return {
        entities,
        components,
        getComponents<K extends ComponentType>(componentType: K) {
            return components[componentType] as SumType<Component, 'componentType', K>[];
        },
        getEntityComponent(entityId, componentType) {
            return entities[entityId][componentType].map(componentId => this.getComponents(componentType)[componentId]);
        },
        addComponent(component) {
            const updatedEntity = entities[component.entityId] || emptyEntity();

            return entitySystem(
                {
                    ...entities,
                    [component.entityId]: {
                        ...updatedEntity,
                        [component.componentType]: maybe.just(components[component.componentType].length)
                    }
                },
                {
                    ...components,
                    [component.componentType]: [...components[component.componentType], component]
                }
            );
        },
        updateComponent(oldComponent, newComponent) {
            return entitySystem(entities, {
                ...components,
                [oldComponent.componentType]: this.getComponents(oldComponent.componentType).map(component => component === oldComponent ? newComponent : component)
            })
        }
    };
}

export function empty(): EntitySystem {
    return entitySystem({}, {
        render: [],
        position: [],
        movement: [],
        cameraFocus: [],
        animator: []
    });
}

function emptyEntity(): Entity {
    return {
        cameraFocus: maybe.nothing(),
        movement: maybe.nothing(),
        position: maybe.nothing(),
        render: maybe.nothing(),
        animator: maybe.nothing()
    };
}