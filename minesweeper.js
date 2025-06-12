class Minesweeper {
    constructor() {
        this.difficulties = {
            one: { rows: 9, cols: 9, mines: 10 },
            two: { rows: 16, cols: 16, mines: 40 },
            three: { rows: 16, cols: 32, mines: 99 },
            extreme: { rows: 20, cols: 40, mines: 199 },
        };
        this.currentDifficulty = "one";
        this.board = [];
        this.gameState = "start";
        this.firstClick = true;
        this.flagCount = 0;
        this.revealCount = 0;

        this.newGame();
    }

    newGame() {
        //Reset everything
        this.gameState = "start";
        this.firstClick = true;
        this.flagCount = 0;
        this.revealCount = 0;
        this.board = [];

        //Generate a new board
        this.generateBoard();
    }

    //Generates the logic for the game board
    generateBoard() {
        this.currentDifficulty = "extreme";
        const diff = this.difficulties[this.currentDifficulty];

        for (let row = 0; row < diff.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < diff.cols; col++) {
                this.board[row][col] = {
                    isMine: false,
                    isFlag: false,
                    isCleared: false,
                    neighborMines: 0,
                };
            }
        }

        this.generateGrid();
    }

    //Generates the visual game grid
    generateGrid() {
        const diff = this.difficulties[this.currentDifficulty];
        const grid = document.getElementById("grid-container");
        grid.innerHTML = "";
        grid.style.gridTemplateRows = `repeat(${diff.rows}, 1fr)`;
        grid.style.gridTemplateColumns = `repeat(${diff.cols}, 1fr)`;

        for (let row = 0; row < diff.rows; row++) {
            for (let col = 0; col < diff.cols; col++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.dataset.row = row;
                cell.dataset.col = col;

                cell.addEventListener("click", (element) =>
                    this.clickedLeft(element, row, col)
                );
                cell.addEventListener("contextmenu", (element) => {
                    this.clickedRight(element, row, col);
                });

                grid.appendChild(cell);
            }
        }
    }

    //TODO
    clickedLeft() {
        return;
    }

    //TODO
    clickedRight() {
        return;
    }
}

/* ---- */
/* Main */
/* ---- */

document.addEventListener("DOMContentLoaded", function () {
    // Your initialization code here
    const game = new Minesweeper();
    console.log("hello");
});
