import { loadImage } from './load-image.js';
import { renderTile } from './tileset.js';
import { frame, sprite } from './sprite.js';

async function startGame() {
    const gameCanvas = document.getElementById('app');
    const ctx = gameCanvas.getContext('2d');

    const map = await (await import('./map1.js')).load();

    const peopleImage = await loadImage('./assets/AH_SpriteSheet_People1.png');
    const heroSprite = sprite(peopleImage, 16 [
        frame(0, 1), frame(0, 2), frame(0, 1), frame(0, 0)
    ]);

    let prev = 0;
    const animationStepSize = 1000 / 4;
    let step = 0;
    let currFrame = 1;

    requestAnimationFrame(function gameLoop(timestamp) {
        const deltaT = timestamp - prev;

        ctx.fillColor = 'black';
        ctx.fillRect(0, 0, 900, 900);

        map
            .flatMap((row, i) => row.map((t, j) => renderTile(t, j + 1, i + 1)))
            .forEach(renderer => renderer(ctx));

        step += deltaT;
        if (step >= animationStepSize) {
            step = 0;
            currFrame = (currFrame + 1) % 3;
        }
        const frameToDraw = heroSprite.frames[currFrame];
        ctx.drawImage(peopleImage, frameToDraw.j * 16, 0, 16, 16, 5 * 16, 5 * 16, 16, 16);

        prev = timestamp;
        requestAnimationFrame(gameLoop);
    });
}

startGame();