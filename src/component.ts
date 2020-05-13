import type { PositionComponent } from './position-component';
import type { RenderComponent } from './rendering-system';
import type { MovementComponent } from './movement-system';
import type { CameraFocusComponent } from './camera-system';
import type { AnimatorComponent, AnimatorSelectorComponent } from './animation-system';
import type { InputStateMachineComponent } from './state-system';
import type { InputComponent } from './input-system';
import type { ColliderComponent } from './collision-system';

export type Component = 
    | RenderComponent
    | PositionComponent
    | MovementComponent
    | CameraFocusComponent
    | AnimatorComponent
    | AnimatorSelectorComponent
    | InputComponent
    | InputStateMachineComponent
    | ColliderComponent;

export type ComponentType = Component['componentType'];