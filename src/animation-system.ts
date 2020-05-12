import type { ZipList } from './zip-list';
import type { State } from './state';
import type { EntitySystem } from './entity-system';
import type { RenderComponent } from './rendering-system';
import * as zipList from './zip-list';
import * as state from './state';

export interface AnimatorComponent extends ZipList<RenderComponent> {
    componentType: 'animator';
    entityId: string;
    frequency: number;
    step: number;
}

export function animatorComponent(entityId: string, frequency: number, renderComponents: RenderComponent[]): AnimatorComponent {
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
            es
                .getComponents('animator')
                .reduce(
                    (es, component) => {
                        const updatedComponent = mapStep(step, component);

                        return es
                            .getEntityComponent(component.entityId, 'render')
                            .match(
                                renderComponent => es.updateComponent(renderComponent, zipList.curr(updatedComponent)),
                                () => es.addComponent(zipList.curr(component))
                            )
                            .updateComponent(component, updatedComponent)
                    },
                    es
                )
        )
        .flatMap(() => state.pure(step));
}