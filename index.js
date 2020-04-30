const gameCanvas = document.getElementById('app');
const ctx = gameCanvas.getContext('2d');

const tileset = new Image();
const tileSize = 16;

const tile = (i, j) => ({ i, j });

const floorCornerTL = tile(6, 0);
const floorCornerTR = tile(6, 2);
const floorCornerBL = tile(8, 0);
const floorCornerBR = tile(8, 2);
const floorEdgeT = tile(6, 1);
const floorEdgeL = tile(7, 0);
const floorEdgeR = tile(7, 2);
const floorEdgeB = tile(8, 1);
const wallStartU = tile(0, 0);
const wallStartB = tile(1, 0);
const wallU = tile(0, 1);
const wallB = tile(1, 1);
const wallEndU = tile(0, 2);
const wallEndB = tile(1, 2);
const floor = tile(3, 2);

const map = [
    [wallStartU, wallU, wallU, wallU, wallU, wallU, wallU, wallU, wallU, wallEndU],
    [wallStartB, wallB, wallB, wallB, wallB, wallB, wallB, wallB, wallB, wallEndB],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor, floor],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor, floor],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor, floor],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor, floor],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor, floor],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor, floor],
    [floor, floor, floor, floor, floor, floor, floor, floor, floor, floor],
    // [floor, floor, floor, floor, floor, floor, floor, floor, floor, floor]
];

tileset.src = './assets/tileset.png';
tileset.addEventListener('load', function () {
    // drawTile({ i: 0, j: 0 }, 0, 0);
    // drawTile({ i: 1, j: 0 }, 1, 1);
    // drawTile({ i: 2, j: 0 }, 2, 2);
    // drawTile({ i: 3, j: 0 }, 3, 3);
    // drawTile({ i: 4, j: 0 }, 4, 4);
    // drawTile({ i: 5, j: 0 }, 5, 5);
    // drawTile({ i: 6, j: 0 }, 6, 6);
    // drawTile({ i: 7, j: 0 }, 7, 7);
    // drawTile({ i: 8, j: 0 }, 8, 8);
    // drawTile({ i: 9, j: 0 }, 9, 9);
    // drawTile({ i: 10, j: 0 }, 10, 10);
    ctx.fillStyle = '#1c1117';
    ctx.fillRect(0, 0, 900, 506.25);

    for (let i = 0; i < map.length; i++) {
        const row = map[i];

        for (let j = 0; j < row.length; j++) {
            drawTile(map[i][j], i, j + 2);
        }
    }
}, false);

function drawTile({ i, j }, x, y) {
    ctx.drawImage(tileset, j * tileSize, i * tileSize, tileSize, tileSize, y * tileSize, x * tileSize, tileSize, tileSize);
}