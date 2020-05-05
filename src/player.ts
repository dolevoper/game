import type { InputState } from './core';
import type { Renderer } from './rendering';
import type { Position } from './position';
import type { Sprite } from './sprite';
import * as position from './position';
import * as sprite from './sprite';

export type PlayerState
    = 'facing down'
    | 'facing up'
    | 'facing left'
    | 'facing right'
    | 'walking down'
    | 'walking up'
    | 'walking left'
    | 'walking right';

export type PlayerStateSprites = { [k in PlayerState]: Sprite };

export interface Player {
    state: PlayerState;
    position: Position;
    sprite: Sprite;
    stateSprites: PlayerStateSprites;
}

const defaultState: PlayerState = 'facing down';

const moveLeftKey = 37;
const moveUpKey = 38;
const moveRightKey = 39;
const moveDownKey = 40;

export function fromSprites(stateSprites: PlayerStateSprites): Player {
    return {
        state: defaultState,
        position: [4 * 16, 4 * 16],
        sprite: stateSprites[defaultState],
        stateSprites
    };
}

export function render(player: Player): Renderer {
    return sprite.render(player.position[0], player.position[1], player.sprite);
}

export function update(step: number, input: InputState, player: Player): Player {
    const nextState = updateState(input, player.state);

    return {
        ...player,
        state: nextState,
        position: updatePosition(step, input, player),
        sprite: updateSprite(step, nextState, player)
    };
}

function updateState(input: InputState, state: PlayerState): PlayerState {
    if (input[moveDownKey]) return 'walking down';
    if (input[moveUpKey]) return 'walking up';
    if (input[moveLeftKey]) return 'walking left';
    if (input[moveRightKey]) return 'walking right';

    if (state === 'walking down') return 'facing down';
    if (state === 'walking up') return 'facing up';
    if (state === 'walking left') return 'facing left';
    if (state === 'walking right') return 'facing right';

    return state;
}

function updatePosition(step: number, input: InputState, player: Player): Position {
    const movementSpeed = 1.5; // tiles per second
    const amount = step / player.sprite.size * movementSpeed;

    let res = player.position;

    if (input[moveDownKey]) res = position.moveDown(res, amount);
    if (input[moveUpKey]) res = position.moveUp(res, amount);
    if (input[moveRightKey]) res = position.moveRight(res, amount);
    if (input[moveLeftKey]) res = position.moveLeft(res, amount);

    return res;
}

function updateSprite(step: number, nextState: PlayerState, player: Player): Sprite {
    if (player.state !== nextState) return player.stateSprites[nextState];

    return sprite.mapStep(step, player.sprite);
}