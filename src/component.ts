import type { PositionComponent } from './position-component';
import type { RenderComponent } from './rendering-system';
import type { MovementComponent } from './movement-system';
import type { CameraFocusComponent } from './camera-system';
import type { AnimatorComponent } from './animation-system';

export type Component = RenderComponent | PositionComponent | MovementComponent | CameraFocusComponent | AnimatorComponent;
export type ComponentType = Component['componentType'];