import { renderTile } from './tileset.js';

async function startGame() {
    const gameCanvas = document.getElementById('app');
    const ctx = gameCanvas.getContext('2d');

    const map = await (await import('./map1.js')).load();

    let prev = 0;

    requestAnimationFrame(function gameLoop(timestamp) {
        const deltaT = timestamp - prev;

        ctx.fillColor = 'black';
        ctx.fillRect(0, 0, 900, 900);

        map
            .flatMap((row, i) => row.map((t, j) => renderTile(t, j + 1, i + 1)))
            .forEach(renderer => renderer(ctx));

        prev = timestamp;
        requestAnimationFrame(gameLoop);
    });
}

startGame();