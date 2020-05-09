import type { Position } from './position';
import type { GameObject } from './game-object';
import type { Collider } from './collider';
import type { MultiState, StateSprites } from './multi-state';
import * as position from './position';
import * as multiState from './multi-state';
import * as collider from './collider';

type ChestStates = 'close' | 'open';

export type ChestStateSprites = StateSprites<ChestStates>;

export interface Chest extends GameObject, MultiState<ChestStates> {}

export function from(stateSprites: StateSprites<ChestStates>, position: Position): Chest {
    return {
        ...multiState.from('close', stateSprites),
        position
    };
}

export function getCollider(chest: Chest): Collider {
    const spriteSize = chest.sprite.size;

    return collider.fromRect(position.add([0, spriteSize * 0.3], chest.position), chest.sprite.size, chest.sprite.size * 0.3);
}