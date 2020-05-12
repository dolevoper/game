import type { ZipList } from './zip-list';
import type { State } from './state';
import type { EntitySystem } from './entity-system';
import type { RenderComponent } from './rendering-system';
import * as zipList from './zip-list';
import * as state from './state';
import * as entitySystem from './entity-system';
import { always, identity } from './fp';

export interface AnimatorComponent extends ZipList<RenderComponent> {
    componentType: 'animator';
    entityId: string;
    frequency: number;
    step: number;
}

export interface AnimatorSelectorComponent {
    componentType: 'animatorSelector';
    entityId: string;
    animations: { [state: string]: AnimatorComponent }
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

export function animatorSelectorComponent<T extends string>(entityId: string, animations: { [state in T]: AnimatorComponent }): AnimatorSelectorComponent {
    return {
        componentType: 'animatorSelector',
        entityId,
        animations
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
        .modify<EntitySystem>(es => {
            const updateAnimationSelectors = es
                .getComponents('animatorSelector')
                .map(component => {
                    const stateMachineComponent = es.getEntityComponent(component.entityId, 'stateMachine');
                    const currAnimatorComponent = es.getEntityComponent(component.entityId, 'animator');

                    return stateMachineComponent.match(
                        stateMachine => {
                            const newAnimatorComponent = component.animations[stateMachine.currentState];

                            return currAnimatorComponent.match(
                                currAnimator => entitySystem.updateComponent(currAnimator, newAnimatorComponent),
                                () => entitySystem.addComponent(newAnimatorComponent)
                            )
                        },
                        always(identity)
                    );
                })

            const updateAnimations = es
                .getComponents('animator')
                .flatMap(component => {
                    const updatedComponent = mapStep(step, component);

                    return [entitySystem.updateComponent(component, updatedComponent), es
                        .getEntityComponent(component.entityId, 'render')
                        .match(
                            renderComponent => entitySystem.updateComponent(renderComponent, zipList.curr(updatedComponent)),
                            () => entitySystem.addComponent(zipList.curr(component))
                        )];
                });

                return es.evolve([...updateAnimationSelectors, ...updateAnimations]);
        })
        .flatMap(() => state.pure(step));
}