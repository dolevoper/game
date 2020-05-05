export type Renderer = (ctx: CanvasRenderingContext2D) => void;

export function combineRenderers(renderers: Renderer[]): Renderer {
    return ctx => renderers.forEach(renderer => renderer(ctx));
}

export function ap(ctx: CanvasRenderingContext2D, renderer: Renderer) {
    renderer(ctx);
}