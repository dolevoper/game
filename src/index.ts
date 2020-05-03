import { Renderer, renderSolidBackground } from './core';
import { renderTile, Tile } from './tile';
import { Sprite, renderSprite, updateSprite } from './sprite';

export type GameState = { map: Tile[][], player: Sprite }

async function startGame() {
    const canvas = document.getElementById('app') as HTMLCanvasElement;

    if (!canvas) return;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (!ctx) return;

    let start = 0;
    let gameState: GameState = {
        map: await (await import('./map1')).load(),
        player: await (await import('./hero')).load()
    };

    requestAnimationFrame(function gameLoop(timestamp) {
        const step = timestamp - start;

        gameState = update(gameState, step);
        getRenderers(gameState).forEach(renderer => renderer(ctx));

        start = timestamp;
        requestAnimationFrame(gameLoop);
    });
}

function update(gameState: GameState, step: number): GameState {
    return {
        ...gameState,
        player: updateSprite(gameState.player, step)
    };
}

function getRenderers(gameState: GameState): Renderer[] {
    return [
        renderSolidBackground('black'),
        ...gameState
            .map
            .flatMap((row, i) => row.map((t, j) => renderTile(t, j + 1, i + 1))),
        renderSprite(gameState.player, 4, 4)
    ];
}

startGame();