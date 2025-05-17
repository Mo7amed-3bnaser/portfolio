// Make all images visible immediately
document.addEventListener("DOMContentLoaded", function() {
    // Select all images
    const allImages = document.querySelectorAll("img");
    
    // Force all images to be visible
    allImages.forEach(function(image) {
        // Add loaded class to all images immediately
        image.classList.add("loaded");
        
        // Make sure image is visible
        image.style.opacity = "1";
    });
    
    // Simple observer just for animation when images come into view
    if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.classList.add("loaded");
                    imageObserver.unobserve(image);
                }
            });
        });
        
        allImages.forEach(function(image) {
            imageObserver.observe(image);
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