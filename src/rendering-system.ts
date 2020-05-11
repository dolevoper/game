import type { Func } from './fp';
import type { State } from './state';
import type { Position } from './position';
import * as state from './state';
import * as position from './position';
import { EntitySystem } from './entity-system';

interface SpriteData {
    image: CanvasImageSource;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Sprite extends SpriteData {
    position: Position;
}

interface SpriteComponent extends Sprite {
    kind: 'sprite';
    layer: number;
    transform: DOMMatrix;
}

interface TileGridComponent {
    kind: 'tile grid',
    tileSize: number;
    tiles: Sprite[];
    layer: number;
    transform: DOMMatrix;
}

type Renderable = SpriteComponent | TileGridComponent;

export interface RenderComponent {
    componentType: 'render';
    entityId: number;
    renderable: Renderable;
}

export type HasRenderComponents = { renderComponents: RenderComponent[] };

export function sprite(entityId: number, position: Position, layer: number, spriteData: SpriteData): RenderComponent {
    return {
        componentType: 'render',
        entityId,
        renderable: {
            kind: 'sprite',
            ...spriteData,
            position,
            layer,
            transform: new DOMMatrix()
        }
    };
}

export function fromTileset(entityId: number, tileSize: number, layer: number, tileset: SpriteData[], map: string): RenderComponent {
    const tiles: Sprite[] = map
        .split('\n')
        .map(row => row.split(',').map(num => parseInt(num)))
        .flatMap((row, i) => row.map((spriteNum, j) => ({ ...tileset[spriteNum], position: [j, i] })));

    return {
        componentType: 'render',
        entityId,
        renderable: {
            kind: 'tile grid',
            tileSize,
            tiles,
            layer,
            transform: new DOMMatrix()
        }
    };
}

type RenderComponentMatchers<T> = { sprite: Func<SpriteComponent, T>, tileGrid: Func<TileGridComponent, T> };

function match<T>(matchers: RenderComponentMatchers<T>): Func<RenderComponent, T>;
function match<T>(matchers: RenderComponentMatchers<T>, component: RenderComponent): T;
function match<T>(matchers: RenderComponentMatchers<T>, component?: RenderComponent): T | Func<RenderComponent, T> {
    const exec: Func<RenderComponent, T> = ({ renderable }) => {
        switch (renderable.kind) {
            case 'sprite': return matchers.sprite(renderable);
            case 'tile grid': return matchers.tileGrid(renderable);
        }
    };

    return component ? exec(component) : exec;
}

export function render(ctx: CanvasRenderingContext2D): State<EntitySystem, void> {
    return state.map(entitySystem => {
        const renderer = match({ sprite: renderSpriteComponent(ctx), tileGrid: renderTileGridComponent(ctx) });

        entitySystem.components.render
            .sort(({ renderable: renderable1 }, { renderable: renderable2 }) => {
                if (renderable1.layer === renderable2.layer) {
                    if (renderable1.kind === 'sprite' && renderable2.kind === 'sprite') return renderable1.position[1] - renderable2.position[1];

                    return 0;
                }

                return renderable1.layer - renderable2.layer;
            })
            .forEach(component => {
                const globalTransform = ctx.getTransform();
                const { a, b, c, d, e, f } = component.renderable.transform;

                ctx.transform(a, b, c, d, e, f);
                renderer(component);
                ctx.setTransform(globalTransform);
            });
    }, state.get());
}

type Renderer<T extends Renderable> = (component: T) => void;

function renderSpriteComponent(ctx: CanvasRenderingContext2D): Renderer<SpriteComponent>;
function renderSpriteComponent(ctx: CanvasRenderingContext2D, sprite: SpriteComponent): void;
function renderSpriteComponent(ctx: CanvasRenderingContext2D, sprite?: SpriteComponent): Renderer<SpriteComponent> | void {
    const renderer: Renderer<SpriteComponent> = sprite => renderSprite(ctx, sprite);

    return sprite ? renderer(sprite) : renderer;
}

function renderTileGridComponent(ctx: CanvasRenderingContext2D): Renderer<TileGridComponent>;
function renderTileGridComponent(ctx: CanvasRenderingContext2D, tileGrid: TileGridComponent): void;
function renderTileGridComponent(ctx: CanvasRenderingContext2D, tileGrid?: TileGridComponent): Renderer<TileGridComponent> | void {
    const renderer: Renderer<TileGridComponent> = tileGrid => tileGrid.tiles.forEach(tile => renderTile(ctx, tileGrid.tileSize, tile));;

    return tileGrid ? renderer(tileGrid) : renderer;
}

function renderTile(ctx: CanvasRenderingContext2D, tileSize: number, sprite: Sprite) {
    renderSprite(ctx, {
        ...sprite,
        x: sprite.x * tileSize,
        y: sprite.y * tileSize,
        position: position.scale(tileSize, sprite.position)
    });
}

function renderSprite(ctx: CanvasRenderingContext2D, sprite: Sprite): void {
    ctx.drawImage(
        sprite.image,
        sprite.x,
        sprite.y,
        sprite.width,
        sprite.height,
        sprite.position[0],
        sprite.position[1],
        sprite.width,
        sprite.height
    );
}