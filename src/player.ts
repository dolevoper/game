import type { InputState } from './core';
import type { Renderer } from './rendering';
import type { Position } from './position';
import type { Sprite } from './sprite';
import type { Collider } from './collider';
import compose from './compose';
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
        position: position.fromScalar(0),
        sprite: stateSprites[defaultState],
        stateSprites
    };
}

export function collider(player: Player): Collider {
    return {
        position: player.position,
        width: player.sprite.size,
        height: player.sprite.size
    };
}

export function render(player: Player): Renderer {
    return sprite.render(new DOMMatrix().translate(...player.position), player.sprite);
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

type InputHandler = (next: (input: InputState) => PlayerState) => (input: InputState) => PlayerState;

function updateState(input: InputState, state: PlayerState): PlayerState {
    const handleMoveLeftKey: InputHandler = next => input => input[moveLeftKey] ? 'walking left' : next(input);
    const handleMoveRightKey: InputHandler = next => input => input[moveRightKey] ? 'walking right' : next(input);
    const handleMoveDownKey: InputHandler = next => input => input[moveDownKey] ? 'walking down' : next(input);
    const handleMoveUpKey: InputHandler = next => input => input[moveUpKey] ? 'walking up' : next(input);
    const always: (state: PlayerState) => (input: InputState) => PlayerState = state => _ => state;

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