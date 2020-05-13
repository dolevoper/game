import type { EntitySystem } from './entity-system';
import { compose, chainPromise } from './fp';
import * as state from './state';
import * as entitySystem from './entity-system';
import * as renderingSystem from './rendering-system';
import * as cameraSystem from './camera-system';
import * as inputSystem from './input-system';
import * as movementSystem from './movement-system';
import * as animationSystem from './animation-system';
import * as stateSystem from './state-system';
import * as collisionSystem from './collision-system';

import * as playerEntity from './entities/player';
import * as terrainEntity from './entities/terrain';

const loadEntities = compose(chainPromise(terrainEntity.load), playerEntity.load);

async function startGame() {
    const gameCtx = (document.getElementById('app') as HTMLCanvasElement).transferControlToOffscreen().getContext('2d');

    if (!gameCtx) return;

    gameCtx.imageSmoothingEnabled = false;

    const es: EntitySystem = await loadEntities(entitySystem.empty());

    const gameLoop = (prevTimeStamp: number, es: EntitySystem) => (timestamp: number) => {
        const step = timestamp - prevTimeStamp;

        const newState = state
            .pure<EntitySystem, number>(step)
            .flatMap(inputSystem.update)
            .flatMap(stateSystem.update)
            .flatMap(animationSystem.update)
            .flatMap(movementSystem.update)
            .flatMap(collisionSystem.update)
            .flatMap(renderingSystem.render)
            .flatMap(cameraSystem.render(gameCtx, 3))
            .execWith(es);

        requestAnimationFrame(gameLoop(timestamp, newState));
    };

    requestAnimationFrame(gameLoop(0, es));
}

startGame();