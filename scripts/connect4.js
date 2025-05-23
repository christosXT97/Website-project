//scripts/connect4.js
// Connect 4 Game Logic - Fixed Column Mapping
document.addEventListener('DOMContentLoaded', () => {
    console.log("Connect 4 game initialized");
    
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
    
    // Debug function - can be removed in production
    function debugLog(message) {
        console.log(`[Connect4] ${message}`);
    }
    
    // Initialize the game
    function initGame() {
        debugLog("Initializing game board");
        
        // Reset game board state to empty
        gameBoard = Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY));
        currentPlayer = RED;
        gameOver = false;
        
        // Clear the board interface
        const boardContainer = document.querySelector('.connect4-board');
        boardContainer.innerHTML = '';
        
        // Create board columns in LEFT to RIGHT order (0=leftmost, 6=rightmost)
        for (let col = 0; col < COLS; col++) {
            const column = document.createElement('div');
            column.className = 'board-column';
            column.dataset.col = col; // Store column index as data attribute
            
            debugLog(`Creating column ${col}`);
            
            // Create cells for each column (from bottom to top)
            for (let row = ROWS - 1; row >= 0; row--) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                column.appendChild(cell);
            }
            
            // Add click event to the column with explicit column capture
            column.addEventListener('click', function() {
                const clickedCol = parseInt(this.dataset.col);
                debugLog(`Column ${clickedCol} clicked`);
                
                if (!gameOver) {
                    dropPiece(clickedCol);
                }
            });
            
            boardContainer.appendChild(column);
        }
        
        // Add column hover effect
        addColumnHoverEffect();
        
        // Update UI elements
        updatePlayerIndicators();
        updateGameStatus();
        
        debugLog("Game board initialized successfully");
    }
    
    // Add hover effect to columns
    function addColumnHoverEffect() {
        const columns = document.querySelectorAll('.board-column');
        
        columns.forEach(column => {
            column.addEventListener('mouseenter', function() {
                if (gameOver) return;
                
                const col = parseInt(this.dataset.col);
                debugLog(`Hovering column ${col}`);
                
                const availableRow = findLowestEmptyRow(col);
                if (availableRow !== -1) {
                    this.classList.add('column-hover');
                    this.style.cursor = 'pointer';
                } else {
                    this.style.cursor = 'not-allowed';
                }
            });
            
            column.addEventListener('mouseleave', function() {
                this.classList.remove('column-hover');
            });
        });
    }
    
    // Drop a piece in the specified column
    function dropPiece(col) {
        debugLog(`Attempting to drop piece in column ${col}`);
        
        // Find the lowest empty row in this column
        const row = findLowestEmptyRow(col);
        
        if (row !== -1) {
            debugLog(`Dropping ${currentPlayer === RED ? 'RED' : 'YELLOW'} piece at row ${row}, col ${col}`);
            
            // Update game state
            gameBoard[row][col] = currentPlayer;
            
            // Update visual representation
            updateCell(row, col);
            
            // Check for win
            if (checkWin(row, col)) {
                gameOver = true;
                scores[currentPlayer]++;
                updateScores();
                updateGameStatus(true);
                celebrateWin();
                return;
            }
            
            // Check for draw
            if (checkDraw()) {
                gameOver = true;
                updateGameStatus(false, true);
                return;
            }
            
            // Switch players
            currentPlayer = currentPlayer === RED ? YELLOW : RED;
            updatePlayerIndicators();
            updateGameStatus();
        } else {
            debugLog(`Column ${col} is full`);
        }
    }
    
    // Find the lowest empty row in a column
    function findLowestEmptyRow(col) {
        for (let row = 0; row < ROWS; row++) {
            if (gameBoard[row][col] === EMPTY) {
                return row;
            }
        }
        return -1; // Column is full
    }
    
    // Update the visual cell
    function updateCell(row, col) {
        // In the UI, rows are displayed from bottom to top
        // Row 0 (bottom row in game logic) is displayed as the first cell in the column
        const visualRow = ROWS - 1 - row;
        
        debugLog(`Updating visual cell at row ${row} (visual row ${visualRow}), col ${col}`);
        
        // Get the column by its data-col attribute to ensure direct mapping
        const column = document.querySelector(`.board-column[data-col="${col}"]`);
        
        if (!column) {
            debugLog(`ERROR: Could not find column ${col}`);
            return;
        }
        
        // Get the cell within that column at the correct visual position
        const cell = column.children[visualRow];
        
        if (!cell) {
            debugLog(`ERROR: Could not find cell at visual row ${visualRow} in column ${col}`);
            return;
        }
        
        // Add the appropriate color class
        cell.classList.add(currentPlayer === RED ? 'red' : 'yellow');
        
        // Add drop animation
        applyDropAnimation(cell, visualRow);
    }
    
    // Apply dropping animation to a cell
    function applyDropAnimation(cell, visualRow) {
        // Remove any existing animation
        cell.style.animation = 'none';
        
        // Force reflow to restart animation
        void cell.offsetWidth;
        
        // Calculate animation duration based on drop height
        const duration = 0.2 + (visualRow * 0.05);
        
        // Apply animation with variable duration
        cell.style.animation = `dropPiece ${duration}s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
    }
    
    // Update player indicators (active player highlight)
    function updatePlayerIndicators() {
        const player1 = document.querySelector('.player-1');
        const player2 = document.querySelector('.player-2');
        
        if (player1 && player2) {
            player1.classList.toggle('active', currentPlayer === RED);
            player2.classList.toggle('active', currentPlayer === YELLOW);
        }
    }
    
    // Update scores display
    function updateScores() {
        const score1 = document.querySelector('.player-1 .score');
        const score2 = document.querySelector('.player-2 .score');
        
        if (score1) score1.textContent = scores[1];
        if (score2) score2.textContent = scores[2];
    }
    
    // Update game status message
    function updateGameStatus(win = false, draw = false) {
        if (!gameStatus) return;
        
        if (win) {
            const winner = currentPlayer === RED ? 'Red' : 'Yellow';
            gameStatus.textContent = `${winner} wins! 🎉`;
            gameStatus.classList.add('win-message');
        } else if (draw) {
            gameStatus.textContent = `Game ends in a draw!`;
            gameStatus.classList.remove('win-message');
        } else {
            const player = currentPlayer === RED ? "1's turn (Red)" : "2's turn (Yellow)";
            gameStatus.textContent = `Player ${player}`;
            gameStatus.classList.remove('win-message');
        }
    }
    
    // Check for win
    function checkWin(row, col) {
        // Check directions: horizontal, vertical, diagonal up, diagonal down
        const directions = [
            [[0, 1], [0, -1]], // Horizontal
            [[1, 0], [-1, 0]], // Vertical
            [[1, 1], [-1, -1]], // Diagonal up-right
            [[1, -1], [-1, 1]]  // Diagonal up-left
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
                highlightWinningCells(winningCells);
                return true;
            }
        }
        
        return false;
    }
    
    // Highlight winning cells
    function highlightWinningCells(winningCells) {
        for (const [row, col] of winningCells) {
            const visualRow = ROWS - 1 - row;
            
            // Use direct column selection by data attribute
            const column = document.querySelector(`.board-column[data-col="${col}"]`);
            if (column) {
                const cell = column.children[visualRow];
                if (cell) {
                    cell.classList.add('winning-cell');
                }
            }
        }
    }
    
    // Check for draw (board full)
    function checkDraw() {
        return gameBoard.every(row => row.every(cell => cell !== EMPTY));
    }
    
    // Celebrate win with confetti
    function celebrateWin() {
        const gameContainer = document.querySelector('.game-container');
        const colors = ['#f44336', '#2196F3', '#ffeb3b', '#4CAF50', '#9C27B0', '#FF9800'];
        
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 5 + 5}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
            
            gameContainer.appendChild(confetti);
            
            // Remove confetti after animation completes
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }
    }
    
    // Reset current game
    function resetGame() {
        debugLog("Resetting game");
        
        // Remove winning highlights
        document.querySelectorAll('.winning-cell').forEach(cell => {
            cell.classList.remove('winning-cell');
        });
        
        // Remove all pieces
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('red', 'yellow');
            cell.style.animation = '';
        });
        
        // Remove confetti
        document.querySelectorAll('.confetti').forEach(confetti => {
            confetti.remove();
        });
        
        // Reset game state
        gameBoard = Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY));
        gameOver = false;
        currentPlayer = RED;
        
        // Update UI
        updatePlayerIndicators();
        updateGameStatus();
    }
    
    // Reset entire match (including scores)
    function newMatch() {
        debugLog("Starting new match");
        scores = { 1: 0, 2: 0 };
        updateScores();
        resetGame();
    }
    
    // Add event listeners to buttons
    const resetButton = document.getElementById('reset-game');
    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
    }
    
    const newMatchButton = document.getElementById('new-match');
    if (newMatchButton) {
        newMatchButton.addEventListener('click', newMatch);
    }
    
    // Initialize the game
    initGame();
});