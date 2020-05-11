import type { InputState } from './core';
import type { EntitySystem } from './entity-system';
import { compose } from './fp';
import { loadImage } from './core';
import * as state from './state';
import * as entitySystem from './entity-system';
import * as renderingSystem from './rendering-system';
import * as cameraSystem from './camera-system';
import * as positionComponent from './position-component';
import * as movementSystem from './movement-system';

import PeoplesImage from './assets/AH_SpriteSheet_People1.png';
import GrassTileset from './assets/AH_Autotile_Grass.png';
import HouseWallTileset from './assets/AH_Autotile_House_Wall.png';
import HouseRoofTileset from './assets/AH_Autotile_House_Roof.png';

async function startGame() {
    const gameCtx = (document.getElementById('app') as HTMLCanvasElement).getContext('2d');

    if (!gameCtx) return;

    let inputState: InputState = {};

    const [grassImage, houseWallImage, spriteImage, houseRoofImage] = await Promise.all([
        loadImage(GrassTileset),
        loadImage(HouseWallTileset),
        loadImage(PeoplesImage),
        loadImage(HouseRoofTileset)
    ]);
    const tileSize = 16;

    const es: EntitySystem = entitySystem.build([
        entitySystem.addComponent(renderingSystem.sprite(0, 1, {
            image: spriteImage,
            width: 16,
            height: 16,
            x: 0,
            y: 0
        })),
        entitySystem.addComponent(positionComponent.from(0, [16, 16])),
        entitySystem.addComponent(movementSystem.from(0, 32, 0)),
        entitySystem.addComponent(cameraSystem.from(0)),
        entitySystem.addComponent(renderingSystem.fromTileset(1, tileSize, 0, [
            { image: grassImage, x: 8, y: 0, width: tileSize, height: tileSize },
            { image: grassImage, x: 11, y: 0, width: tileSize, height: tileSize },
            { image: grassImage, x: 8, y: 3, width: tileSize, height: tileSize },
            { image: grassImage, x: 11, y: 3, width: tileSize, height: tileSize },
            { image: grassImage, x: 10, y: 0, width: tileSize, height: tileSize },
            { image: grassImage, x: 8, y: 1, width: tileSize, height: tileSize },
            { image: grassImage, x: 11, y: 2, width: tileSize, height: tileSize },
            { image: grassImage, x: 9, y: 3, width: tileSize, height: tileSize },
            { image: grassImage, x: 9, y: 2, width: tileSize, height: tileSize },
            { image: houseWallImage, x: 1, y: 0, width: tileSize, height: tileSize },
            { image: houseWallImage, x: 3, y: 0, width: tileSize, height: tileSize },
            { image: houseWallImage, x: 1, y: 2, width: tileSize, height: tileSize },
            { image: houseWallImage, x: 3, y: 2, width: tileSize, height: tileSize },
            { image: houseWallImage, x: 2, y: 0, width: tileSize, height: tileSize },
            { image: houseWallImage, x: 1, y: 1, width: tileSize, height: tileSize },
            { image: houseWallImage, x: 3, y: 1, width: tileSize, height: tileSize },
            { image: houseWallImage, x: 2, y: 2, width: tileSize, height: tileSize },
            { image: houseWallImage, x: 2, y: 1, width: tileSize, height: tileSize },
            { image: houseRoofImage, x: 8, y: 3, width: tileSize, height: tileSize },
            { image: houseRoofImage, x: 11, y: 3, width: tileSize, height: tileSize },
            { image: houseRoofImage, x: 9, y: 3, width: tileSize, height: tileSize }
        ], `0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,18,20,20,19,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,9,13,13,10,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,14,17,17,15,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,11,16,16,12,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            5,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6
            2,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,3`))
    ], entitySystem.empty());

    document.addEventListener('keydown', function (e) {
        inputState[e.keyCode] = true;
    });

    document.addEventListener('keyup', function (e) {
        delete inputState[e.keyCode];
    });

    const gameLoop = (prevTimeStamp: number, es: EntitySystem) => (timestamp: number) => {
        const step = timestamp - prevTimeStamp;

        const pipeline = compose(
            state.flatMap(cameraSystem.render(gameCtx, 3)),
            state.flatMap(renderingSystem.render),
            state.flatMap(movementSystem.update)
        );
        const s = pipeline(state.pure(step));

        const newState = state.execState(es, s);
        
        requestAnimationFrame(gameLoop(timestamp, newState));
    };

    requestAnimationFrame(gameLoop(0, es));
}

startGame();