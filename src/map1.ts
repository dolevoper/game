import { loadImage } from './core';
import * as sprite from './sprite'

import GrassTileset from './assets/AH_Autotile_Grass.png';

export async function load() {
    const grassImage = await loadImage(GrassTileset);

    const grassCornerTL = sprite.fromImage(grassImage, 16, 0, 8);
    const grassCornerTR = sprite.fromImage(grassImage, 16, 0, 11);
    const grassCornerBL = sprite.fromImage(grassImage, 16, 3, 8);
    const grassCornerBR = sprite.fromImage(grassImage, 16, 3, 11);
    const grassEdgeT = sprite.fromImage(grassImage, 16, 0, 10);
    const grassEdgeL = sprite.fromImage(grassImage, 16, 1, 8);
    const grassEdgeR = sprite.fromImage(grassImage, 16, 2, 11);
    const grassEdgeB = sprite.fromImage(grassImage, 16, 3, 9);
    const grass = sprite.fromImage(grassImage, 16, 2, 9);

    return [
        [grassCornerTL, grassEdgeT, grassEdgeT, grassEdgeT, grassEdgeT, grassEdgeT, grassEdgeT, grassCornerTR],
        [grassEdgeL, grass, grass, grass, grass, grass, grass, grassEdgeR],
        [grassEdgeL, grass, grass, grass, grass, grass, grass, grassEdgeR],
        [grassEdgeL, grass, grass, grass, grass, grass, grass, grassEdgeR],
        [grassEdgeL, grass, grass, grass, grass, grass, grass, grassEdgeR],
        [grassEdgeL, grass, grass, grass, grass, grass, grass, grassEdgeR],
        [grassEdgeL, grass, grass, grass, grass, grass, grass, grassEdgeR],
        [grassCornerBL, grassEdgeB, grassEdgeB, grassEdgeB, grassEdgeB, grassEdgeB, grassEdgeB, grassCornerBR]
    ];
}