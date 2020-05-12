import type { EntitySystem } from './entity-system';
import { loadImage } from './core';
import * as state from './state';
import * as entitySystem from './entity-system';
import * as renderingSystem from './rendering-system';
import * as cameraSystem from './camera-system';
import * as inputSystem from './input-system';
import * as positionComponent from './position-component';
import * as movementSystem from './movement-system';
import * as animationSystem from './animation-system';

import PeoplesImage from './assets/AH_SpriteSheet_People1.png';
import GrassTileset from './assets/AH_Autotile_Grass.png';
import HouseWallTileset from './assets/AH_Autotile_House_Wall.png';
import HouseRoofTileset from './assets/AH_Autotile_House_Roof.png';

async function startGame() {
    const gameCtx = (document.getElementById('app') as HTMLCanvasElement).transferControlToOffscreen().getContext('2d');

    if (!gameCtx) return;

    gameCtx.imageSmoothingEnabled = false;

    const [grassImage, houseWallImage, spriteImage, houseRoofImage] = await Promise.all([
        loadImage(GrassTileset),
        loadImage(HouseWallTileset),
        loadImage(PeoplesImage),
        loadImage(HouseRoofTileset)
    ]);
    const tileSize = 16;

    const es: EntitySystem = entitySystem.build([
        entitySystem.addComponent(animationSystem.fromRenderComponents(0, 0.5, [
            renderingSystem.sprite(0, 1, {
                image: spriteImage,
                width: 16,
                height: 16,
                x: 0,
                y: 0
            }),
            renderingSystem.sprite(0, 1, {
                image: spriteImage,
                width: 16,
                height: 16,
                x: 16,
                y: 0
            }),
            renderingSystem.sprite(0, 1, {
                image: spriteImage,
                width: 16,
                height: 16,
                x: 32,
                y: 0
            }),
            renderingSystem.sprite(0, 1, {
                image: spriteImage,
                width: 16,
                height: 16,
                x: 16,
                y: 0
            })
        ])),
        entitySystem.addComponent(positionComponent.from(0, [16, 16])),
        entitySystem.addComponent(movementSystem.from(0, 0, 0)),
        entitySystem.addComponent(cameraSystem.from(0, [8, 8])),
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
            2,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,3`)),
        entitySystem.addComponent(renderingSystem.fromTileset(1, 16, 2, [
            { image: houseRoofImage, height: 16, width: 16, x: 8, y: 0 },
            { image: houseRoofImage, height: 16, width: 16, x: 9, y: 0 },
            { image: houseRoofImage, height: 16, width: 16, x: 11, y: 0 }
        ], `\n\n\n\n\n,,,,,,,,,,0,1,1,2`))
    ], entitySystem.empty());

    const gameLoop = (prevTimeStamp: number, es: EntitySystem) => (timestamp: number) => {
        const step = timestamp - prevTimeStamp;

        const newState = state
            .pure<EntitySystem, number>(step)
            .flatMap(inputSystem.update)
            .flatMap(animationSystem.update)
            .flatMap(movementSystem.update)
            .flatMap(renderingSystem.render)
            .flatMap(cameraSystem.render(gameCtx, 3))
            .execWith(es);

        requestAnimationFrame(gameLoop(timestamp, newState));
    };

    requestAnimationFrame(gameLoop(0, es));
}

startGame();