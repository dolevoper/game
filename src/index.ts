import { Renderer, renderSolidBackground } from './core';
import { renderTile, Tile } from './tile';
import { Sprite, renderSprite, updateSprite } from './sprite';
import * as position from './position';

export type GameState = {
    map: Tile[][],
    player: {
        sprite: Sprite,
        position: position.Position
    }
}

type InputState = { [k: number]: boolean };

async function startGame() {
    const canvas = document.getElementById('app') as HTMLCanvasElement;

    if (!canvas) return;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (!ctx) return;

    let start = 0;
    let inputState: InputState = {};
    let gameState: GameState = {
        map: await (await import('./map1')).load(),
        player: {
            sprite: await (await import('./hero')).load(),
            position: [4 * 16, 4 * 16]
        }
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
        player: {
            sprite: updateSprite(gameState.player.sprite, step),
            position: updatePosition(gameState.player.position, input)
        }
    };
}

function updatePosition(pos: position.Position, input: InputState): position.Position {
    let res = pos;

    if (input[40]) res = position.moveDown(res);
    if (input[38]) res = position.moveUp(res);
    if (input[39]) res = position.moveRight(res);
    if (input[37]) res = position.moveLeft(res);

    return res;
}

function getRenderers(gameState: GameState): Renderer[] {
    return [
        renderSolidBackground('black'),
        ...gameState
            .map
            .flatMap((row, i) => row.map((t, j) => renderTile(t, j + 1, i + 1))),
        renderSprite(gameState.player.sprite, gameState.player.position[0], gameState.player.position[1])
    ];
}

startGame();