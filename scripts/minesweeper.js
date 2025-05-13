document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('minesweeper-board');
  const status = document.getElementById('minesweeper-status');
  const resetBtn = document.getElementById('reset-minesweeper');
  const minesCountDisplay = document.getElementById('mines-count');
  const difficultySelect = document.getElementById('difficulty');

  // Difficulty settings object
  const difficulties = {
    easy:  { size: 8,  mines: 10 },
    normal:{ size: 10, mines: 20 },
    hard:  { size: 12, mines: 40 }
  };

  let minePositions = [];
  let cells = [];
  let gridSize = 10; // Default
  let mineCount = 20; // Default

  // Generate mine positions based on current difficulty
  function generateMines() {
    const positions = new Set();
    while (positions.size < mineCount) {
      positions.add(Math.floor(Math.random() * gridSize * gridSize));
    }
    return [...positions];
  }

  // Count mines surrounding a given cell
  function countMinesAround(index) {
    const directions = [-1, 1, -gridSize, gridSize, -gridSize - 1, -gridSize + 1, gridSize - 1, gridSize + 1];
    return directions.reduce((count, dir) => {
      const neighbor = index + dir;
      // Check boundaries: Avoid wrapping on left/right
      if (
        neighbor >= 0 &&
        neighbor < gridSize * gridSize &&
        !(index % gridSize === 0 && dir === -1) &&
        !((index + 1) % gridSize === 0 && dir === 1)
      ) {
        if (minePositions.includes(neighbor)) count++;
      }
      return count;
    }, 0);
  }

  // Reveal cell content
  function reveal(index) {
    const cell = cells[index];
    if (cell.classList.contains('revealed') || cell.classList.contains('flag')) return;

    cell.classList.add('revealed');

    if (minePositions.includes(index)) {
      cell.classList.add('mine');
      cell.textContent = '💣';
      gameOver(false);
    } else {
      const minesAround = countMinesAround(index);
      if (minesAround > 0) {
        cell.textContent = minesAround;
      } else {
        // If no nearby mines, reveal neighbors recursively
        const directions = [-1, 1, -gridSize, gridSize, -gridSize - 1, -gridSize + 1, gridSize - 1, gridSize + 1];
        directions.forEach(dir => {
          const neighbor = index + dir;
          if (
            neighbor >= 0 &&
            neighbor < gridSize * gridSize &&
            !(index % gridSize === 0 && dir === -1) &&
            !((index + 1) % gridSize === 0 && dir === 1)
          ) {
            reveal(neighbor);
          }
        });
      }
      checkWin();
    }
  }

  // Toggle flag on right-click or long press
  function toggleFlag(index, e) {
    e.preventDefault();
    const cell = cells[index];
    if (!cell.classList.contains('revealed')) {
      cell.classList.toggle('flag');
      cell.textContent = cell.classList.contains('flag') ? '🚩' : '';
    }
  }

  // Check if all non-mine cells have been revealed
  function checkWin() {
    const revealed = cells.filter(c => c.classList.contains('revealed')).length;
    if (revealed === gridSize * gridSize - mineCount) {
      gameOver(true);
    }
  }

  // End the game: win or lose
  function gameOver(win) {
    status.textContent = win ? '🎉 You Win!' : '💥 Game Over!';
    cells.forEach((cell, i) => {
      if (minePositions.includes(i)) {
        if (!cell.classList.contains('revealed')) {
          cell.classList.add('mine');
          cell.textContent = '💣';
        }
      }
      cell.style.pointerEvents = 'none';
    });
  }

  // Create and render the game board based on selected difficulty
  function createBoard() {
    // Read selected difficulty
    const difficulty = difficultySelect.value;
    gridSize = difficulties[difficulty].size;
    mineCount = difficulties[difficulty].mines;

    board.innerHTML = '';
    status.textContent = '';
    cells = [];
    minePositions = generateMines();
    minesCountDisplay.textContent = `💣 Mines: ${mineCount}`;

    // Adjust grid columns based on gridSize
    board.style.gridTemplateColumns = `repeat(${gridSize}, 35px)`;

    // Create cells
    for (let i = 0; i < gridSize * gridSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.addEventListener('click', () => reveal(i));
      cell.addEventListener('contextmenu', (e) => toggleFlag(i, e));
      board.appendChild(cell);
      cells.push(cell);
    }
  }

  // Listen for reset button and difficulty change to (re)create the board
  resetBtn.addEventListener('click', createBoard);
  difficultySelect.addEventListener('change', createBoard);

  createBoard(); // Initial load
});
