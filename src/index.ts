import type { InputState } from './core';
import type { Position } from './position';
import type { GameState } from './game-state';
import * as rendering from './rendering';
import * as gameState from './game-state';
import * as tileGrid from './tile-grid';

import * as map1 from './map1';
import * as playerSprites from './player-sprites';

async function startGame() {
    const viewPortCanvas = document.getElementById('app') as HTMLCanvasElement;
    
    if (!viewPortCanvas) return;

    const viewPortCtx = viewPortCanvas.getContext('2d');

    const sceneCanvas = document.createElement('canvas');
    const sceneCtx = sceneCanvas.getContext('2d');

    if (!viewPortCtx || !sceneCtx) return;

    let start = 0;
    let inputState: InputState = {};
    let state: GameState = gameState.init(
        await playerSprites.load(),
        await map1.load()
    );

    document.addEventListener('keydown', function (e) {
        inputState[e.keyCode] = true;
    });

    document.addEventListener('keyup', function (e) {
        delete inputState[e.keyCode];
    });

    requestAnimationFrame(function gameLoop(timestamp) {
        const step = timestamp - start;

        state = gameState.update(step, inputState, state);

        renderScene(state, sceneCtx);
        renderView(state.player.position, sceneCanvas, viewPortCtx);

        start = timestamp;
        requestAnimationFrame(gameLoop);
    });
}

function renderScene(state: GameState, sceneCtx: CanvasRenderingContext2D) {
    const canvas = sceneCtx.canvas;

    canvas.width = tileGrid.renderWidth(state.map);
    canvas.height = tileGrid.renderHeigth(state.map);

    sceneCtx.clearRect(0, 0, canvas.width, canvas.height);
    rendering.ap(sceneCtx, gameState.render(state));
}

function renderView(playerPosition: Position, sceneCanvas: HTMLCanvasElement, viewPortCtx: CanvasRenderingContext2D) {
    const scale = 2;
    const viewPortCanvas = viewPortCtx.canvas;

    viewPortCtx.fillStyle = 'black';
    viewPortCtx.fillRect(0, 0, viewPortCanvas.width, viewPortCanvas.height);

    let sx = 0;
    let sy = 0;
    let sw = sceneCanvas.width;
    let sh = sceneCanvas.height;
    let dx = (viewPortCanvas.width - (sceneCanvas.width * scale)) / 2;
    let dy = (viewPortCanvas.height - (sceneCanvas.height * scale)) / 2;
    let dw = sceneCanvas.width * scale;
    let dh = sceneCanvas.height * scale;

    if ((viewPortCanvas.width / scale) < sceneCanvas.width) {
        sx = Math.min(sceneCanvas.width - (viewPortCanvas.width / scale), Math.max(0, playerPosition[0] - (viewPortCanvas.width / (2 * scale)) + 8));
        dx = 0;
        sw = viewPortCanvas.width / scale;
        dw = viewPortCanvas.width;
    }

    if ((viewPortCanvas.height / scale) < sceneCanvas.height) {
        sy = Math.min(sceneCanvas.height - (viewPortCanvas.height / scale), Math.max(0, playerPosition[1] - (viewPortCanvas.height / (2 * scale)) + 8));
        dy = 0;
        sh = viewPortCanvas.height / scale;
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