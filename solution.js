/* exported generateGrid, drawGrid */
/* global placeTile */

function gridCheck(grid, i, j, target) {
    return (grid[i][j] == target);
}

function gridCode(grid, i, j, target) {
    let northBit = i != 0 && gridCheck(grid, i - 1, j, target);
    let southBit = i != grid.length - 1 && gridCheck(grid, i + 1, j, target);
    let eastBit = j != grid[i].length - 1 && gridCheck(grid, i, j + 1, target);
    let westBit = j != 0 && gridCheck(grid, i, j - 1, target);
    return ((northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3));
}

function drawContext(grid, i, j, target, dti, dtj) {
    let code = gridCode(grid, i, j, target);
    if (lookup[code] != null) {
        let offsetSequence = lookup[code];
        offsetSequence.forEach(offset => {
            let [tiOffset, tjOffset] = offset
            placeTile(i, j, dti + tiOffset, dtj + tjOffset);
        });
    }
}

const lookup = [
    null,
    [[1, 0]],
    [[1, 2]],
    [[1, 0], [1, 2]],
    [[2, 1]],
    [[2, 0]],
    [[2, 2]],
    [[2, 2], [2, 0]],
    [[0, 1]],
    [[0, 0]],
    [[0, 2]],
    [[0, 2], [0, 0]],
    [[0, 1], [2, 1]],
    [[0, 0], [2, 0]],
    [[0, 2], [2, 2]],
    [[0, 0], [0, 2], [1, 0], [2, 2]]
];

function generateGrid(numCols, numRows) {
    let grid = [];
    for (let i = 0; i < numRows; i++) {
        let row = [];
        for (let j = 0; j < numCols; j++) {
            if (noise(i / 9, j / 15) < 0.5) {
                row.push("_");
            }
            else {
                row.push("L");
            }
        }
        grid.push(row);
    }
    return grid;
}

function drawGrid(grid) {
    background(128);
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {

            // Ash land
            if (grid[i][j] == "_") {
                placeTile(i, j, floor(random(4)), 7);
                drawContext(grid, i, j, "L", 4, 3);
            }

            // "Lava"
            else {
                let lava = random(1, 3) | 0;
                if (grid[i][j] == "L") {
                    if (lava == 1) {
                        placeTile(i, j, 1, 3);
                    } else {
                        placeTile(i, j, 0, 3);
                    }
                }
            }
        }
    }

    // Falling ashes
    noStroke();
    fill("#000000");
    for (let i = 0; i < 100; i++) {
        let r = 3 * random();
        let z = random();
        let y = height * (((millis() / 2000.0) / z) % 1);
        let x = width * random();
        ellipse(x, y, r);
    }
}


