import type { PositionComponent } from './position-component';
import type { RenderComponent } from './rendering-system';
import type { MovementComponent } from './movement-system';
import type { CameraFocusComponent } from './camera-system';
import type { AnimatorComponent, AnimatorSelectorComponent } from './animation-system';
import type { StateMachineComponent } from './state-machine-component';

export type Component = 
    | RenderComponent
    | PositionComponent
    | MovementComponent
    | CameraFocusComponent
    | AnimatorComponent
    | StateMachineComponent
    | AnimatorSelectorComponent;

export type ComponentType = Component['componentType'];