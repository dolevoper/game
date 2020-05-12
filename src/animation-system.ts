import type { ZipList } from './zip-list';
import type { State } from './state';
import type { EntitySystem } from './entity-system';
import type { RenderComponent } from './rendering-system';
import * as zipList from './zip-list';
import * as state from './state';
import * as entitySystem from './entity-system';

export interface AnimatorComponent extends ZipList<RenderComponent> {
    componentType: 'animator';
    entityId: number;
    frequency: number;
    step: number;
}

export function fromRenderComponents(entityId: number, frequency: number, renderComponents: RenderComponent[]): AnimatorComponent {
    return {
        componentType: 'animator',
        entityId,
        ...zipList.fromArray(renderComponents),
        frequency,
        step: 0
    };
}

function mapStep(step: number, animatorComponent: AnimatorComponent): AnimatorComponent {
    const frameCount = zipList.length(animatorComponent);
    const requiredStep = 1000 / frameCount * animatorComponent.frequency;

    step += animatorComponent.step;

    if (step < requiredStep) return { ...animatorComponent, step };

    const currFrame = zipList.position(animatorComponent);
    const nextFrame = (currFrame + Math.floor(step / requiredStep)) % frameCount;

    return {
        ...animatorComponent,
        ...zipList.moveTo(nextFrame, animatorComponent),
        step: step % requiredStep
    };
}

export function update(step: number): State<EntitySystem, number> {
    return state
        .modify<EntitySystem>(es =>
            entitySystem
                .components('animator', es)
                .reduce(
                    (es, component) => {
                        const updatedComponent = mapStep(step, component);

                        const updatedES = entitySystem.component(component.entityId, 'render', es).match(
                            renderComponent => entitySystem.updateComponent(renderComponent, zipList.curr(updatedComponent), es),
                            () => entitySystem.addComponent(zipList.curr(component), es)
                        )

                        return entitySystem.updateComponent(component, updatedComponent, updatedES);
                    },
                    es
                )
        )
        .flatMap(() => state.pure(step));
}