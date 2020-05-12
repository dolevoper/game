import { Func, compose } from './fp';
import type { Maybe } from './maybe';
import type { State } from './state';
import type { Position } from './position';
import type { EntitySystem } from './entity-system';
import type { PositionComponent } from './position-component';
import * as maybe from './maybe';
import * as state from './state';
import * as position from './position';
import * as entitySystem from './entity-system';

export interface CameraFocusComponent {
    componentType: 'cameraFocus';
    entityId: number;
    offset: Position;
}

export function from(entityId: number, offset: Position = [0, 0]): CameraFocusComponent {
    return {
        componentType: 'cameraFocus',
        entityId,
        offset
    };
}

export function render(viewPortCtx: OffscreenCanvasRenderingContext2D, scale: number = 1): Func<OffscreenCanvas, State<EntitySystem, void>> {
    return sceneCanvas => state.get(es => {
        const cameraFocusComponents = entitySystem.components('cameraFocus', es);
        const cameraFocus: Maybe<CameraFocusComponent> = cameraFocusComponents.length ? maybe.just(cameraFocusComponents[0]) : maybe.nothing();
        const offset = cameraFocus.map(cfc => cfc.offset).withDefault([0, 0]);
        
        const focusPosition = cameraFocus
            .flatMap(cameraFocusComponent => entitySystem.component(cameraFocusComponent.entityId, 'position', es))
            .map(pc => pc.position)
            .map(position.add(offset))
            .withDefault(offset);

        const viewPortWidth = viewPortCtx.canvas.width;
        const viewPortHeight = viewPortCtx.canvas.height;

        const sourceWidth = Math.min(viewPortWidth / scale, sceneCanvas.width);
        const sourceHeight = Math.min(viewPortHeight / scale, sceneCanvas.height);

        const [sourceX, sourceY] = position.clamp(
            position.fromScalar(0),
            position.add([sourceWidth / -2, sourceHeight / -2], focusPosition),
            [sceneCanvas.width - sourceWidth, sceneCanvas.height - sourceHeight]
        );

        const destinationWidth = sourceWidth * scale;
        const destinationHeight = sourceHeight * scale;

        const destinationX = (viewPortWidth - destinationWidth) / 2;
        const destinationY = (viewPortHeight - destinationHeight) / 2;

        viewPortCtx.fillStyle = 'black';
        viewPortCtx.fillRect(0, 0, viewPortWidth, viewPortHeight);
        viewPortCtx.drawImage(
            sceneCanvas,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            destinationX,
            destinationY,
            destinationWidth,
            destinationHeight
        );
    });
}