import type { Renderer, InputState } from './core';
import type { Position } from './position';
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

    const sceneCanvas = document.createElement('canvas');
    const sceneCtx = sceneCanvas.getContext('2d');

    if (!viewPortCtx || !sceneCtx) return;

    sceneCanvas.width = 72 * 16;
    sceneCanvas.height = 72 * 16;

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

        sceneCtx.clearRect(0, 0, sceneCanvas.width, sceneCanvas.height);
        getRenderers(gameState).forEach(renderer => renderer(sceneCtx));

        viewPortCtx.fillStyle = 'black';
        viewPortCtx.fillRect(0, 0, viewPortCanvas.width, viewPortCanvas.height);
        render(gameState.player.position, sceneCanvas, viewPortCtx);

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

function render(playerPosition: Position, sceneCanvas: HTMLCanvasElement, viewPortCtx: CanvasRenderingContext2D) {
    const sceneWidthBiggerThanViewPort = sceneCanvas.width > viewPortCtx.canvas.width;
    const sceneHeightBiggerThanViewPort = sceneCanvas.height > viewPortCtx.canvas.height;
    
    viewPortCtx.drawImage(
        sceneCanvas,
        sceneWidthBiggerThanViewPort ? playerPosition[0] - (viewPortCtx.canvas.width / 2) + 8 : 0,
        sceneHeightBiggerThanViewPort ? playerPosition[1] - (viewPortCtx.canvas.height / 2) + 8 : 0,
        sceneWidthBiggerThanViewPort ? viewPortCtx.canvas.width : sceneCanvas.width,
        sceneHeightBiggerThanViewPort ? viewPortCtx.canvas.height : sceneCanvas.height,
        sceneWidthBiggerThanViewPort ? 0 : (viewPortCtx.canvas.width - sceneCanvas.width) / 2,
        sceneHeightBiggerThanViewPort ? 0 : (viewPortCtx.canvas.height - sceneCanvas.height) / 2,
        sceneWidthBiggerThanViewPort ? viewPortCtx.canvas.width : sceneCanvas.width,
        sceneHeightBiggerThanViewPort ? viewPortCtx.canvas.height : sceneCanvas.height
    );
}

startGame();