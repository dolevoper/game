import type { InputState } from './core';
import type { Renderer } from './rendering';
import type { Player, PlayerStateSprites } from './player';
import type { TileGrid } from './tile-grid';
import * as rendering from './rendering';
import * as player from './player';
import * as tileGrid from './tile-grid';

export interface GameState {
    player: Player;
    map: TileGrid;
}

export function init(playerStateSprites: PlayerStateSprites, map: TileGrid): GameState {
    return {
        player: player.fromSprites(playerStateSprites),
        map
    };
}

export function render(gameState: GameState): Renderer {
    return rendering.combineRenderers([
        tileGrid.render(gameState.map),
        player.render(gameState.player)
    ]);
}

export function update(step: number, input: InputState, gameState: GameState): GameState {
    return {
        ...gameState,
        player: player.update(step, input, gameState.player)
    };
}