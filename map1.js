import { loadImage } from './load-image.js';
import { tileset, tile } from './tileset.js';

export async function load() {
    const [grassImage] = await Promise.all([
        loadImage('./assets/AH_Autotile_Grass.png')
    ]);

    const grassTileset = tileset(grassImage, 16);
    const grassCornerTL = tile(grassTileset, 0, 8);
    const grassCornerTR = tile(grassTileset, 0, 11);
    const grassCornerBL = tile(grassTileset, 3, 8);
    const grassCornerBR = tile(grassTileset, 3, 11);
    const grassEdgeT = tile(grassTileset, 0, 10);
    const grassEdgeL = tile(grassTileset, 1, 8);
    const grassEdgeR = tile(grassTileset, 2, 11);
    const grassEdgeB = tile(grassTileset, 3, 9);
    const grass = tile(grassTileset, 2, 9);

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