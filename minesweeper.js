class Minesweeper {
    constructor() {
        this.difficulties = {
            beginner: { rows: 9, cols: 9, mines: 10 },
            intermediate: { rows: 16, cols: 16, mines: 40 },
            expert: { rows: 16, cols: 32, mines: 99 },
            impossible: { rows: 18, cols: 50, mines: 199 },
        };
        this.currentDifficulty = "beginner";
        this.board = [];
        this.gameState = "start";
        this.flagCount = 0;
        this.revealCount = 0;
        this.mineCount = 0;
        this.timer = 0;
        this.timerInterval = null;

        this.generateOptions();
        this.newGame();
    }

    newGame() {
        //Reset everything and generate a new board
        this.gameState = "start";
        this.flagCount = 0;
        this.revealCount = 0;
        this.mineCount = this.difficulties[this.currentDifficulty].mines;
        this.timer = 0;
        this.board = [];

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.generateBoard();
    }

    //Generates the reset and difficulty buttons
    generateOptions() {
        const difficultyButton = document.getElementById("difficulty-button");
        difficultyButton.addEventListener("click", () =>
            this.handleDropdownMenu()
        );

        Object.keys(this.difficulties).forEach((key) => {
            const button = document.createElement("button");
            const difficulty = this.difficulties[key];

            button.textContent = `${key} (${difficulty.rows}x${difficulty.cols}, ${difficulty.mines} mines)`;
            button.addEventListener("click", () => this.handleDifficulty(key));

            document.getElementById("dropdown-menu").appendChild(button);
        });

        //Generate the rest button functionality
        document
            .getElementById("reset-button")
            .addEventListener("click", () => this.newGame());
    }

    //Toggles the difficulty menu
    handleDropdownMenu() {
        document.querySelector(".dropdown-content").classList.toggle("show");
    }

    //Handles changing difficulty when a difficulty button is clicked
    handleDifficulty(key) {
        this.currentDifficulty = key;
        document.getElementById("timer").textContent = "000";
        this.handleDropdownMenu();
        this.newGame();
    }

    //Generates the logic for the game board
    generateBoard() {
        const diff = this.difficulties[this.currentDifficulty];

        for (let row = 0; row < diff.rows; ++row) {
            this.board[row] = [];
            for (let col = 0; col < diff.cols; ++col) {
                //element contains the DOM element of the cell
                this.board[row][col] = {
                    isMine: false,
                    isFlag: false,
                    isClear: false,
                    neighborMines: 0,
                    element: null,
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

        //Create the DOM element for each tile and store it in board[row][col].element
        for (let row = 0; row < diff.rows; ++row) {
            for (let col = 0; col < diff.cols; ++col) {
                const tile = document.createElement("div");
                tile.className = "tile";

                tile.addEventListener("click", (event) => {
                    event.preventDefault();
                    this.clickedLeft(row, col);
                });
                tile.addEventListener("contextmenu", (event) => {
                    event.preventDefault();
                    this.clickedRight(row, col);
                });

                this.board[row][col].element = tile;
                grid.appendChild(tile);
            }
        }

        //Set the mine counter for the board
        document.getElementById("mine-counter").innerHTML = this.mineCount
            .toString()
            .padStart(3, "0");
    }

    //TODO Should probably refactor this with some helper functions
    //Calculates which mines have neighbors and how many they have
    //Allows us to display the neighbor count on each tile and reveal open tiles
    calculateNeighborMines() {
        const difficulty = this.difficulties[this.currentDifficulty];
        //1. We loop through every coordinate in the board
        //2. Check every neighbor for mines and update neighborMines
        for (let row = 0; row < difficulty.rows; ++row) {
            for (let col = 0; col < difficulty.cols; ++col) {
                //No need to check for neighbors if it is a mine
                if (!this.board[row][col].isMine) {
                    let mineCount = 0;

                    //Look through all coordinates around the given tile
                    for (let i = -1; i <= 1; ++i) {
                        for (let j = -1; j <= 1; ++j) {
                            let nRow = row + i;
                            let nCol = col + j;

                            //Check if coordinates are inside the board and if it's a mine
                            if (
                                nRow >= 0 &&
                                nRow < difficulty.rows &&
                                nCol >= 0 &&
                                nCol < difficulty.cols &&
                                this.board[nRow][nCol].isMine
                            ) {
                                ++count;
                            }
                        }
                    }

                    this.board[row][col].neighborMines = count;
                }
            }
        }
    }

    placeMines(clickedRow, clickedCol) {
        const difficulty = this.difficulties[this.currentDifficulty];
        let placedMines = 0;

        //Generate random coordinates and place mines there
        while (placedMines < difficulty.mines) {
            let row = Math.floor(Math.random() * difficulty.rows);
            let col = Math.floor(Math.random() * difficulty.cols);
            let tile = this.board[row][col];

            //Dont place a mine on the first click tile or if it's already a mine.
            if ((row === clickedRow && col === clickedCol) || tile.isMine) {
                continue;
            }

            tile.isMine = true;
            placedMines++;
        }

        this.calculateNeighborMines();
    }

    //TODO Update the current tile
    revealTile(currentTile) {
        return;
    }

    //TODO Use this to show all mines on game over
    updateAllTiles() {
        return;
    }

    //Check if we won after clicking a tile
    checkWin() {
        const difficulty = this.difficulties[this.currentDifficulty];
        const totalCells = config.rows * config.cols;

        if (this.revealCount === totalCells - difficulty.mines) {
            this.gameOver(true);
        }
    }

    //TODO
    //won is a bool which decides if we won or lost
    gameOver(won) {
        return;
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        document.getElementById("timer").textContent = Math.min(this.timer, 999)
            .toString()
            .padStart(3, "0");
    }

    clickedLeft(row, col) {
        const currentTile = this.board[row][col];

        //We do nothing if one of these are true
        if (this.gameState === "won" || this.gameState === "lost") return;
        if (currentTile.isFlag || currentTile.isClear) return;

        //gameState "start" means no tile has been clicked
        //Give placeMines the coordinates to the first square to avoid losing on first move
        if (this.gameState === "start") {
            this.gameState = "playing";
            this.placeMines(row, col);
            this.startTimer();
        }

        if (currentTile.isMine) {
            this.gameOver(false);
        } else {
            this.revealTile(currentTile);
            this.checkWin();
        }
    }

    //TODO
    clickedRight(row, col) {
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

//Hides the difficulty menu if user clicks outside the window
document.addEventListener("click", function (event) {
    if (!event.target.matches("#difficulty-button")) {
        var dropdown = document.querySelector(".dropdown-content");
        if (dropdown.classList.contains("show")) {
            dropdown.classList.remove("show");
        }
    }
});
