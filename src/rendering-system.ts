import type { Func } from './fp';
import type { State } from './state';
import type { Position } from './position';
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
    position: Position;
}

interface SpriteComponent extends Sprite {
    kind: 'sprite';
    entityId: number;
    layer: number;
    transform: DOMMatrix;
}

interface TileGridComponent {
    kind: 'tile grid',
    entityId: number;
    tileSize: number;
    tiles: Sprite[];
    layer: number;
    transform: DOMMatrix;
}

export type RenderComponent = SpriteComponent | TileGridComponent;

export type HasRenderComponents = { renderComponents: RenderComponent[] };

export function sprite(entityId: number, position: Position, layer: number, spriteData: SpriteData): RenderComponent {
    return {
        kind: 'sprite',
        ...spriteData,
        entityId,
        position,
        layer,
        transform: new DOMMatrix()
    };
}

export function fromTileset(entityId: number, tileSize: number, layer: number, tileset: SpriteData[], map: string): RenderComponent {
    const tiles: Sprite[] = map
        .split('\n')
        .map(row => row.split(',').map(num => parseInt(num)))
        .flatMap((row, i) => row.map((spriteNum, j) => ({ ...tileset[spriteNum], position: [j, i] })));

    return {
        kind: 'tile grid',
        entityId,
        tileSize,
        tiles,
        layer,
        transform: new DOMMatrix()
    };
}

type RenderComponentMatchers<T> = { sprite: Func<SpriteComponent, T>, tileGrid: Func<TileGridComponent, T> };

function match<T>(matchers: RenderComponentMatchers<T>): Func<RenderComponent, T>;
function match<T>(matchers: RenderComponentMatchers<T>, component: RenderComponent): T;
function match<T>(matchers: RenderComponentMatchers<T>, component?: RenderComponent): T | Func<RenderComponent, T> {
    const exec: Func<RenderComponent, T> = component => {
        switch (component.kind) {
            case 'sprite': return matchers.sprite(component);
            case 'tile grid': return matchers.tileGrid(component);
        }
    };

    return component ? exec(component) : exec;
}

export function render(ctx: CanvasRenderingContext2D): State<HasRenderComponents, void> {
    return state.flatMap(s => {
        const renderer = match({ sprite: renderSpriteComponent(ctx), tileGrid: renderTileGridComponent(ctx) });

        s.renderComponents
            .sort((component1, component2) => {
                if (component1.layer === component2.layer) {
                    if (component1.kind === 'sprite' && component2.kind === 'sprite') return component1.position[1] - component2.position[1];

                    return 0;
                }

                return component1.layer - component2.layer;
            })
            .forEach(component => {
                const globalTransform = ctx.getTransform();
                const { a, b, c, d, e, f } = component.transform;

                ctx.transform(a, b, c, d, e, f);
                renderer(component);
                ctx.setTransform(globalTransform);
            });

        return state.put(s);
    }, state.get());
}

type Renderer<T extends RenderComponent> = (component: T) => void;

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