export const tileset = (image, tileSize) => ({ image, tileSize });

export const tile = (tileset, i, j) => ({ tileset, i, j });

export const renderTile = ({ tileset, i, j }, x, y) => ctx => {
    const { image, tileSize } = tileset;

    ctx.drawImage(image, j * tileSize, i * tileSize, tileSize, tileSize, x * tileSize, y * tileSize, tileSize, tileSize);
};