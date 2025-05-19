// scripts/nav.js
// Navigation Bar Script
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.getAttribute('href') === 'index.html' || btn.getAttribute('href') === '../index.html') {
                btn.classList.add('active');
            }
        });
    } else if (currentPath.includes('connect4.html')) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.getAttribute('href') === 'connect4.html' || btn.getAttribute('href') === 'games/connect4.html') {
                btn.classList.add('active');
            }
        });
    } else if (currentPath.includes('tictactoe.html')) {
        document.getElementById('tictactoe-btn')?.classList.add('active');
    } else if (currentPath.includes('memorysequence.html')) {
        document.getElementById('memory-btn')?.classList.add('active');
    } else if (currentPath.includes('guessthefootballplayer.html')) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.getAttribute('href') === 'guessthefootballplayer.html' || btn.getAttribute('href') === 'games/guessthefootballplayer.html') {
                btn.classList.add('active');
            }
        });
    } else if (currentPath.includes('minesweeper.html')) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.getAttribute('href') === 'minesweeper.html' || btn.getAttribute('href') === 'games/minesweeper.html') {
                btn.classList.add('active');
            }
        });
    }

    // Fix relative paths for home page vs game pages
    const isHomePage = currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/');
    
    if (isHomePage) {
        // Adjust the links for home page context
        document.querySelectorAll('.nav-btn').forEach(btn => {
            switch (btn.getAttribute('href')) {
                case 'index.html':
                case '../index.html':
                    btn.href = 'index.html';
                    break;
                case 'connect4.html':
                case 'games/connect4.html':
                    btn.href = 'games/connect4.html';
                    break;
                case 'tictactoe.html':
                case '../games/tictactoe.html':
                    btn.href = 'games/tictactoe.html';
                    break;
                case 'memorysequence.html':
                case '../games/memorysequence.html':
                    btn.href = 'games/memorysequence.html';
                    break;
                case 'guessthefootballplayer.html':
                case '../games/guessthefootballplayer.html':
                    btn.href = 'games/guessthefootballplayer.html';
                    break;
                case 'minesweeper.html':
                case '../games/minesweeper.html':
                    btn.href = 'games/minesweeper.html';
                    break;
            }
        });
        if (document.getElementById('tictactoe-btn')) document.getElementById('tictactoe-btn').href = 'games/tictactoe.html';
        if (document.getElementById('memory-btn')) document.getElementById('memory-btn').href = 'games/memorysequence.html';
    } else {
        // Adjust the links for game pages context
        document.querySelectorAll('.nav-btn').forEach(btn => {
            switch (btn.getAttribute('href')) {
                case 'index.html':
                case '../index.html':
                    btn.href = '../index.html';
                    break;
                case 'connect4.html':
                case 'games/connect4.html':
                    btn.href = 'connect4.html';
                    break;
                case 'tictactoe.html':
                case '../games/tictactoe.html':
                    btn.href = 'tictactoe.html';
                    break;
                case 'memorysequence.html':
                case '../games/memorysequence.html':
                    btn.href = 'memorysequence.html';
                    break;
                case 'guessthefootballplayer.html':
                case '../games/guessthefootballplayer.html':
                    btn.href = 'guessthefootballplayer.html';
                    break;
                case 'minesweeper.html':
                case '../games/minesweeper.html':
                    btn.href = 'minesweeper.html';
                    break;
            }
        });
        if (document.getElementById('tictactoe-btn')) document.getElementById('tictactoe-btn').href = 'tictactoe.html';
        if (document.getElementById('memory-btn')) document.getElementById('memory-btn').href = 'memorysequence.html';
    }
});