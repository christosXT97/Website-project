document.addEventListener('DOMContentLoaded', () => {
    // Detect how many levels deep the current page is
    const depth = window.location.pathname.split('/').filter(part => part).length;

    // If we're in root (index.html), use 'components/'
    // If we're inside 'games/' or any other folder, use '../components/'
    const basePath = depth <= 1 ? 'components/' : '../components/';

    // Load navbar
    fetch(`${basePath}navbar.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
            highlightCurrentPage(); // Only after navbar is injected
        })
        .catch(error => console.error("Failed to load navbar:", error));

    // Load footer
    fetch(`${basePath}footer.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error("Failed to load footer:", error));
});


function highlightCurrentPage() {
    const path = window.location.pathname;

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        document.getElementById('home-btn')?.classList.add('active');
    } else if (path.includes('connect4.html')) {
        document.getElementById('connect4-btn')?.classList.add('active');
    } else if (path.includes('tictactoe.html')) {
        document.getElementById('tictactoe-btn')?.classList.add('active');
    } else if (path.includes('minesweeper.html')) {
        document.getElementById('minesweeper-btn')?.classList.add('active');
    } else if (path.includes('memorysequence.html')) {
        document.getElementById('memory-btn')?.classList.add('active');
    }
}
