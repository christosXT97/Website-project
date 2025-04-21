// Tic Tac Toe Game Logic
document.addEventListener('DOMContentLoaded', () => {
    // Game configuration
    const EMPTY = '';
    const PLAYER_X = 'X';
    const PLAYER_O = 'O';
    const WINNING_COMBINATIONS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Game state
    let currentPlayer = PLAYER_X;
    let gameBoard = Array(9).fill(EMPTY);
    let gameOver = false;
    let scores = { X: 0, O: 0 };
    let gameStatus = document.getElementById('game-status');
    let lastWinner = null;

    // Initialize the game
    function initGame() {
        gameBoard = Array(9).fill(EMPTY);
        gameOver = false;

        // Set starting player (winner goes second in the next game)
        if (lastWinner === PLAYER_X) {
            currentPlayer = PLAYER_O;
        } else if (lastWinner === PLAYER_O) {
            currentPlayer = PLAYER_X;
        } 
        // else currentPlayer remains as PLAYER_X (default)

        const board = document.querySelector('.tictactoe-board');
        board.innerHTML = '';
        
        // Create board cells
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            
            cell.addEventListener('click', () => {
                if (!gameOver && gameBoard[i] === EMPTY) {
                    makeMove(i);
                }
            });
            
            board.appendChild(cell);
        }
        
        // Add hover effect
        addHoverEffect();
        
        // Update player indicators
        updatePlayerIndicators();
        
        // Update game status
        updateGameStatus();
    }
    
    // Add hover effect to show which player's turn it is
    function addHoverEffect() {
        const board = document.querySelector('.tictactoe-board');
        board.classList.remove('x-turn', 'o-turn');
        board.classList.add(currentPlayer === PLAYER_X ? 'x-turn' : 'o-turn');
    }
    
    // Make a move
    function makeMove(index) {
        // Update game board
        gameBoard[index] = currentPlayer;
        
        // Update UI
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.classList.add(currentPlayer.toLowerCase());
        
        // Create mark element with animation
        const mark = document.createElement('span');
        mark.textContent = currentPlayer;
        mark.className = 'mark';
        cell.appendChild(mark);
        
        // Check for win or draw
        if (checkWin()) {
            gameOver = true;
            lastWinner = currentPlayer;
            scores[currentPlayer]++;
            updateScores();
            updateGameStatus(true);
            highlightWinningCombination();
            celebrateWin();
        } else if (checkDraw()) {
            gameOver = true;
            lastWinner = null;
            updateGameStatus(false, true);
        } else {
            // Switch player
            currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
            
            // Update hover effect
            addHoverEffect();
            
            // Update player indicators
            updatePlayerIndicators();
            
            // Update game status
            updateGameStatus();
        }
    }
    
    // Update player indicators
    function updatePlayerIndicators() {
        const playerX = document.querySelector('.player-x');
        const playerO = document.querySelector('.player-o');
        
        if (playerX) playerX.classList.toggle('active', currentPlayer === PLAYER_X);
        if (playerO) playerO.classList.toggle('active', currentPlayer === PLAYER_O);
    }
    
    // Update scores display
    function updateScores() {
        const scoreX = document.querySelector('.player-x .score');
        const scoreO = document.querySelector('.player-o .score');
        
        if (scoreX) scoreX.textContent = scores.X;
        if (scoreO) scoreO.textContent = scores.O;
    }
    
    // Check for win
    function checkWin() {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return gameBoard[index] === currentPlayer;
            });
        });
    }
    
    // Get the winning combination
    function getWinningCombination() {
        return WINNING_COMBINATIONS.find(combination => {
            return combination.every(index => {
                return gameBoard[index] === currentPlayer;
            });
        });
    }
    
    // Highlight winning combination
    function highlightWinningCombination() {
        const winningCombo = getWinningCombination();
        
        if (winningCombo) {
            // Add winning class to cells
            winningCombo.forEach(index => {
                const cell = document.querySelector(`.cell[data-index="${index}"]`);
                if (cell) cell.classList.add('winning-cell');
            });
            
            // Add line through winning combination
            drawWinningLine(winningCombo);
        }
    }
    
    // Draw line through winning combination
    function drawWinningLine(combination) {
        console.log("Drawing winning line for combination:", combination);
        const board = document.querySelector('.tictactoe-board');
        const line = document.createElement('div');
        
        // Sort the combination to ensure consistent checking regardless of the order
        const sortedCombo = [...combination].sort((a, b) => a - b);
        const comboString = sortedCombo.join(',');
        console.log("Sorted combination string:", comboString);
        
        // Horizontal lines
        if (comboString === '0,1,2') {
            line.className = 'winning-line horizontal top';
        } else if (comboString === '3,4,5') {
            line.className = 'winning-line horizontal middle';
        } else if (comboString === '6,7,8') {
            line.className = 'winning-line horizontal bottom';
        } 
        // Vertical lines
        else if (comboString === '0,3,6') {
            line.className = 'winning-line vertical left';
        } else if (comboString === '1,4,7') {
            line.className = 'winning-line vertical middle';
        } else if (comboString === '2,5,8') {
            line.className = 'winning-line vertical right';
        } 
        // Diagonal lines
        else if (comboString === '0,4,8') {
            line.className = 'winning-line diagonal-down';
        } else if (comboString === '2,4,6') {
            line.className = 'winning-line diagonal-up';
        }
        
        console.log("Line class:", line.className);
        board.appendChild(line);
    }
    
    // Check for draw
    function checkDraw() {
        return gameBoard.every(cell => cell !== EMPTY);
    }
    
    // Update game status display
    function updateGameStatus(win = false, draw = false) {
        if (!gameStatus) return;
        
        if (win) {
            gameStatus.textContent = `Player ${currentPlayer} wins! 🎉`;
            gameStatus.classList.add('win-message');
        } else if (draw) {
            gameStatus.textContent = `Game ends in a draw!`;
            gameStatus.classList.remove('win-message');
        } else {
            gameStatus.textContent = `Player ${currentPlayer}'s turn`;
            gameStatus.classList.remove('win-message');
        }
    }
    
    // Celebrate win with confetti
    function celebrateWin() {
        const gameContainer = document.querySelector('.game-container');
        const colors = ['#f44336', '#2196F3', '#ffeb3b', '#4CAF50', '#9C27B0', '#FF9800'];
        
        for (let i = 0; i < 100; i++) {
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
    
    // Reset game (just the current round)
    function resetGame() {
        // Remove winning styles
        document.querySelectorAll('.winning-cell').forEach(cell => {
            cell.classList.remove('winning-cell');
        });
        
        // Remove winning line
        const winningLine = document.querySelector('.winning-line');
        if (winningLine) {
            winningLine.remove();
        }
        
        // Remove confetti
        document.querySelectorAll('.confetti').forEach(confetti => {
            confetti.remove();
        });
        
        // Initialize a new game
        initGame();
    }
    
    // New match (reset scores and game)
    function newMatch() {
        scores = { X: 0, O: 0 };
        lastWinner = null;
        currentPlayer = PLAYER_X;
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
    
    // Initialize the game when the page loads
    initGame();
});