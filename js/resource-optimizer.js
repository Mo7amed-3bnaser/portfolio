/**
 * Resource Optimizer Script
 * This script focuses on eliminating render-blocking resources and optimizing CSS/JS loading
 * specifically for mobile devices without affecting desktop experience or hiding images.
 */

// Execute immediately for fastest possible optimization
(function() {
    // Only apply optimizations on mobile devices
    if (window.innerWidth < 768) {
        // Handle render-blocking resources
        
        // 1. Optimize CSS loading
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        stylesheets.forEach(sheet => {
            // Skip already optimized sheets
            if (sheet.hasAttribute('media') && sheet.getAttribute('media') !== 'all') {
                return;
            }
            
            // Don't defer critical stylesheets
            if (sheet.href && (
                sheet.href.includes('bootstrap.min.css') || 
                sheet.href.includes('style.css') || 
                sheet.href.includes('mobile-optimize.css') ||
                sheet.href.includes('mobile-performance-fix.css')
            )) {
                // Add importance attribute for prioritization
                sheet.setAttribute('importance', 'high');
                return;
            }
            
            // Defer non-critical CSS
            if (sheet.href && (
                sheet.href.includes('font-awesome') ||
                sheet.href.includes('aos') ||
                sheet.href.includes('form.css')
            )) {
                sheet.setAttribute('media', 'print');
                sheet.setAttribute('onload', "this.media='all'");
                sheet.setAttribute('importance', 'low');
            }
        });
        
        // 2. Optimize JavaScript loading
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            // Don't modify our optimization scripts
            if (script.src && (
                script.src.includes('mobile-optimize') ||
                script.src.includes('mobile-performance-fix') ||
                script.src.includes('resource-optimizer')
            )) {
                return;
            }
            
            // Add defer to all other scripts
            if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
                script.setAttribute('defer', '');
            }
            
            // Add low importance to non-critical scripts
            if (script.src && (
                script.src.includes('particles.js') ||
                script.src.includes('jquery') ||
                script.src.includes('bootstrap.bundle')
            )) {
                script.setAttribute('importance', 'low');
            }
        });
        
        // 3. Add inline critical CSS for the most important elements
        const criticalInlineCSS = document.createElement('style');
        criticalInlineCSS.textContent = `
            /* Critical styles for LCP elements */
            .btn.btn-primary {
                transform: translateZ(0);
                will-change: transform;
                contain: layout style paint;
                box-shadow: none !important;
                transition: transform 0.2s ease-out !important;
                display: inline-block;
                font-weight: 500;
                text-align: center;
                vertical-align: middle;
                user-select: none;
                padding: .375rem .75rem;
                font-size: 1rem;
                line-height: 1.5;
                border-radius: .25rem;
            }
            
            /* Hero section critical styles */
            .hero-content h1 {
                font-weight: 700;
                margin-bottom: 1rem;
                will-change: transform;
                contain: layout style;
            }
            
            /* Force immediate visibility for images in viewport */
            .hero-content img {
                opacity: 1 !important;
            }
        `;
        document.head.insertBefore(criticalInlineCSS, document.head.firstChild);
    }
})();

// When DOM is interactive, apply additional optimizations
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth < 768) {
        // Optimize jQuery usage if it exists
        if (window.jQuery) {
            // Reduce jQuery animations duration
            jQuery.fx.speeds.normal = 200; // Default is 400
        }
        
        // Optimize Bootstrap if it exists
        if (window.bootstrap) {
            // Disable transitions on mobile
            const style = document.createElement('style');
            style.textContent = `
                .modal.fade {
                    transition: none !important;
                }
                .collapse {
                    transition: none !important;
                }
                .collapsing {
                    transition: none !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Lazy load images that are below the fold
        const lazyImages = document.querySelectorAll('img:not([loading])');
        lazyImages.forEach(img => {
            if (!isInViewport(img)) {
                img.loading = 'lazy';
            }
        });
    }
    
    // Helper function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
});