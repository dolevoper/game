import type { InputState } from './core';
import type { Renderer } from './rendering';
import type { Position } from './position';
import type { GameMap } from './game-map';
import type { Player } from './player';
import * as rendering from './rendering';
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

        renderScene(gameState, sceneCtx);

        viewPortCtx.fillStyle = 'black';
        viewPortCtx.fillRect(0, 0, viewPortCanvas.width, viewPortCanvas.height);
        renderView(gameState.player.position, sceneCanvas, viewPortCtx);

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

function renderScene(gameState: GameState, sceneCtx: CanvasRenderingContext2D) {
    const canvas = sceneCtx.canvas;

    canvas.width = gameMap.width(gameState.map);
    canvas.height = gameMap.height(gameState.map);

    sceneCtx.clearRect(0, 0, canvas.width, canvas.height);
    rendering.render(sceneCtx, getRenderers(gameState));
}

function renderView(playerPosition: Position, sceneCanvas: HTMLCanvasElement, viewPortCtx: CanvasRenderingContext2D) {
    const viewPortCanvas = viewPortCtx.canvas;

    let sx = 0;
    let sy = 0;
    let sw = sceneCanvas.width;
    let sh = sceneCanvas.height;
    let dx = (viewPortCanvas.width - sceneCanvas.width) / 2;
    let dy = (viewPortCanvas.height - sceneCanvas.height) / 2;
    let dw = sceneCanvas.width;
    let dh = sceneCanvas.height;

    if (viewPortCanvas.width < sceneCanvas.width) {
        sx = Math.min(sceneCanvas.width - viewPortCanvas.width, Math.max(0, playerPosition[0] - (viewPortCtx.canvas.width / 2) + 8));
        dx = 0;
        sw = viewPortCanvas.width;
        dw = viewPortCanvas.width;
    }

    if (viewPortCanvas.height < sceneCanvas.height) {
        sy = Math.min(sceneCanvas.height - viewPortCanvas.height, Math.max(0, playerPosition[1] - (viewPortCtx.canvas.height / 2) + 8));
        dy = 0;
        sh = viewPortCanvas.height;
        dh = viewPortCanvas.height;
    }
    
    viewPortCtx.drawImage(
        sceneCanvas,
        sx,
        sy,
        sw,
        sh,
        dx,
        dy,
        dw,
        dh
    );
}

startGame();