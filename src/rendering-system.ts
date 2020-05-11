import type { Func, SumType } from './fp';
import type { State } from './state';
import type { Position } from './position';
import type { EntitySystem } from './entity-system';
import * as maybe from './maybe';
import * as state from './state';
import * as position from './position';
import * as entitySystem from './entity-system';

interface SpriteData {
    image: CanvasImageSource;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface PositionedSpriteData extends SpriteData {
    position: Position;
}

interface Sprite extends SpriteData {
    kind: 'sprite';
    layer: number;
    transform: DOMMatrix;
}

interface TileGrid {
    kind: 'tileGrid',
    tileSize: number;
    tiles: PositionedSpriteData[];
    layer: number;
    transform: DOMMatrix;
}

type Renderable = Sprite | TileGrid;

export interface RenderComponent {
    componentType: 'render';
    entityId: number;
    renderable: Renderable;
}

export type HasRenderComponents = { renderComponents: RenderComponent[] };

export function sprite(entityId: number, layer: number, spriteData: SpriteData): RenderComponent {
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

export function fromTileset(entityId: number, tileSize: number, layer: number, tileset: SpriteData[], map: string): RenderComponent {
    const tiles: PositionedSpriteData[] = map
        .split('\n')
        .map(row => row.split(',').map(num => parseInt(num)))
        .flatMap((row, i) => row.map((spriteNum, j) => ({ ...tileset[spriteNum], position: [j, i] })));

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

export function render(ctx: CanvasRenderingContext2D): Func<void, State<EntitySystem, void>> {
    return () => state.get(es => entitySystem.components('render', es)
        .map((renderComponent): [Renderable, Position] => {
            const maybePositionComponent = entitySystem.component(renderComponent.entityId, 'position', es);
            const maybePosition = maybe.map(positionComponent => positionComponent.position, maybePositionComponent);

            return [
                renderComponent.renderable,
                maybe.withDefault([0, 0], maybePosition)
            ];
        })
        .sort(([renderable1, position1], [renderable2, position2]) => {
            if (renderable1.layer === renderable2.layer) return position1[1] - position2[1];

            return renderable1.layer - renderable2.layer;
        })
        .forEach(([renderable, pos]) => {
            const globalTransform = ctx.getTransform();
            const { a, b, c, d, e, f } = renderable.transform;

            ctx.transform(a, b, c, d, e, f);

            match({
                sprite: s => renderSpriteData(ctx, s, pos),
                tileGrid: tg => tg.tiles.forEach(tile => renderTile(ctx, tg.tileSize, tile))
            }, renderable);

            ctx.setTransform(globalTransform);
        })
    );
}

function renderTile(ctx: CanvasRenderingContext2D, tileSize: number, sprite: PositionedSpriteData) {
    renderSpriteData(ctx, {
        ...sprite,
        x: sprite.x * tileSize,
        y: sprite.y * tileSize
    }, position.scale(tileSize, sprite.position));
}

function renderSpriteData(ctx: CanvasRenderingContext2D, spriteData: SpriteData, position: Position): void {
    ctx.drawImage(
        spriteData.image,
        spriteData.x,
        spriteData.y,
        spriteData.width,
        spriteData.height,
        position[0],
        position[1],
        spriteData.width,
        spriteData.height
    );
}