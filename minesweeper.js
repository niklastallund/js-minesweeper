class Minesweeper {
    constructor() {
        this.difficulties = {
            beginner: { rows: 9, cols: 9, mines: 10 },
            intermediate: { rows: 16, cols: 16, mines: 40 },
            expert: { rows: 16, cols: 32, mines: 99 },
            nerd: { rows: 18, cols: 50, mines: 199 },
        };
        this.currentDifficulty = "beginner";
        this.board = [];
        this.gameState = "start";
        this.firstClick = true;
        this.flagCount = 0;
        this.revealCount = 0;
        this.mineCount = 0;

        this.generateOptions();
        this.newGame();
    }

    newGame() {
        //Reset everything
        this.gameState = "start";
        this.firstClick = true;
        this.flagCount = 0;
        this.revealCount = 0;
        this.mineCount = this.difficulties[this.currentDifficulty].mines;
        this.board = [];

        //Generate a new board
        this.generateBoard();
    }

    //Generates the reset and difficulty buttons
    generateOptions() {
        const dropdown = document.getElementById("difficulty-dropdown");
        dropdown.innerHTML = "";

        Object.keys(this.difficulties).forEach((key) => {
            const button = document.createElement("button");
            const difficulty = this.difficulties[key];

            button.textContent = `${key} (${difficulty.rows}x${difficulty.cols}, ${difficulty.mines} mines)`;
            button.addEventListener("click", () => this.handleDifficulty(key));

            dropdown.appendChild(button);
        });

        //Generate the rest button functionality
        document
            .getElementById("reset-button")
            .addEventListener("click", () => this.newGame());
    }

    //Handles changing difficulty when a difficulty button is clicked
    handleDifficulty(key) {
        this.currentDifficulty = key;
        this.newGame();
    }

    //Generates the logic for the game board
    generateBoard() {
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

                cell.addEventListener("click", (event) =>
                    this.clickedLeft(event, row, col)
                );
                cell.addEventListener("contextmenu", (event) => {
                    this.clickedRight(event, row, col);
                });

                grid.appendChild(cell);
            }
        }

        //Set the mine counter for the board
        document.getElementById("mine-counter").innerHTML = this.mineCount;
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
});
