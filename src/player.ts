import type { InputState } from './core';
import type { Position } from './position';
import type { Sprite } from './sprite';
import type { GameObject } from './game-object';
import type { Collider } from './collider';
import { compose, always } from './fp';
import * as position from './position';
import * as sprite from './sprite';
import * as collider from './collider';
import * as gameObject from './game-object';

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

export interface Player extends GameObject {
    state: PlayerState;
    stateSprites: PlayerStateSprites;
}

const defaultState: PlayerState = 'facing down';

const moveLeftKey = 37;
const moveUpKey = 38;
const moveRightKey = 39;
const moveDownKey = 40;

export function fromSprites(stateSprites: PlayerStateSprites): Player {
    return {
        ...gameObject.from(stateSprites[defaultState], position.fromScalar(0)),
        state: defaultState,
        stateSprites
    };
}

export function getCollider(player: Player): Collider {
    return collider.fromRect(player.position, player.sprite.size, player.sprite.size);
}

export function update(step: number, input: InputState, colliders: Collider[], player: Player): Player {
    const nextState = updateState(input, player.state);

    return {
        ...player,
        state: nextState,
        position: updatePosition(step, input, colliders, player),
        sprite: updateSprite(step, nextState, player)
    };
}

type InputHandler = (next: (input: InputState) => PlayerState) => (input: InputState) => PlayerState;

function updateState(input: InputState, state: PlayerState): PlayerState {
    const handleMoveLeftKey: InputHandler = next => input => input[moveLeftKey] ? 'walking left' : next(input);
    const handleMoveRightKey: InputHandler = next => input => input[moveRightKey] ? 'walking right' : next(input);
    const handleMoveDownKey: InputHandler = next => input => input[moveDownKey] ? 'walking down' : next(input);
    const handleMoveUpKey: InputHandler = next => input => input[moveUpKey] ? 'walking up' : next(input);

    const stateUpdates: { [k in PlayerState]?: (i: InputState) => PlayerState } = {
        'walking left': compose(handleMoveLeftKey, handleMoveRightKey, handleMoveDownKey, handleMoveUpKey)(always('facing left')),
        'walking right': compose(handleMoveRightKey, handleMoveLeftKey, handleMoveDownKey, handleMoveUpKey)(always('facing right')),
        'walking up': compose(handleMoveUpKey, handleMoveDownKey, handleMoveLeftKey, handleMoveRightKey)(always('facing up')),
        'walking down': compose(handleMoveDownKey, handleMoveUpKey, handleMoveLeftKey, handleMoveRightKey)(always('facing down'))
    };

    const defaultHandler = compose(handleMoveDownKey, handleMoveUpKey, handleMoveLeftKey, handleMoveRightKey)(always(state));

    const update = stateUpdates[state] || defaultHandler;

    return update(input);
}

function updatePosition(step: number, input: InputState, colliders: Collider[], player: Player): Position {
    const movementSpeed = 1.5; // tiles per second
    const playerSize = player.sprite.size;
    const amount = step / playerSize * movementSpeed;

    let res = player.position;

    const newPositionOrDefault = (defaultPosition: Position, newPosition: Position) => {
        const newCollider = collider.fromRect(newPosition, playerSize, playerSize);

        return colliders.some(collider.isColliding(newCollider)) ? defaultPosition : newPosition;
    };

    if (input[moveDownKey] && player.state !== 'walking up') {
        res = newPositionOrDefault(res, position.moveDown(res, amount));
    }

    if (input[moveUpKey] && player.state !== 'walking down') {
        res = newPositionOrDefault(res, position.moveUp(res, amount));
    }

    if (input[moveRightKey] && player.state !== 'walking left') {
        res = newPositionOrDefault(res, position.moveRight(res, amount));
    }

    if (input[moveLeftKey] && player.state !== 'walking right') {
        res = newPositionOrDefault(res, position.moveLeft(res, amount));
    }

    return res;
}

function updateSprite(step: number, nextState: PlayerState, player: Player): Sprite {
    if (player.state !== nextState) return player.stateSprites[nextState];

    return sprite.mapStep(step, player.sprite);
}