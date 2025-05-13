//scripts/main.js
// Main Website JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log('Mini Games Hub is loaded and ready!');
    
    // Preloader functionality
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled-header');
            } else {
                header.classList.remove('scrolled-header');
            }
        });
    }
    
    // Scroll to top button
    const scrollTopButton = document.getElementById('scroll-top');
    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopButton.classList.add('visible');
            } else {
                scrollTopButton.classList.remove('visible');
            }
        });
        
        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Dark mode toggle functionality
    const createDarkModeToggle = () => {
        // Create the toggle button element
        const darkModeToggle = document.createElement('button');
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.setAttribute('aria-label', 'Toggle Dark Mode');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        
        // Check for saved user preference or system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        // Apply the theme based on preference
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Toggle dark mode on click
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
        
        // Add button to the DOM
        document.body.appendChild(darkModeToggle);
    };
    
    // Add dark mode toggle button
    createDarkModeToggle();
    
    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                // Simulating form submission
                const submitButton = this.querySelector('button[type="submit"]');
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
                submitButton.disabled = true;
                
                // Simulate API call delay
                setTimeout(() => {
                    this.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i> Thanks for subscribing!</div>';
                }, 1500);
            }
        });
    }
    
    // Add animation to elements when they come into view
    const observeElements = () => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        const elements = document.querySelectorAll('.feature-card, .game-card, .section-title, .newsletter');
        elements.forEach(element => {
            element.classList.add('animate-element');
            observer.observe(element);
        });
    };
    
    // Initialize animations
    observeElements();
    
    // Enhanced game card hover effects
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const cardImage = card.querySelector('img');
            if (cardImage && !card.classList.contains('coming-soon')) {
                cardImage.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const cardImage = card.querySelector('img');
            if (cardImage) {
                cardImage.style.transform = 'scale(1)';
            }
        });
    });
    
    // Disable clicking on 'Coming Soon' buttons
    document.querySelectorAll('a.disabled').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            
            // Create tooltip to inform user
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = 'Coming soon!';
            
            document.body.appendChild(tooltip);
            
            // Position the tooltip near the cursor
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
            
            // Remove tooltip after a delay
            setTimeout(() => {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    tooltip.remove();
                }, 300);
            }, 1500);
        });
    });
    
    // Update copyright year automatically
    const yearSpan = document.createElement('span');
    yearSpan.textContent = new Date().getFullYear();
    const copyrightText = document.querySelector('footer .footer-bottom p');
    if (copyrightText) {
        copyrightText.innerHTML = copyrightText.innerHTML.replace('2025', yearSpan.textContent);
    }

    // Add parallax effect to hero section
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            heroImage.style.transform = `perspective(1000px) rotateY(${x * 5 - 2.5}deg) rotateX(${y * -5 + 2.5}deg)`;
        });
    }

    // Add tooltip style
    const style = document.createElement('style');
    style.textContent = `
        .tooltip {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        
        .hero-image img {
            animation: float 6s ease-in-out infinite;
        }
        
        .animate-element {
            transition-delay: calc(var(--index, 0) * 0.1s);
        }
    `;
    document.head.appendChild(style);

    // Add animation delay to cards to create a cascade effect
    const animatedElements = document.querySelectorAll('.animate-element');
    animatedElements.forEach((el, index) => {
        el.style.setProperty('--index', index % 4);
    });

    // Add game card tilt effect
    const addTiltEffect = () => {
        const cards = document.querySelectorAll('.game-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                
                const dx = x - xc;
                const dy = y - yc;
                
                card.style.transform = `perspective(1000px) rotateY(${dx / 20}deg) rotateX(${-dy / 20}deg) translateY(-10px) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0) scale(1)';
            });
        });
    };
    
    // Initialize tilt effect on larger screens
    if (window.innerWidth > 768) {
        addTiltEffect();
    }
    
    // Handle window resize for responsive features
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            addTiltEffect();
        }
    });
});

// Function to use components, so theres no need to write navbar or footer more than once
function includeHTML(selector, file) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then(data => {
      document.querySelector(selector).innerHTML = data;
    })
    .catch(err => console.error('Error loading component:', err));
}
