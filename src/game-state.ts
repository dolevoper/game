import type { InputState } from './core';
import type { Renderer } from './rendering';
import type { Player, PlayerStateSprites } from './player';
import type { TileGrid } from './tile-grid';
import type { Collider } from './collider';
import type { GameObject } from './game-object';
import * as position from './position';
import * as rendering from './rendering';
import * as player from './player';
import * as tileGrid from './tile-grid';
import * as gameObject from './game-object';

export interface GameState {
    player: Player;
    layer1: TileGrid;
    layer2: TileGrid;
    staticColliders: Collider[],
    gameObjects: GameObject[]
}

export function init(playerStateSprites: PlayerStateSprites, layer1: TileGrid, layer2: TileGrid, staticColliders: Collider[]): GameState {
    return {
        player: player.fromSprites(playerStateSprites),
        layer1,
        layer2,
        staticColliders,
        gameObjects: []
    };
}

type GameStateBuilder = (state: GameState) => GameState;

export function addGameObject(newGameObject: GameObject): GameStateBuilder;
export function addGameObject(newGameObject: GameObject, gameState: GameState): GameState;
export function addGameObject(newGameObject: GameObject, gameState?: GameState): GameState | GameStateBuilder {
    const build: GameStateBuilder = gameState => ({
        ...gameState,
        gameObjects: [...gameState.gameObjects, newGameObject]
    });

    return gameState ? build(gameState): build;
}

export function build(builders: GameStateBuilder[], gameState: GameState): GameState {
    return builders.reduce(
        (res, builder) => builder(res),
        gameState
    );
}

export function update(step: number, input: InputState, gameState: GameState): GameState {
    const res = {
        ...gameState,
        player: player.update(step, input, gameState.staticColliders, gameState.player)
    };

    res.player.position = position.clamp(
        [0, 0],
        res.player.position,
        [tileGrid.renderWidth(res.layer1) - res.player.sprite.size, tileGrid.renderHeigth(res.layer1) - res.player.sprite.size]
    );

    return res;
}

export function render(scale: number, gameState: GameState): Renderer {
    return ctx => {
        const scene = document.createElement('canvas');

        scene.width = tileGrid.renderWidth(gameState.layer1);
        scene.height = tileGrid.renderHeigth(gameState.layer1);

        const sceneCtx = scene.getContext('2d');

        if (!sceneCtx) return;

        rendering.ap(sceneCtx, renderScene(gameState));

        const viewPortWidth = ctx.canvas.width;
        const viewPortHeight = ctx.canvas.height;

        const sourceWidth = Math.min(viewPortWidth / scale, scene.width);
        const sourceHeight = Math.min(viewPortHeight / scale, scene.height);

        const [sourceX, sourceY] = position.clamp(
            position.fromScalar(0),
            position.build([
                position.add(position.fromScalar(gameState.player.sprite.size / -2)),
                position.add([sourceWidth / -2, sourceHeight / -2])
            ], gameState.player.position),
            [scene.width - sourceWidth, scene.height - sourceHeight]
        );

        const destinationWidth = sourceWidth * scale;
        const destinationHeight = sourceHeight * scale;

        const destinationX = (viewPortWidth - destinationWidth) / 2;
        const destinationY = (viewPortHeight - destinationHeight) / 2;

        ctx.drawImage(
            scene,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            destinationX,
            destinationY,
            destinationWidth,
            destinationHeight
        );
    };
}

function renderScene(gameState: GameState): Renderer {
    return rendering.combineRenderers([
        tileGrid.render(new DOMMatrix(), gameState.layer1),
        ...gameObjects(gameState).sort((obj1, obj2) => obj1.position[1] - obj2.position[1]).map(gameObject.render),
        tileGrid.render(new DOMMatrix(), gameState.layer2)
    ]);
}

function gameObjects(gameState: GameState): GameObject[] {
    return [...gameState.gameObjects, gameState.player];
}