//scripts/memorysequence.js
// Memory Sequence Game Logic
document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const cells = document.querySelectorAll('.cell');
    const gameStatus = document.getElementById('game-status');
    const currentLevelDisplay = document.getElementById('current-level');
    const highScoreDisplay = document.getElementById('high-score');
    const startButton = document.getElementById('start-game');
    const resetButton = document.getElementById('reset-game');

    // Game configuration
    const HIGHLIGHT_DURATION = 600; // ms
    const DELAY_BETWEEN_HIGHLIGHTS = 300; // ms
    const CELL_COUNT = 9;
    
    // Game state
    let sequence = [];
    let playerSequence = [];
    let currentLevel = 1;
    let isPlayingSequence = false;
    let playerTurn = false;
    let highScore = localStorage.getItem('memorySequenceHighScore') || 0;
    
    // Set the high score
    highScoreDisplay.textContent = highScore;
    
    // Initialize the game
    function initGame() {
        sequence = [];
        playerSequence = [];
        currentLevel = 1;
        isPlayingSequence = false;
        playerTurn = false;
        
        cells.forEach(cell => {
            cell.classList.remove('highlighted', 'player-click', 'correct', 'wrong');
        });
        
        currentLevelDisplay.textContent = currentLevel;
        gameStatus.textContent = 'Watch the sequence...';
        gameStatus.classList.remove('level-complete');
        
        startButton.disabled = false;
        resetButton.disabled = true;
    }
    
    // Start the game
    function startGame() {
        startButton.disabled = true;
        resetButton.disabled = false;
        
        // Generate a new sequence (add one more step for each level)
        addToSequence();
        
        // Play the sequence after a short delay
        setTimeout(() => {
            playSequence();
        }, 1000);
    }
    
    // Add a new step to the sequence
    function addToSequence() {
        const newStep = Math.floor(Math.random() * CELL_COUNT);
        sequence.push(newStep);
    }
    
    // Play the current sequence
    function playSequence() {
        isPlayingSequence = true;
        playerTurn = false;
        gameStatus.textContent = 'Watch carefully...';
        
        cells.forEach(cell => {
            cell.classList.remove('highlighted', 'player-click', 'correct', 'wrong');
            cell.style.pointerEvents = 'none'; // Disable cell clicks during sequence
        });
        
        let step = 0;
        
        // Play the sequence with delay between each highlight
        const sequenceInterval = setInterval(() => {
            if (step < sequence.length) {
                const cellIndex = sequence[step];
                highlightCell(cellIndex);
                step++;
            } else {
                clearInterval(sequenceInterval);
                setTimeout(() => {
                    isPlayingSequence = false;
                    playerTurn = true;
                    playerSequence = [];
                    gameStatus.textContent = 'Your turn! Repeat the sequence';
                    
                    cells.forEach(cell => {
                        cell.style.pointerEvents = 'auto'; // Enable cell clicks
                    });
                }, HIGHLIGHT_DURATION + 200);
            }
        }, HIGHLIGHT_DURATION + DELAY_BETWEEN_HIGHLIGHTS);
    }
    
    // Highlight a specific cell
    function highlightCell(index) {
        const cell = cells[index];
        cell.classList.add('highlighted');
        
        // Play sound
        playSound('highlight');
        
        // Remove highlight after duration
        setTimeout(() => {
            cell.classList.remove('highlighted');
        }, HIGHLIGHT_DURATION);
    }
    
    // Handle cell click
    function handleCellClick(event) {
        if (!playerTurn || isPlayingSequence) return;
        
        const clickedCell = event.target;
        const cellIndex = parseInt(clickedCell.dataset.cellIndex);
        
        // Visual feedback for click
        clickedCell.classList.add('player-click');
        playSound('click');
        
        setTimeout(() => {
            clickedCell.classList.remove('player-click');
        }, 300);
        
        // Add to player sequence
        playerSequence.push(cellIndex);
        
        // Check if the step is correct
        const currentStep = playerSequence.length - 1;
        if (playerSequence[currentStep] === sequence[currentStep]) {
            // Correct step
            clickedCell.classList.add('correct');
            setTimeout(() => {
                clickedCell.classList.remove('correct');
            }, 300);
            
            // Check if the sequence is complete
            if (playerSequence.length === sequence.length) {
                // Level complete
                playerTurn = false;
                gameStatus.textContent = 'Level Complete!';
                gameStatus.classList.add('level-complete');
                playSound('success');
                
                setTimeout(() => {
                    gameStatus.classList.remove('level-complete');
                    // Move to the next level
                    currentLevel++;
                    currentLevelDisplay.textContent = currentLevel;
                    
                    // Update high score if needed
                    if (currentLevel - 1 > highScore) {
                        highScore = currentLevel - 1;
                        highScoreDisplay.textContent = highScore;
                        localStorage.setItem('memorySequenceHighScore', highScore);
                    }
                    
                    // Add new step to sequence and play again
                    addToSequence();
                    setTimeout(() => {
                        playSequence();
                    }, 1000);
                }, 1500);
            }
        } else {
            // Wrong step - game over
            clickedCell.classList.add('wrong');
            cells.forEach(cell => {
                cell.style.pointerEvents = 'none'; // Disable further clicks
            });
            
            gameStatus.textContent = `Game Over! You reached level ${currentLevel}`;
            playSound('error');
            
            // Update high score if needed
            if (currentLevel > highScore) {
                highScore = currentLevel;
                highScoreDisplay.textContent = highScore;
                localStorage.setItem('memorySequenceHighScore', highScore);
            }
            
            resetButton.disabled = false;
            startButton.disabled = true;
        }
    }
    
    // Play sound effects
    function playSound(type) {
        let sound;
        
        switch(type) {
            case 'highlight':
                sound = new Audio('../assets/sounds/highlight.mp3');
                sound.volume = 0.6;
                break;
            case 'click':
                sound = new Audio('../assets/sounds/click.mp3');
                sound.volume = 0.5;
                break;
            case 'success':
                sound = new Audio('../assets/sounds/success.mp3');
                sound.volume = 0.7;
                break;
            case 'error':
                sound = new Audio('../assets/sounds/error.mp3');
                sound.volume = 0.6;
                break;
            default:
                return;
        }
        
        // Fallback if audio files don't exist
        sound.onerror = () => { /* Silent fail */ };
        sound.play().catch(() => { /* Silent fail */ });
    }
    
    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', initGame);
    
    // Initialize the game when the page loads
    initGame();
});