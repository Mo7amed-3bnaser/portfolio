// Make all images visible immediately
document.addEventListener('DOMContentLoaded', function() {
    // Select all images
    const images = document.querySelectorAll('img');
    
    // Make all images visible immediately
    images.forEach(img => {
        img.style.opacity = '1';
        img.classList.add('loaded');
    });
    
    // Still use IntersectionObserver to add loaded class when images come into view
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Defer non-critical CSS
function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

// Load critical CSS inline and defer non-critical CSS
document.addEventListener('DOMContentLoaded', function() {
    // Load CSS immediately instead of delaying
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    loadCSS('https://unpkg.com/aos@2.3.1/dist/aos.css');
    
    // Add CSS for fade-in effect
    const style = document.createElement('style');
    style.textContent = `
        img.loaded {
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});