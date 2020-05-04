import type { InputState, Renderer } from './core';
import type { Position } from './position';
import type { Sprite } from './sprite';
import type { AnimatedSprite } from './animated-sprite';
import * as position from './position';
import * as sprite from './sprite';
import * as animatedSprite from './animated-sprite';

export type PlayerState
    = 'facing down'
    | 'facing up'
    | 'facing left'
    | 'facing right'
    | 'walking down'
    | 'walking up'
    | 'walking left'
    | 'walking right';

export type PlayerStateSprites = { [k in PlayerState]: Sprite | AnimatedSprite };

export interface Player {
    state: PlayerState;
    position: Position;
    sprite: Sprite | AnimatedSprite;
    stateSprites: PlayerStateSprites;
}

const defaultState: PlayerState = 'facing down';

export function fromSprites(stateSprites: PlayerStateSprites): Player {
    return {
        state: defaultState,
        position: [4 * 16, 4 * 16],
        sprite: stateSprites[defaultState],
        stateSprites
    };
}

export function render(player: Player): Renderer {
    if (animatedSprite.isAnimatedSprite(player.sprite)) return animatedSprite.render(player.sprite, player.position[0], player.position[1]);

    return sprite.render(player.sprite, player.position[0], player.position[1]);
}

export function update(step: number, input: InputState, player: Player): Player {
    const nextState = updateState(input, player.state);

    return {
        ...player,
        state: nextState,
        position: updatePosition(input, player.position),
        sprite: updateSprite(step, player.state, nextState, player.stateSprites, player.sprite)
    };
}

function updateState(input: InputState, state: PlayerState): PlayerState {
    if (input[40]) return 'walking down';
    if (input[38]) return 'walking up';
    if (input[37]) return 'walking left';
    if (input[39]) return 'walking right';

    if (state === 'walking down') return 'facing down';
    if (state === 'walking up') return 'facing up';
    if (state === 'walking left') return 'facing left';
    if (state === 'walking right') return 'facing right';

    return state;
}

function updatePosition(input: InputState, pos: Position): Position {
    let res = pos;

    if (input[40]) res = position.moveDown(res);
    if (input[38]) res = position.moveUp(res);
    if (input[39]) res = position.moveRight(res);
    if (input[37]) res = position.moveLeft(res);

    return res;
}

function updateSprite(step: number, currState: PlayerState, nextState: PlayerState, stateSprites: PlayerStateSprites, sprite: Sprite | AnimatedSprite): Sprite | AnimatedSprite {
    if (currState !== nextState) return stateSprites[nextState];

    if (!animatedSprite.isAnimatedSprite(sprite)) return sprite;

    return animatedSprite.mapStep(step, sprite);
}