document.addEventListener("DOMContentLoaded", function() {
    addControllListeners();
    addInputListeners();
});

let sudoku = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    
let fixedNumbers = [
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false]
    ]

let lockOnGeneration = false;

function addControllListeners() {
    document.getElementById("clearButton").addEventListener("click", function() {
        deleteAllNumbers();
    });
    document.getElementById("verifyButton").addEventListener("click", function() {
        isValidSudoku() ? alert("Valid Sudoku") : alert("Invalid Sudoku");
    });
    document.getElementById("solveButton").addEventListener("click", function() {
        for (let row = 0; row <= 8; row++) {
            for (let column = 0; column <= 8; column++) {
                fixedNumbers[row][column] = (sudoku[row][column] !== 0);
            }
        }
        if (backtrackSudoku(0, 0)) {
            exportNumbers();
        } else {
            importNumbers();
            alert("This sudoku can not be solved!");
        }
    });
    document.getElementById("generateButton").addEventListener("click", function() {
        generateSudoku();
    });
    document.getElementById("toggleLock").addEventListener("click", function() {
        document.getElementById("toggleLock").innerHTML = lockOnGeneration ? "Unlocked on generation" : "Locked on generation";
        lockOnGeneration = !lockOnGeneration;
    })
}

function addInputListeners() {
    for (let row = 1; row <= 9; row++) {
        for (let column = 1; column <= 9; column++) {
            let cell = document.getElementById("cell"+row+column);
            cell.addEventListener("change", function() {
                if ([1,2,3,4,5,6,7,8,9].includes(parseInt(cell.value))) {
                    importNumbers();
                } else {
                    sudoku[row-1][column-1] = 0;
                    cell.value = "";
                }
            })
        }
    }
}

function deleteAllNumbers() {
    for (let row = 1; row <= 9; row++) {
        for (let column = 1; column <= 9; column++) {
            document.getElementById("cell"+row+column).disabled = false;
            document.getElementById("cell"+row+column).style.fontWeight = "normal";
        }
    }
    for (let row = 1; row <= 9; row++) {
        for (let column = 1; column <= 9; column++) {
            document.getElementById("cell"+row+column).value = "";
            sudoku[row-1][column-1] = 0;
        }
    }
}

function importNumbers() {
    for (let row = 1; row <= 9; row++) {
        for (let column = 1; column <= 9; column++) {
            value = parseInt(document.getElementById("cell"+row+column).value);
            [1,2,3,4,5,6,7,8,9].includes(value) ? sudoku[row-1][column-1] = value : sudoku[row-1][column-1] = 0;
        }
    }
}

function exportNumbers() {
    for (let row = 1; row <= 9; row++) {
        for (let column = 1; column <= 9; column++) {
            cell = document.getElementById("cell"+row+column);
            sudoku[row-1][column-1] === 0 ? cell.value = "" : cell.value = sudoku[row-1][column-1];
        }
    }
}

function isValidSudoku() {
    for (let row = 0; row <= 8; row++) {
        if(!isValidRow(row)) {
            return false;
        }
    }
    for (let column = 0; column <= 8; column++) {
        if(!isValidColumn(column)) {
            return false;
        }
    }
    for (let row = 0; row <= 8; row += 3) {
        for (let column = 0; column <= 8; column += 3) {
            if(!isValidGridFrom(row, column)) {
                return false;
            }
        }
    }
    return true;
}

function isValidRow(row) {
    for (let firstColumn = 0; firstColumn <= 8; firstColumn++) {
        for (let secondColumn = firstColumn + 1; secondColumn <= 8; secondColumn++) {
            if ((sudoku[row][firstColumn] === sudoku[row][secondColumn]) && (sudoku[row][firstColumn] !== 0)) {
                return false;
            }
        }
    }
    return true;
}

function isValidColumn(column) {
    for (let firstRow = 0; firstRow <= 8; firstRow++) {
        for (let secondRow = firstRow + 1; secondRow <= 8; secondRow++) {
            if ((sudoku[firstRow][column] === sudoku[secondRow][column]) && (sudoku[firstRow][column] !== 0)) {
                return false;
            }
        }
    }
    return true;
}

function isValidGridFrom(rowOffset, columnOffset) {
    for (let firstRow = 0; firstRow <= 2; firstRow++) {
        for (let firstColumn = 0; firstColumn <= 2; firstColumn++) {
            for (let secondRow = 0; secondRow <= 2; secondRow++) {
                for (let secondColumn = 0; secondColumn <= 2; secondColumn++) {
                    if (((firstRow !== secondRow) || (firstColumn !== secondColumn)) &&
                    ((sudoku[rowOffset+firstRow][columnOffset+firstColumn] === sudoku[rowOffset+secondRow][columnOffset+secondColumn])
                    && (sudoku[rowOffset+firstRow][columnOffset+firstColumn] !== 0))) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

function backtrackSudoku(row, column) {
    if (!isValidSudoku()) {
        return false;
    }
    if ((row > 8) || (column > 8)) {
        return true;
    }
    let nextRow = row;
    let nextColumn = column+1;
    if (nextColumn > 8) {
        nextColumn = 0;
        nextRow += 1;
    }
    if (fixedNumbers[row][column]) {
        return backtrackSudoku(nextRow, nextColumn);
    } else {
        for (let number = 1; number <= 9; number++) {
            sudoku[row][column] = number;
            if (isValidSudoku()) {
                if (backtrackSudoku(nextRow, nextColumn)) {
                    return true;
                }
            } else {
                sudoku[row][column] = 0;
            }
        }
    }
}

function isSolved() {
    for (let row = 0; row <= 8; row++) {
        for (let column = 0; column <= 8; column++) {
            if (sudoku[row][column] === 0) {
                return false;
            }
        }
    }
    return isValidSudoku();
}

function generateSudoku() {
    let chance = 100 - parseInt(document.getElementById("hardness").value);
    do {
        deleteAllNumbers();
        for (let counter = 0; counter < 10; counter++) {
            let randomRow = Math.floor(Math.random() * 9);
            let randomColumn = Math.floor(Math.random() * 9);
            sudoku[randomRow][randomColumn] = Math.floor(Math.random()*9) + 1;
        }
    } while (!backtrackSudoku(0, 0));
    for (let row = 0; row <= 8; row++) {
        for (let column = 0; column <= 8; column++) {
            if (Math.floor(Math.random() * 100) < chance) {
                sudoku[row][column] = 0;
            }
        }
    }
    exportNumbers();
    if (lockOnGeneration) {
        for (let row = 1; row <= 9; row++) {
            for (let column = 1; column <= 9; column++) {
                let cell = document.getElementById("cell"+row+column);
                if (cell.value !== "") {
                    cell.disabled = true;
                    cell.style.fontWeight = "bold";
                }
            }
        }
    }
}