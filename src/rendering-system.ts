import type { Func, SumType } from './fp';
import type { State } from './state';
import type { Position } from './position';
import type { EntitySystem } from './entity-system';
import * as state from './state';
import * as position from './position';

interface SpriteData {
    image: CanvasImageSource;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Sprite extends SpriteData {
    kind: 'sprite';
    layer: number;
    transform: DOMMatrix;
}

interface Tile extends SpriteData {
    position: Position;
}

interface TileGrid {
    kind: 'tileGrid',
    tileSize: number;
    tiles: Tile[];
    layer: number;
    transform: DOMMatrix;
}

type Renderable = Sprite | TileGrid;

export interface RenderComponent {
    componentType: 'render';
    entityId: string;
    renderable: Renderable;
}

export type HasRenderComponents = { renderComponents: RenderComponent[] };

export function sprite(entityId: string, layer: number, spriteData: SpriteData): RenderComponent {
    return {
        componentType: 'render',
        entityId,
        renderable: {
            kind: 'sprite',
            ...spriteData,
            layer,
            transform: new DOMMatrix()
        }
    };
}

export function fromTileset(entityId: string, tileSize: number, layer: number, tileset: SpriteData[], map: string): RenderComponent {
    const tiles: Tile[] = map
        .split('\n')
        .map(row => row.split(',').map(num => num === '' ? undefined : parseInt(num)))
        .flatMap<Tile>((row, i) => {
            const tiles: (Tile | false)[] = row.map((spriteNum, j) => spriteNum !== undefined && { ...tileset[spriteNum], position: [j, i] });

            return tiles.reduce<Tile[]>(
                (res, tile) => tile ? [...res, tile] : res,
                []
            );
        });

    return {
        componentType: 'render',
        entityId,
        renderable: {
            kind: 'tileGrid',
            tileSize,
            tiles,
            layer,
            transform: new DOMMatrix()
        }
    };
}

type RenderableMatchers<T> = { [K in Renderable['kind']]: Func<SumType<Renderable, 'kind', K>, T> };

function match<T>(matchers: RenderableMatchers<T>): Func<Renderable, T>;
function match<T>(matchers: RenderableMatchers<T>, renderable: Renderable): T;
function match<T>(matchers: RenderableMatchers<T>, renderable?: Renderable): T | Func<Renderable, T> {
    const exec: Func<Renderable, T> = renderable => {
        switch (renderable.kind) {
            case 'sprite': return matchers.sprite(renderable);
            case 'tileGrid': return matchers.tileGrid(renderable);
        }
    };

    return renderable ? exec(renderable) : exec;
}

export function render(): State<EntitySystem, OffscreenCanvas> {
    return state.get(es => {
        const sceneCanvas = new OffscreenCanvas(0, 0);
        const sceneCtx = sceneCanvas.getContext('2d');

        if (!sceneCtx) return sceneCanvas;

        es.getComponents('render')
            .map((renderComponent): [Renderable, Position] => {
                const maybePosition = es
                    .getEntityComponent(renderComponent.entityId, 'position')
                    .map(positionComponent => positionComponent.position);

                return [
                    renderComponent.renderable,
                    maybePosition.withDefault([0, 0])
                ];
            })
            .sort(([renderable1, position1], [renderable2, position2]) => {
                if (renderable1.layer === renderable2.layer) return position1[1] - position2[1];

                return renderable1.layer - renderable2.layer;
            })
            .map(([renderable, pos]): [Renderable, Position] => {
                sceneCanvas.width = Math.max(sceneCanvas.width, pos[0] + width(renderable));
                sceneCanvas.height = Math.max(sceneCanvas.height, pos[1] + height(renderable));

                return [renderable, pos];
            })
            .forEach(([renderable, pos]) => {
                const { a, b, c, d, e, f } = renderable.transform;

                sceneCtx.save();
                sceneCtx.transform(a, b, c, d, e, f);

                match({
                    sprite: s => renderSpriteData(sceneCtx, s, pos),
                    tileGrid: tg => tg.tiles.forEach(tile => renderTile(sceneCtx, tg.tileSize, tile))
                }, renderable);

                sceneCtx.restore();
            });

        return sceneCanvas;
    });
}

function renderTile(ctx: OffscreenCanvasRenderingContext2D, tileSize: number, sprite: Tile) {
    renderSpriteData(ctx, {
        ...sprite,
        x: sprite.x * tileSize,
        y: sprite.y * tileSize
    }, position.scale(tileSize, sprite.position));
}

function renderSpriteData(ctx: OffscreenCanvasRenderingContext2D, spriteData: SpriteData, pos: Position): void {
    ctx.drawImage(
        spriteData.image,
        spriteData.x,
        spriteData.y,
        spriteData.width,
        spriteData.height,
        pos[0] | 0,
        pos[1] | 0,
        spriteData.width,
        spriteData.height
    );
}

function width(renderable: Renderable): number {
    return match({
        sprite: sprite => sprite.width,
        tileGrid: tg => tg.tiles.reduce(
            (max, tile) => Math.max(max, tile.position[0] * tg.tileSize + tile.width),
            -Infinity
        )
    }, renderable);
}

function height(renderable: Renderable): number {
    return match({
        sprite: sprite => sprite.height,
        tileGrid: tg => tg.tiles.reduce(
            (max, tile) => Math.max(max, tile.position[1] * tg.tileSize + tile.height),
            -Infinity
        )
    }, renderable);
}