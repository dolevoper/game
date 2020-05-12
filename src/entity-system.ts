import type { SumType } from './fp';
import type { Maybe } from './maybe';
import type { ComponentType, Component } from './component';
import * as maybe from './maybe';

type Entity = { [K in ComponentType]: number[] };

export interface EntitySystem {
    entities: { [id: string]: Entity };
    components: { [K in ComponentType]: SumType<Component, 'componentType', K>[] };
    getComponents<K extends ComponentType>(componentType: K): SumType<Component, 'componentType', K>[];
    getEntityComponent<K extends ComponentType>(entityId: string, componentType: K): Maybe<SumType<Component, 'componentType', K>>;
    addComponent(component: Component): EntitySystem;
    updateComponent(oldComponent: Component, newComponent: Component): EntitySystem;
}

function entitySystem(entities: { [id: string]: Entity }, components: { [K in ComponentType]: SumType<Component, 'componentType', K>[] }): EntitySystem {
    return {
        entities,
        components,
        getComponents<K extends ComponentType>(componentType: K) {
            return components[componentType] as SumType<Component, 'componentType', K>[];
        },
        getEntityComponent(entityId, componentType) {
            const entityComponents = entities[entityId][componentType];
            
            return entityComponents.length ? maybe.just(this.getComponents(componentType)[entityComponents[0]]) : maybe.nothing();
        },
        addComponent(component) {
            const updatedEntity = entities[component.entityId] || emptyEntity();

            return entitySystem(
                {
                    ...entities,
                    [component.entityId]: {
                        ...updatedEntity,
                        [component.componentType]: [...updatedEntity[component.componentType], components[component.componentType].length]
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
        cameraFocus: [],
        movement: [],
        position: [],
        render: [],
        animator: []
    };
}