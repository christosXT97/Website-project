// Connect 4 Game Logic
document.addEventListener('DOMContentLoaded', () => {
    // Game configuration
    const ROWS = 6;
    const COLS = 7;
    const EMPTY = 0;
    const RED = 1;
    const YELLOW = 2;
    const WINNING_LENGTH = 4;

    // Game state
    let currentPlayer = RED;
    let gameBoard = [];
    let gameOver = false;
    let scores = { 1: 0, 2: 0 };
    let gameStatus = document.getElementById('game-status');
    
    // Initialize the game
    function initGame() {
        gameBoard = Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY));
        currentPlayer = RED;
        gameOver = false;
        
        const board = document.querySelector('.connect4-board');
        board.innerHTML = '';
        
        // Create board columns
        for (let col = 0; col < COLS; col++) {
            const column = document.createElement('div');
            column.className = 'board-column';
            column.dataset.col = col;
            
            // Create cells for each column (bottom to top)
            for (let row = ROWS - 1; row >= 0; row--) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                column.appendChild(cell);
            }
            
            column.addEventListener('click', handleColumnClick);
            board.appendChild(column);
        }
        
        // Update player indicators
        updatePlayerIndicators();
        
        // Update game status
        updateGameStatus();
    }
    
    // Update player indicators (active player highlight)
    function updatePlayerIndicators() {
        const player1El = document.querySelector('.player-1');
        const player2El = document.querySelector('.player-2');
        
        if (player1El && player2El) {
            player1El.classList.toggle('active', currentPlayer === RED);
            player2El.classList.toggle('active', currentPlayer === YELLOW);
        }
    }
    
    // Handle column click
    function handleColumnClick(event) {
        if (gameOver) return;
        
        const col = parseInt(event.currentTarget.dataset.col);
        const row = findAvailableRow(col);
        
        if (row !== -1) {
            makeMove(row, col);
            
            // Check for win or draw
            if (checkWin(row, col)) {
                gameOver = true;
                // Update scores
                scores[currentPlayer]++;
                updateScores();
                updateGameStatus(true);
            } else if (checkDraw()) {
                gameOver = true;
                updateGameStatus(false, true);
            } else {
                // Switch player
                currentPlayer = currentPlayer === RED ? YELLOW : RED;
                // Update player indicators
                updatePlayerIndicators();
                updateGameStatus();
            }
        }
    }
    
    // Find the first available row in a column
    function findAvailableRow(col) {
        for (let row = 0; row < ROWS; row++) {
            if (gameBoard[row][col] === EMPTY) {
                return row;
            }
        }
        return -1; // Column is full
    }
    
    // Make a move
    function makeMove(row, col) {
        gameBoard[row][col] = currentPlayer;
        
        // Update the UI
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add(currentPlayer === RED ? 'red' : 'yellow');
    }
    
    // Update scores display
    function updateScores() {
        const score1El = document.querySelector('.player-1 .score');
        const score2El = document.querySelector('.player-2 .score');
        
        if (score1El) score1El.textContent = scores[1];
        if (score2El) score2El.textContent = scores[2];
    }
    
    // Check for win
    function checkWin(row, col) {
        // Check directions: horizontal, vertical, diagonal up, diagonal down
        const directions = [
            [[0, 1], [0, -1]], // Horizontal
            [[1, 0], [-1, 0]], // Vertical
            [[1, 1], [-1, -1]], // Diagonal up
            [[1, -1], [-1, 1]] // Diagonal down
        ];
        
        for (const direction of directions) {
            let count = 1; // Count the placed piece
            const winningCells = [[row, col]];
            
            // Check in both directions
            for (const [dx, dy] of direction) {
                let r = row + dx;
                let c = col + dy;
                
                while (
                    r >= 0 && r < ROWS && 
                    c >= 0 && c < COLS && 
                    gameBoard[r][c] === currentPlayer
                ) {
                    winningCells.push([r, c]);
                    count++;
                    r += dx;
                    c += dy;
                }
            }
            
            if (count >= WINNING_LENGTH) {
                // Highlight winning cells
                for (const [r, c] of winningCells) {
                    const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                    cell.classList.add('winning-cell');
                }
                return true;
            }
        }
        
        return false;
    }
    
    // Check for draw
    function checkDraw() {
        return gameBoard.every(row => row.every(cell => cell !== EMPTY));
    }
    
    // Update game status display
    function updateGameStatus(win = false, draw = false) {
        if (win) {
            const winner = currentPlayer === RED ? 'Red' : 'Yellow';
            gameStatus.textContent = `${winner} wins! :)`;
            gameStatus.classList.add('win-message');
        } else if (draw) {
            gameStatus.textContent = 'Game ends in a draw!';
            gameStatus.classList.remove('win-message');
        } else {
            const player = currentPlayer === RED ? "1's turn (Red)" : "2's turn (Yellow)";
            gameStatus.textContent = `Player ${player}`;
            gameStatus.classList.remove('win-message');
        }
    }
    
    // Reset game (just the current round)
    function resetGame() {
        // Clear winning styles
        document.querySelectorAll('.winning-cell').forEach(cell => {
            cell.classList.remove('winning-cell');
        });
        
        // Initialize a new game
        initGame();
    }
    
    // New match (reset scores and game)
    function newMatch() {
        scores = { 1: 0, 2: 0 };
        updateScores();
        resetGame();
    }
    
    // Add event listeners to buttons
    document.getElementById('reset-game').addEventListener('click', resetGame);
    
    // Check if new match button exists
    const newMatchBtn = document.getElementById('new-match');
    if (newMatchBtn) {
        newMatchBtn.addEventListener('click', newMatch);
    }
    
    // Initialize the game when the page loads
    initGame();
});