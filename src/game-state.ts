import type { InputState } from './core';
import type { Renderer } from './rendering';
import type { Player, PlayerStateSprites } from './player';
import type { TileGrid } from './tile-grid';
import type { Collider } from './collider';
import * as position from './position';
import * as rendering from './rendering';
import * as player from './player';
import * as tileGrid from './tile-grid';

export interface GameState {
    player: Player;
    layer1: TileGrid;
    layer2: TileGrid;
    staticColliders: Collider[]
}

export function init(playerStateSprites: PlayerStateSprites, layer1: TileGrid, layer2: TileGrid, staticColliders: Collider[]): GameState {
    return {
        player: player.fromSprites(playerStateSprites),
        layer1,
        layer2,
        staticColliders
    };
}

export function update(step: number, input: InputState, gameState: GameState): GameState {
    const res = {
        ...gameState,
        player: player.update(step, input, gameState.staticColliders, gameState.player)
    };

    res.player.position = position.clamp(
        [0, 0],
        res.player.position,
        [tileGrid.renderWidth(res.layer1) - res.player.sprite.size, tileGrid.renderHeigth(res.layer1) - res.player.sprite.size]
    );

    return res;
}

export function render(scale: number, gameState: GameState): Renderer {
    return ctx => {
        const scene = document.createElement('canvas');

        scene.width = tileGrid.renderWidth(gameState.layer1);
        scene.height = tileGrid.renderHeigth(gameState.layer1);

        const sceneCtx = scene.getContext('2d');

        if (!sceneCtx) return;

        rendering.ap(sceneCtx, renderScene(gameState));

        const viewPortWidth = ctx.canvas.width;
        const viewPortHeight = ctx.canvas.height;

        const sourceWidth = Math.min(viewPortWidth / scale, scene.width);
        const sourceHeight = Math.min(viewPortHeight / scale, scene.height);

        const [sourceX, sourceY] = position.clamp(
            position.fromScalar(0),
            position.build([
                position.add(position.fromScalar(gameState.player.sprite.size / -2)),
                position.add([sourceWidth / -2, sourceHeight / -2])
            ], gameState.player.position),
            [scene.width - sourceWidth, scene.height - sourceHeight]
        );

        const destinationWidth = sourceWidth * scale;
        const destinationHeight = sourceHeight * scale;

        const destinationX = (viewPortWidth - destinationWidth) / 2;
        const destinationY = (viewPortHeight - destinationHeight) / 2;

        ctx.drawImage(
            scene,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            destinationX,
            destinationY,
            destinationWidth,
            destinationHeight
        );
    };
}

function renderScene(gameState: GameState): Renderer {
    return rendering.combineRenderers([
        tileGrid.render(new DOMMatrix(), gameState.layer1),
        player.render(gameState.player),
        tileGrid.render(new DOMMatrix(), gameState.layer2)
    ]);
}