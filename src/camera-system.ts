import type { Func } from './fp';
import type { State } from './state';
import type { EntitySystem } from './entity-system';
import * as state from './state';

export interface CameraFocusComponent {
    componentType: 'cameraFocus';
    entityId: number;
}

export function from(entityId: number): CameraFocusComponent {
    return {
        componentType: 'cameraFocus',
        entityId
    };
}

export function render(viewPortCtx: CanvasRenderingContext2D): Func<HTMLCanvasElement, State<EntitySystem, void>> {
    return sceneCanvas => state.get(es => {
        viewPortCtx.drawImage(sceneCanvas, 0, 0);
    });
}