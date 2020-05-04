import type { Renderer, InputState } from './core';
import type { GameMap } from './game-map';
import type { Player } from './player';
import * as player from './player';
import * as gameMap from './game-map';

import * as map1 from './map1';
import * as playerSprites from './player-sprites';

export type GameState = {
    map: GameMap,
    player: Player
}

async function startGame() {
    const viewPortCanvas = document.getElementById('app') as HTMLCanvasElement;
    
    if (!viewPortCanvas) return;
    
    const viewPortCtx = viewPortCanvas.getContext('2d');

    const gameCanvas = document.createElement('canvas');
    const gameCtx = gameCanvas.getContext('2d');

    if (!viewPortCtx || !gameCtx) return;

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

        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        getRenderers(gameState).forEach(renderer => renderer(gameCtx));

        viewPortCtx.fillStyle = 'black';
        viewPortCtx.fillRect(0, 0, viewPortCanvas.width, viewPortCanvas.height);
        viewPortCtx.drawImage(
            gameCanvas,
            gameState.player.position[0] - (viewPortCanvas.width / 2) + 8,
            gameState.player.position[1] - (viewPortCanvas.height / 2) + 8,
            viewPortCanvas.width,
            viewPortCanvas.height,
            0,
            0,
            viewPortCanvas.width,
            viewPortCanvas.height
        );

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
        gameMap.render(gameState.map),
        player.render(gameState.player)
    ];
}

startGame();