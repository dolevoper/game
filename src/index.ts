import type { InputState } from './core';
import type { GameState } from './game-state';
import * as rendering from './rendering';
import * as gameState from './game-state';

import * as map1 from './map1';
import * as playerSprites from './player-sprites';

async function startGame() {
    const gameCtx = (document.getElementById('app') as HTMLCanvasElement).getContext('2d');
    
    if (!gameCtx) return;

    const [player, { layer1, layer2, colliders }] = await Promise.all([
        await playerSprites.load(),
        await map1.load()
    ]);

    let start = 0;
    let inputState: InputState = {};
    let state: GameState = gameState.init(
        player,
        layer1,
        layer2,
        colliders
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

        render(state, gameCtx);

        start = timestamp;
        requestAnimationFrame(gameLoop);
    });
}

function render(state: GameState, ctx: CanvasRenderingContext2D) {
    const scale = 3;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    rendering.ap(ctx, gameState.render(scale, state));
}

startGame();