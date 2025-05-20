document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('minesweeper-board');
  const status = document.getElementById('minesweeper-status');
  const resetBtn = document.getElementById('reset-minesweeper');
  const minesCountDisplay = document.getElementById('mines-count');
  const difficultySelect = document.getElementById('difficulty');

  const difficulties = {
    easy:  { size: 8,  mines: 10 },
    normal:{ size: 10, mines: 20 },
    hard:  { size: 12, mines: 40 }
  };

  let minePositions = [];
  let cells = [];
  let gridSize = 10; // Default
  let mineCount = 20; // Default
  let firstClick = true;

  function generateMines(excludeIndex) {
    const positions = new Set();
    const excludeSet = new Set([excludeIndex]);

    // Exclude neighboring cells for safer starting area
    const directions = [-1, 1, -gridSize, gridSize, -gridSize - 1, -gridSize + 1, gridSize - 1, gridSize + 1];
    directions.forEach(dir => {
      const neighbor = excludeIndex + dir;
      if (
        neighbor >= 0 &&
        neighbor < gridSize * gridSize &&
        !(excludeIndex % gridSize === 0 && dir === -1) &&
        !((excludeIndex + 1) % gridSize === 0 && dir === 1)
      ) {
        excludeSet.add(neighbor);
      }
    });

    while (positions.size < mineCount) {
      const rand = Math.floor(Math.random() * gridSize * gridSize);
      if (!excludeSet.has(rand)) {
        positions.add(rand);
      }
    }

    return [...positions];
  }

  function countMinesAround(index) {
    const directions = [-1, 1, -gridSize, gridSize, -gridSize - 1, -gridSize + 1, gridSize - 1, gridSize + 1];
    return directions.reduce((count, dir) => {
      const neighbor = index + dir;
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

  function reveal(index) {
    const cell = cells[index];
    if (cell.classList.contains('revealed') || cell.classList.contains('flag')) return;

    if (firstClick) {
      minePositions = generateMines(index);
      firstClick = false;
    }

    cell.classList.add('revealed');

    if (minePositions.includes(index)) {
      cell.classList.add('mine');
      cell.textContent = '💣';
      gameOver(false);
    } else {
      const minesAround = countMinesAround(index);
      if (minesAround > 0) {
        cell.textContent = minesAround;
        cell.setAttribute('data-value', minesAround);
      } else {
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

  function toggleFlag(index, e) {
    e.preventDefault();
    const cell = cells[index];
    if (!cell.classList.contains('revealed')) {
      cell.classList.toggle('flag');
      cell.textContent = cell.classList.contains('flag') ? '🚩' : '';
    }
  }

  function checkWin() {
    const revealed = cells.filter(c => c.classList.contains('revealed')).length;
    if (revealed === gridSize * gridSize - mineCount) {
      gameOver(true);
    }
  }

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

  function createBoard() {
    const difficulty = difficultySelect.value;
    gridSize = difficulties[difficulty].size;
    mineCount = difficulties[difficulty].mines;

    board.innerHTML = '';
    status.textContent = '';
    cells = [];
    minePositions = [];
    firstClick = true;
    minesCountDisplay.textContent = `💣 Mines: ${mineCount}`;
    board.style.gridTemplateColumns = `repeat(${gridSize}, 35px)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.addEventListener('click', () => reveal(i));
      cell.addEventListener('contextmenu', (e) => toggleFlag(i, e));
      board.appendChild(cell);
      cells.push(cell);
    }
  }

  resetBtn.addEventListener('click', createBoard);
  difficultySelect.addEventListener('change', createBoard);

  createBoard(); // Initial load
});
