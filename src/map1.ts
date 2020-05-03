import { loadImage } from './load-image';
import { tile } from './tile';
import GrassTileset from './assets/AH_Autotile_Grass.png';

export async function load() {
    const grassImage = await loadImage(GrassTileset);

    const grassCornerTL = tile(grassImage, 16, 0, 8);
    const grassCornerTR = tile(grassImage, 16, 0, 11);
    const grassCornerBL = tile(grassImage, 16, 3, 8);
    const grassCornerBR = tile(grassImage, 16, 3, 11);
    const grassEdgeT = tile(grassImage, 16, 0, 10);
    const grassEdgeL = tile(grassImage, 16, 1, 8);
    const grassEdgeR = tile(grassImage, 16, 2, 11);
    const grassEdgeB = tile(grassImage, 16, 3, 9);
    const grass = tile(grassImage, 16, 2, 9);

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