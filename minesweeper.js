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

        for (let row = 0; row < diff.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < diff.cols; col++) {
                this.board[row][col] = {
                    isMine: false,
                    isFlag: false,
                    isClear: false,
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
                const tile = document.createElement("div");
                tile.className = "tile";
                tile.dataset.row = row;
                tile.dataset.col = col;

                tile.addEventListener("click", (event) => {
                    event.preventDefault();
                    this.clickedLeft(row, col);
                });
                tile.addEventListener("contextmenu", (event) => {
                    event.preventDefault();
                    this.clickedRight(row, col);
                });

                grid.appendChild(tile);
            }
        }

        //Set the mine counter for the board
        document.getElementById("mine-counter").innerHTML = this.mineCount
            .toString()
            .padStart(3, "0");
    }

    //TODO
    calculateNeighborMines(row, col) {
        return;
    }

    //TODO
    placeMines(row, col) {
        return;
    }

    //TODO
    revealTile() {
        //TODO check for victory
        return;
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

    //TODO
    clickedLeft(row, col) {
        const currentTile = this.board[row][col]; //Current tile

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
            revealTile();
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
