import type { InputState } from './core';
import type { Position } from './position';
import type { Renderer } from './rendering';
import type { Player, PlayerStateSprites } from './player';
import type { TileGrid } from './tile-grid';
import * as position from './position';
import * as rendering from './rendering';
import * as player from './player';
import * as tileGrid from './tile-grid';

export interface GameState {
    player: Player;
    map: TileGrid;
    house: TileGrid & { position: Position };
}

export function init(playerStateSprites: PlayerStateSprites, map: TileGrid, house: TileGrid & { position: Position }): GameState {
    return {
        player: player.fromSprites(playerStateSprites),
        map,
        house
    };
}

export function update(step: number, input: InputState, gameState: GameState): GameState {
    const res = {
        ...gameState,
        player: player.update(step, input, gameState.player)
    };

    res.player.position = position.clamp(
        [0, 0],
        res.player.position,
        [tileGrid.renderWidth(res.map) - res.player.sprite.size, tileGrid.renderHeigth(res.map) - res.player.sprite.size]
    );

    return res;
}

export function render(scale: number, gameState: GameState): Renderer {
    return ctx => {
        const scene = document.createElement('canvas');

        scene.width = tileGrid.renderWidth(gameState.map);
        scene.height = tileGrid.renderHeigth(gameState.map);

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
        tileGrid.render(gameState.map),
        ctx => {
            ctx.setTransform(1, 0, 0, 1, gameState.house.position[0], gameState.house.position[1]);
            rendering.ap(ctx, tileGrid.render(gameState.house));
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        },
        player.render(gameState.player)
    ]);
}