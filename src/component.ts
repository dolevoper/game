import type { RenderComponent } from './rendering-system';

export interface PositionComponent {
    componentType: 'position';
    entityId: number;
}

export type Component = RenderComponent | PositionComponent;
export type ComponentType = Component['componentType'];