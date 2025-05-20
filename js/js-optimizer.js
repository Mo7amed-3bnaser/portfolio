/**
 * JavaScript Optimizer for Mobile
 * This script optimizes JavaScript loading and execution for mobile devices
 * without affecting desktop experience
 */

// Execute immediately for fastest possible optimization
(function() {
    // Only apply optimizations on mobile devices
    if (window.innerWidth < 768) {
        // 1. Optimize script loading
        optimizeScriptLoading();
        
        // 2. Add event listener for when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', optimizeAfterDOMReady);
        } else {
            optimizeAfterDOMReady();
        }
    }
    
    // Function to optimize script loading
    function optimizeScriptLoading() {
        // Find all script tags
        const scripts = document.querySelectorAll('script[src]');
        
        scripts.forEach(script => {
            // Skip our optimization scripts
            if (script.src.includes('optimizer') || 
                script.src.includes('mobile-performance') || 
                script.src.includes('progressive-image')) {
                return;
            }
            
            // Add defer to scripts that don't have it
            if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
                script.setAttribute('defer', '');
            }
            
            // Set low importance for non-critical scripts
            if (script.src.includes('particles.js') || 
                script.src.includes('bootstrap.bundle') || 
                script.src.includes('jquery')) {
                script.setAttribute('importance', 'low');
            }
        });
        
        // Preload critical scripts
        const criticalScripts = [
            'https://unpkg.com/typed.js@2.0.16/dist/typed.umd.js'
        ];
        
        criticalScripts.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    // Function to optimize after DOM is ready
    function optimizeAfterDOMReady() {
        // 1. Reduce animation complexity
        reduceAnimationComplexity();
        
        // 2. Optimize event listeners
        optimizeEventListeners();
        
        // 3. Optimize third-party libraries
        optimizeLibraries();
        
        // 4. Implement code splitting for mobile
        implementCodeSplitting();
    }
    
    // Function to reduce animation complexity
    function reduceAnimationComplexity() {
        // Disable or simplify animations
        if (window.jQuery) {
            // Reduce jQuery animation duration
            jQuery.fx.speeds.normal = 200; // Default is 400
            jQuery.fx.speeds.fast = 100;   // Default is 200
        }
        
        // Disable AOS animations on mobile
        if (window.AOS) {
            AOS.init({
                disable: true
            });
        }
        
        // Simplify particles.js if it exists
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
    
    // Function to optimize event listeners
    function optimizeEventListeners() {
        // Use passive event listeners for touch events
        const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
        
        // Override addEventListener to make events passive by default
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            let newOptions = options;
            
            // If it's a passive-benefitting event and options is not specified or is an object
            if (passiveEvents.includes(type)) {
                if (options === undefined || options === null) {
                    newOptions = { passive: true };
                } else if (typeof options === 'object' && options.passive === undefined) {
                    newOptions = Object.assign({}, options, { passive: true });
                }
            }
            
            return originalAddEventListener.call(this, type, listener, newOptions);
        };
        
        // Throttle scroll and resize events
        const throttle = (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };
        
        // Find and throttle scroll handlers
        const originalScroll = window.onscroll;
        if (typeof originalScroll === 'function') {
            window.onscroll = throttle(originalScroll, 100);
        }
        
        // Find and throttle resize handlers
        const originalResize = window.onresize;
        if (typeof originalResize === 'function') {
            window.onresize = throttle(originalResize, 100);
        }
    }
    
    // Function to optimize third-party libraries
    function optimizeLibraries() {
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
        
        // Optimize Typed.js if it exists
        if (window.Typed) {
            // Find and modify any existing Typed instances
            const typedElements = document.querySelectorAll('.typed-text');
            typedElements.forEach(el => {
                // Check if there's a Typed instance
                if (el._typed) {
                    // Destroy and recreate with optimized settings
                    el._typed.destroy();
                    new Typed(el, {
                        strings: el._typed.strings,
                        typeSpeed: 50,  // Faster typing
                        backSpeed: 30,  // Faster backspacing
                        backDelay: 1000, // Shorter delay
                        loop: true
                    });
                }
            });
        }
    }
    
    // Function to implement code splitting for mobile
    function implementCodeSplitting() {
        // Lazy load non-critical JavaScript
        const nonCriticalScripts = [
            // Add paths to non-critical scripts here
            // For example: 'js/animations.js', 'js/gallery.js', etc.
        ];
        
        // Only load these scripts when they're needed
        if ('IntersectionObserver' in window) {
            const scriptObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Load scripts when user scrolls near the element
                        nonCriticalScripts.forEach(src => {
                            const script = document.createElement('script');
                            script.src = src;
                            script.defer = true;
                            document.body.appendChild(script);
                        });
                        
                        // Stop observing after loading
                        scriptObserver.disconnect();
                    }
                });
            }, { rootMargin: '200px 0px' });
            
            // Start observing an element that's below the fold
            const target = document.querySelector('#about') || document.querySelector('footer');
            if (target) {
                scriptObserver.observe(target);
            }
        } else {
            // Fallback for browsers without IntersectionObserver
            // Load after a delay
            setTimeout(() => {
                nonCriticalScripts.forEach(src => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.defer = true;
                    document.body.appendChild(script);
                });
            }, 3000); // 3 seconds delay
        }
    }
})();