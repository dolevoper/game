export type Renderer = (ctx: CanvasRenderingContext2D) => void;

export function combineRenderers(renderers: Renderer[]): Renderer {
    return ctx => renderers.forEach(renderer => renderer(ctx));
}

export function render(ctx: CanvasRenderingContext2D, renderers: Renderer[]) {
    renderers.forEach(renderer => renderer(ctx));
}