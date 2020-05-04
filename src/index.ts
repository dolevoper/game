import { Renderer, renderSolidBackground, InputState } from './core';
import type { Sprite } from './sprite';
import type { Player } from './player';
import * as sprite from './sprite';
import * as player from './player';

import * as map1 from './map1';
import * as playerSprites from './player-sprites';

export type GameState = {
    map: Sprite[][],
    player: Player
}

async function startGame() {
    const canvas = document.getElementById('app') as HTMLCanvasElement;

    if (!canvas) return;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (!ctx) return;

    let start = 0;
    let inputState: InputState = {};
    let gameState: GameState = {
        map: await map1.load(),
        player: player.fromSprites(await playerSprites.load())
    };

    document.addEventListener('keydown', function (e) {
        inputState[e.keyCode] = true;
    });

    document.addEventListener('keyup', function (e) {
        delete inputState[e.keyCode];
    });

    requestAnimationFrame(function gameLoop(timestamp) {
        const step = timestamp - start;

        gameState = update(gameState, step, inputState);
        getRenderers(gameState).forEach(renderer => renderer(ctx));

        start = timestamp;
        requestAnimationFrame(gameLoop);
    });
}

function update(gameState: GameState, step: number, input: InputState): GameState {
    return {
        ...gameState,
        player: player.update(step, input, gameState.player)
    };
}

function getRenderers(gameState: GameState): Renderer[] {
    return [
        renderSolidBackground('black'),
        ...gameState
            .map
            .flatMap((row, i) => row.map((t, j) => sprite.renderOnGrid(t, j + 1, i + 1))),
        player.render(gameState.player)
    ];
}

startGame();