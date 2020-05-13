import type { Position } from '../position';
import type { EntitySystem } from '../entity-system';
import { loadImage } from '../core';
import * as entitySystem from '../entity-system';
import * as renderingSystem from '../rendering-system';
import * as positionComponent from '../position-component';
import * as collisionSystem from '../collision-system';

import GrassTileset from '../assets/AH_Autotile_Grass.png';
import HouseWallTileset from '../assets/AH_Autotile_House_Wall.png';
import HouseRoofTileset from '../assets/AH_Autotile_House_Roof.png';
import ObjectsTileset from '../assets/AH_Tileset.png';

const terrainEntityId = 'terrain';
const tileSize = 16;
const bushEntityId = (num: number) => `terrain-bush${num}`;

export async function load(es: EntitySystem): Promise<EntitySystem> {;
    const [grassImage, houseWallImage, houseRoofImage, objectsImage] = await Promise.all([
        loadImage(GrassTileset),
        loadImage(HouseWallTileset),
        loadImage(HouseRoofTileset),
        loadImage(ObjectsTileset)
    ]);

    const addBush = (num: number, pos: Position) => [
        entitySystem.addComponent(positionComponent.positionComponent(bushEntityId(num), pos)),
        entitySystem.addComponent(renderingSystem.sprite(bushEntityId(num), 1, {
            image: objectsImage,
            height: tileSize,
            width: tileSize,
            x: 0,
            y: 5 * tileSize
        }))
    ];

    return es
        .addComponent(collisionSystem.boxCollider(terrainEntityId, [-1, -1], tileSize * 20 + 2, 1))
        .addComponent(renderingSystem.fromTileset(terrainEntityId, tileSize, 0, [
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
        .addComponent(renderingSystem.fromTileset(terrainEntityId, tileSize, 2, [
            { image: houseRoofImage, height: tileSize, width: tileSize, x: 8, y: 0 },
            { image: houseRoofImage, height: tileSize, width: tileSize, x: 9, y: 0 },
            { image: houseRoofImage, height: tileSize, width: tileSize, x: 11, y: 0 }
        ], `\n\n\n\n\n,,,,,,,,,,0,1,1,2`))
        .evolve([
            ...addBush(1, [3, 3]),
            ...addBush(2, [100, 30]),
            ...addBush(3, [150, 60]),
            ...addBush(4, [97, 100]),
            ...addBush(5, [250, 40]),
            ...addBush(6, [260, 45]),
            ...addBush(7, [120, 200]),
            ...addBush(8, [130, 210]),
            ...addBush(9, [200, 250]),
            ...addBush(10, [260, 260]),
            ...addBush(11, [240, 200]),
            ...addBush(12, [30, 270]),
            ...addBush(13, [42, 267])
        ]);
}