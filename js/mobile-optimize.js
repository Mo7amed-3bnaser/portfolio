/**
 * Mobile Performance Optimization Script
 * This script specifically targets the VIEW MY WORK button that's causing LCP issues
 */

// Execute as early as possible
(function() {
    // Check if we're on mobile
    if (window.innerWidth < 768) {
        // Create and add a style element for immediate button optimization
        const style = document.createElement('style');
        style.textContent = `
            /* Immediate optimization for the VIEW MY WORK button */
            .btn.btn-primary {
                transform: translateZ(0);
                will-change: transform;
                contain: layout style paint;
                box-shadow: none !important;
            }
        `;
        document.head.appendChild(style);
        
        // Pre-connect to critical domains
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = 'https://cdnjs.cloudflare.com';
        document.head.appendChild(preconnect);
    }
})();

// When DOM is interactive, further optimize the button
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth < 768) {
        // Get the VIEW MY WORK button
        const viewWorkButton = document.querySelector('.btn.btn-primary');
        if (viewWorkButton) {
            // Apply direct style optimizations
            viewWorkButton.style.willChange = 'transform';
            viewWorkButton.style.transform = 'translateZ(0)';
            viewWorkButton.style.contain = 'layout style paint';
            viewWorkButton.style.boxShadow = 'none';
            
            // Simplify hover effects on mobile
            viewWorkButton.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98) translateZ(0)';
            });
            
            viewWorkButton.addEventListener('touchend', function() {
                this.style.transform = 'translateZ(0)';
            });
        }
        
        // Reduce animation complexity
        if (window.AOS) {
            // Disable AOS animations on mobile
            AOS.init({
                disable: true
            });
        }
    }
});