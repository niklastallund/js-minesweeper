class Minesweeper {
    constructor() {
        this.difficulties = {
            beginner: { rows: 9, cols: 9, mines: 10 },
            intermediate: { rows: 16, cols: 16, mines: 40 },
            expert: { rows: 16, cols: 32, mines: 99 },
            impossible: { rows: 18, cols: 50, mines: 199 },
        };
        this.currentDifficulty = this.difficulties.beginner;
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
        this.mineCount = this.currentDifficulty.mines;
        this.timer = 0;
        this.board = [];
        document.getElementById("reset-button").innerHTML = "🙂";

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
            const diff = this.difficulties[key];

            button.textContent = `${key} (${diff.rows}x${diff.cols}, ${diff.mines} mines)`;
            button.addEventListener("click", () => this.handleDifficulty(key));

            document.getElementById("dropdown-menu").appendChild(button);
        });

        //Generate the reset button functionality
        const resetButton = document.getElementById("reset-button");

        resetButton.addEventListener("click", () => this.newGame());
        resetButton.addEventListener("mousedown", () => {
            document.getElementById("reset-button").textContent = "😮";
        });
    }

    //Toggles the difficulty menu
    handleDropdownMenu() {
        document.querySelector(".dropdown-content").classList.toggle("show");
    }

    //Handles changing difficulty when a difficulty button is clicked
    handleDifficulty(key) {
        this.currentDifficulty = this.difficulties[key];
        document.getElementById("timer").textContent = "000";
        this.handleDropdownMenu();
        this.newGame();
    }

    //Generates the logic for the game board
    generateBoard() {
        const diff = this.currentDifficulty;

        for (let row = 0; row < diff.rows; ++row) {
            this.board[row] = [];
            for (let col = 0; col < diff.cols; ++col) {
                //element contains the DOM element of the cell
                this.board[row][col] = {
                    isMine: false,
                    isFlag: false,
                    isRevealed: false,
                    neighborMines: 0,
                    element: null,
                };
            }
        }

        this.generateGrid();
    }

    //Generates the visual game grid
    generateGrid() {
        const diff = this.currentDifficulty;
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
                    this.handleLeftClick(row, col);
                });
                tile.addEventListener("contextmenu", (event) => {
                    event.preventDefault();
                    this.handleRightClick(row, col);
                });

                this.board[row][col].element = tile;
                grid.appendChild(tile);
            }
        }

        this.updateMineCounter();
    }

    updateMineCounter() {
        const currentCount = this.currentDifficulty.mines - this.flagCount;
        document.getElementById("mine-counter").innerHTML = currentCount
            .toString()
            .padStart(3, "0");
    }

    //TODO Should probably refactor this with some helper functions
    //Calculates which mines have neighbors and how many they have
    //Allows us to display the neighbor count on each tile and reveal open tiles
    calculateNeighborMines() {
        const diff = this.currentDifficulty;
        //1. We loop through every coordinate in the board
        //2. Check every neighbor for mines and update neighborMines
        for (let row = 0; row < diff.rows; ++row) {
            for (let col = 0; col < diff.cols; ++col) {
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
                                nRow < diff.rows &&
                                nCol >= 0 &&
                                nCol < diff.cols
                            ) {
                                if (this.board[nRow][nCol].isMine) {
                                    ++mineCount;
                                }
                            }
                        }
                    }

                    this.board[row][col].neighborMines = mineCount;
                }
            }
        }
    }

    placeMines(clickedRow, clickedCol) {
        let placedMines = 0;

        //Generate random coordinates and place mines there
        while (placedMines < this.currentDifficulty.mines) {
            let row = Math.floor(Math.random() * this.currentDifficulty.rows);
            let col = Math.floor(Math.random() * this.currentDifficulty.cols);
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

    //Reveals ths given tile both graphically and in the game logic
    revealTile(tile) {
        if (tile.isRevealed) return;

        tile.isRevealed = true;
        this.revealCount++;

        const colors = [
            "blue",
            "green",
            "red",
            "purple",
            "maroon",
            "turquoise",
            "black",
            "gray",
        ];

        if (tile.isMine) {
            tile.element.innerHTML = "💣";
            tile.element.classList.add("revealed-mine");
        } else if (tile.neighborMines != 0) {
            tile.element.innerHTML = tile.neighborMines;
            tile.element.style.color = colors[tile.neighborMines - 1];
            tile.element.classList.add("revealed");
        } else {
            tile.element.innerHTML = "";
            tile.element.classList.add("revealed");
        }
    }

    //Uses recursion to reveal neighboring tiles if the given tile has no neighboring mines
    revealTileAndNeighbors(row, col) {
        const diff = this.currentDifficulty;

        //Bounds checking
        if (row < 0 || row >= diff.rows || col < 0 || col >= diff.cols) return;

        const tile = this.board[row][col];

        // Don't reveal if already revealed, flagged, or is a mine
        if (tile.isRevealed || tile.isFlag || tile.isMine) return;

        this.revealTile(tile);

        // If this tile has no neighboring mines, recursively reveal neighbors
        if (tile.neighborMines === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    this.revealTileAndNeighbors(row + i, col + j);
                }
            }
        }
    }

    //Reveals all mines in case we click a mine and lose
    revealAllMines() {
        const diff = this.currentDifficulty;

        for (let row = 0; row < diff.rows; ++row) {
            for (let col = 0; col < diff.cols; ++col) {
                let tile = this.board[row][col];
                if (tile.isMine && !tile.isFlag) {
                    this.revealTile(tile);
                }
            }
        }
    }

    //Check if we won after clicking a tile
    checkWin() {
        const diff = this.currentDifficulty;
        const totalCells = diff.rows * diff.cols;

        if (this.revealCount === totalCells - diff.mines) {
            this.gameOver(true);
        }
    }

    //won is a bool which decides if we won or lost
    gameOver(won) {
        const button = document.getElementById("reset-button");

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.gameState = won ? "won" : "lost";

        if (won) {
            button.innerHTML = "😎";
        } else {
            button.innerHTML = "😵";
        }
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

    handleLeftClick(row, col) {
        const currentTile = this.board[row][col];

        //We do nothing if one of these are true
        if (this.gameState === "won" || this.gameState === "lost") return;
        if (currentTile.isFlag || currentTile.isRevealed) return;

        //gameState "start" means no tile has been clicked
        //Give placeMines the coordinates to the first square to avoid losing on first move
        if (this.gameState === "start") {
            this.gameState = "playing";
            this.placeMines(row, col);
            this.startTimer();
        }

        if (currentTile.isMine) {
            this.revealAllMines();
            this.gameOver(false);
        } else {
            this.revealTileAndNeighbors(row, col);
            this.checkWin();
        }
    }

    handleRightClick(row, col) {
        const currentTile = this.board[row][col];
        if (this.gameState === "won" || this.gameState === "lost") return;
        if (currentTile.isRevealed) return;

        //Toggle the flag bool and update the mine count
        currentTile.isFlag = !currentTile.isFlag;
        this.flagCount += currentTile.isFlag ? 1 : -1;
        this.updateMineCounter();

        //Update the tile visuals
        if (currentTile.element.innerHTML === "🚩") {
            currentTile.element.innerHTML = "";
        } else {
            currentTile.element.innerHTML = "🚩";
        }
    }
}

/* ---- */
/* Main */
/* ---- */

document.addEventListener("DOMContentLoaded", function () {
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
