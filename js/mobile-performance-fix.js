/**
 * Mobile Performance Optimization Script
 * This script focuses on improving mobile performance without affecting desktop experience
 * or hiding images. It addresses the LCP (Largest Contentful Paint) issues.
 */

// Execute immediately for fastest possible optimization
(function() {
    // Only apply optimizations on mobile devices
    if (window.innerWidth < 768) {
        // Add preconnect for critical domains
        const domains = [
            'https://cdnjs.cloudflare.com',
            'https://cdn.jsdelivr.net',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://unpkg.com'
        ];
        
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            if (domain.includes('gstatic')) {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
        
        // Optimize render-blocking resources
        // Add critical CSS inline to avoid render blocking
        const criticalCSS = document.createElement('style');
        criticalCSS.textContent = `
            /* Critical mobile styles */
            .btn.btn-primary {
                transform: translateZ(0);
                will-change: transform;
                contain: layout style paint;
                box-shadow: none !important;
                transition: transform 0.2s ease-out !important;
            }
            
            /* Optimize hero section which is likely part of LCP */
            .hero-content h1, .hero-content p {
                will-change: transform;
                contain: layout style;
            }
            
            /* Reduce animation complexity */
            [data-aos] {
                opacity: 1 !important;
                transform: none !important;
                transition: none !important;
            }
            
            /* Optimize particles for better performance */
            #particles-js {
                opacity: 0.3;
            }
        `;
        document.head.appendChild(criticalCSS);
        
        // Defer non-critical CSS
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        stylesheets.forEach(sheet => {
            // Skip already optimized sheets
            if (sheet.hasAttribute('media') && sheet.getAttribute('media') !== 'all') {
                return;
            }
            
            // Don't defer critical stylesheets
            if (sheet.href.includes('bootstrap.min.css') || 
                sheet.href.includes('style.css') || 
                sheet.href.includes('mobile-optimize.css')) {
                return;
            }
            
            // Defer non-critical CSS
            sheet.setAttribute('media', 'print');
            sheet.setAttribute('onload', "this.media='all'");
        });
    }
})();

// When DOM is interactive, apply additional optimizations
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth < 768) {
        // Optimize the VIEW MY WORK button (main LCP element)
        const viewWorkButton = document.querySelector('.btn.btn-primary');
        if (viewWorkButton) {
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
        
        // Optimize images without hiding them
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            // Force immediate visibility for images
            img.classList.add('loaded');
            img.style.opacity = '1';
            
            // Add loading="lazy" for images below the fold
            if (!isInViewport(img)) {
                img.loading = 'lazy';
            }
        });
        
        // Reduce JavaScript execution time
        if (window.AOS) {
            // Disable AOS animations on mobile
            AOS.init({
                disable: true
            });
        }
        
        // Optimize particles.js if it exists
        if (window.particlesJS) {
            const particlesContainer = document.getElementById('particles-js');
            if (particlesContainer) {
                // Reduce particles complexity
                particlesJS('particles-js', {
                    particles: {
                        number: {
                            value: 20,
                            density: {
                                enable: true,
                                value_area: 1200
                            }
                        },
                        opacity: {
                            value: 0.3,
                            random: false,
                            anim: {
                                enable: false
                            }
                        },
                        size: {
                            value: 3,
                            random: true,
                            anim: {
                                enable: false
                            }
                        },
                        move: {
                            enable: true,
                            speed: 1,
                            random: false,
                            straight: false,
                            out_mode: "out",
                            bounce: false
                        }
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: {
                                enable: false
                            },
                            onclick: {
                                enable: false
                            },
                            resize: true
                        }
                    },
                    retina_detect: false
                });
            }
        }
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