// scripts/nav.js
// Navigation Bar Script
document.addEventListener('DOMContentLoaded', function() {
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Set the active class based on current page
    if (currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
        document.getElementById('home-btn').classList.add('active');
    } else if (currentPath.includes('connect4.html')) {
        document.getElementById('connect4-btn').classList.add('active');
    } else if (currentPath.includes('tictactoe.html')) {
        document.getElementById('tictactoe-btn').classList.add('active');
    } else if (currentPath.includes('memorysequence.html')) {
        document.getElementById('memory-btn').classList.add('active');
    } else if (currentPath.includes('guessplayer.html')) {
        document.getElementById('guessplayer-btn').classList.add('active');
    }

    // Fix relative paths for home page vs game pages
    const isHomePage = currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/');
    
    if (isHomePage) {
        // If we're on the home page, adjust the links
        document.getElementById('home-btn').href = 'index.html';
        document.getElementById('connect4-btn').href = 'games/connect4.html';
        document.getElementById('tictactoe-btn').href = 'games/tictactoe.html';
        document.getElementById('memory-btn').href = 'games/memorysequence.html';
        document.getElementById('guessplayer-btn').href = 'games/guessplayer.html';
    }
});
