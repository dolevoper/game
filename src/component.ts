import type { PositionComponent } from './position-component';
import type { RenderComponent } from './rendering-system';

export type Component = RenderComponent | PositionComponent;
export type ComponentType = Component['componentType'];