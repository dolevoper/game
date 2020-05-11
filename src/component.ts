import type { PositionComponent } from './position-component';
import type { RenderComponent } from './rendering-system';
import type { MovementComponent } from './movement-system';

export type Component = RenderComponent | PositionComponent | MovementComponent;
export type ComponentType = Component['componentType'];