// Optimize mobile performance
document.addEventListener("DOMContentLoaded", function() {
    // Detect if mobile device
    const isMobile = window.innerWidth < 768;
    
    // Select all images
    const allImages = document.querySelectorAll("img");
    
    // Force critical images to be visible immediately
    allImages.forEach(function(image) {
        // Add loaded class to all images immediately
        image.classList.add("loaded");
        
        // Make sure image is visible
        image.style.opacity = "1";
    });
    
    // Optimize the VIEW MY WORK button (which is causing LCP issues)
    const viewWorkButton = document.querySelector('.btn.btn-primary');
    if (viewWorkButton) {
        // Add will-change property for better rendering performance
        viewWorkButton.style.willChange = "transform";
        // Reduce animation complexity on mobile
        if (isMobile) {
            viewWorkButton.style.transition = "transform 0.2s ease-out";
        }
    }
    
    // Use more efficient intersection observer for mobile
    if ("IntersectionObserver" in window) {
        const observerOptions = {
            rootMargin: isMobile ? "300px" : "0px",
            threshold: isMobile ? 0 : 0.1
        };
        
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.classList.add("loaded");
                    imageObserver.unobserve(image);
                }
            });
        }, observerOptions);
        
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
    // Detect if mobile device
    const isMobile = window.innerWidth < 768;
    
    // Optimize for mobile - load CSS with priority hints
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    if (isMobile) {
        fontAwesomeLink.setAttribute('importance', 'low');
    }
    document.head.appendChild(fontAwesomeLink);
    
    // Load AOS with lower priority on mobile
    const aosLink = document.createElement('link');
    aosLink.rel = 'stylesheet';
    aosLink.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
    if (isMobile) {
        aosLink.setAttribute('importance', 'low');
    }
    document.head.appendChild(aosLink);
    
    // Add optimized CSS for mobile
    const style = document.createElement('style');
    style.textContent = `
        img.loaded {
            animation: ${isMobile ? 'none' : 'fadeIn 0.5s ease-in-out'};
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        /* Optimize the VIEW MY WORK button for mobile */
        .btn.btn-primary {
            ${isMobile ? 'contain: paint;' : ''}
            ${isMobile ? 'will-change: transform;' : ''}
            ${isMobile ? 'transform: translateZ(0);' : ''}
        }
    `;
    document.head.appendChild(style);
    
    // Reduce animation complexity on mobile
    if (isMobile) {
        // Disable or simplify AOS animations on mobile
        if (window.AOS) {
            AOS.init({
                disable: true,
                once: true
            });
        }
    }
});