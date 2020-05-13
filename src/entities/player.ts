import type { EntitySystem } from '../entity-system';
import { loadImage } from '../core';
import * as renderingSystem from '../rendering-system';
import * as cameraSystem from '../camera-system';
import * as inputSystem from '../input-system';
import * as positionComponent from '../position-component';
import * as movementSystem from '../movement-system';
import * as animationSystem from '../animation-system';
import * as stateSystem from '../state-system';
import * as collisionSystem from '../collision-system';

import PeoplesImage from '../assets/AH_SpriteSheet_People1.png';

const moveLeftKey = 37;
const moveUpKey = 38;
const moveRightKey = 39;
const moveDownKey = 40;

const playerEntityId = 'player';
const playerSpriteSize = 16;

export async function load(es: EntitySystem): Promise<EntitySystem> {
    const peopleSprites = await loadImage(PeoplesImage);

    return es
        .addComponent(inputSystem.emptyInputComponent(playerEntityId))
        .addComponent(positionComponent.positionComponent(playerEntityId, [playerSpriteSize, playerSpriteSize]))
        .addComponent(movementSystem.movementComponent(playerEntityId, 0, 0))
        .addComponent(cameraSystem.cameraFocusComponent(playerEntityId, [playerSpriteSize / 2, playerSpriteSize / 2]))
        .addComponent(collisionSystem.boxCollider(playerEntityId, [0, 0], playerSpriteSize, playerSpriteSize))
        .addComponent(stateSystem.inputStateMachine(playerEntityId, 'facing down', [
            { from: 'facing down', on: moveDownKey, to: 'walking down' },
            { from: 'facing down', on: moveLeftKey, to: 'walking left' },
            { from: 'facing down', on: moveRightKey, to: 'walking right' },
            { from: 'facing down', on: moveUpKey, to: 'walking up' },

            { from: 'facing up', on: moveDownKey, to: 'walking down' },
            { from: 'facing up', on: moveLeftKey, to: 'walking left' },
            { from: 'facing up', on: moveRightKey, to: 'walking right' },
            { from: 'facing up', on: moveUpKey, to: 'walking up' },

            { from: 'facing left', on: moveDownKey, to: 'walking down' },
            { from: 'facing left', on: moveLeftKey, to: 'walking left' },
            { from: 'facing left', on: moveRightKey, to: 'walking right' },
            { from: 'facing left', on: moveUpKey, to: 'walking up' },

            { from: 'facing right', on: moveDownKey, to: 'walking down' },
            { from: 'facing right', on: moveLeftKey, to: 'walking left' },
            { from: 'facing right', on: moveRightKey, to: 'walking right' },
            { from: 'facing right', on: moveUpKey, to: 'walking up' },

            { from: 'walking left', on: moveLeftKey, to: 'walking left' },
            { from: 'walking left', on: moveDownKey, to: 'walking down' },
            { from: 'walking left', on: moveRightKey, to: 'walking right' },
            { from: 'walking left', on: moveUpKey, to: 'walking up' },

            { from: 'walking right', on: moveRightKey, to: 'walking right' },
            { from: 'walking right', on: moveLeftKey, to: 'walking left' },
            { from: 'walking right', on: moveDownKey, to: 'walking down' },
            { from: 'walking right', on: moveUpKey, to: 'walking up' },

            { from: 'walking down', on: moveDownKey, to: 'walking down' },
            { from: 'walking down', on: moveLeftKey, to: 'walking left' },
            { from: 'walking down', on: moveRightKey, to: 'walking right' },
            { from: 'walking down', on: moveUpKey, to: 'walking up' },

            { from: 'walking up', on: moveUpKey, to: 'walking up' },
            { from: 'walking up', on: moveLeftKey, to: 'walking left' },
            { from: 'walking up', on: moveDownKey, to: 'walking down' },
            { from: 'walking up', on: moveRightKey, to: 'walking right' },

            { from: 'walking left', to: 'facing left' },
            { from: 'walking right', to: 'facing right' },
            { from: 'walking down', to: 'facing down' },
            { from: 'walking up', to: 'facing up' },
        ]))
        .addComponent(animationSystem.animatorSelectorComponent(playerEntityId, {
            'facing down': animationSystem.animatorComponent(playerEntityId, 1, [
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize,
                    y: 0
                })
            ]),
            'facing left': animationSystem.animatorComponent(playerEntityId, 1, [
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize,
                    y: playerSpriteSize
                })
            ]),
            'facing right': animationSystem.animatorComponent(playerEntityId, 1, [
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize,
                    y: playerSpriteSize * 2
                })
            ]),
            'facing up': animationSystem.animatorComponent(playerEntityId, 1, [
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize,
                    y: playerSpriteSize * 3
                })
            ]),
            'walking down': animationSystem.animatorComponent(playerEntityId, 0.5, [
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: 0,
                    y: 0
                }),
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize,
                    y: 0
                }),
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize * 2,
                    y: 0
                }),
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize,
                    y: 0
                })
            ]),
            'walking left': animationSystem.animatorComponent(playerEntityId, 0.5, [
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: 0,
                    y: playerSpriteSize
                }),
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize,
                    y: playerSpriteSize
                }),
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize * 2,
                    y: playerSpriteSize
                }),
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize,
                    y: playerSpriteSize
                })
            ]),
            'walking right': animationSystem.animatorComponent(playerEntityId, 0.5, [
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: 0,
                    y: playerSpriteSize * 2
                }),
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize,
                    y: playerSpriteSize * 2
                }),
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize * 2,
                    y: playerSpriteSize * 2
                }),
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize,
                    y: playerSpriteSize * 2
                })
            ]),
            'walking up': animationSystem.animatorComponent(playerEntityId, 0.5, [
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: 0,
                    y: playerSpriteSize * 3
                }),
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize,
                    y: playerSpriteSize * 3
                }),
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize * 2,
                    y: playerSpriteSize * 3
                }),
                renderingSystem.sprite(playerEntityId, 1, {
                    image: peopleSprites,
                    width: playerSpriteSize,
                    height: playerSpriteSize,
                    x: playerSpriteSize,
                    y: playerSpriteSize * 3
                })
            ])
        }));
}