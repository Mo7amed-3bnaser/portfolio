/**
 * Image Size Optimizer for Mobile
 * This script optimizes images for mobile devices without hiding them
 * It helps with Largest Contentful Paint (LCP) issues by properly sizing images
 * and converting them to more efficient formats when possible
 */

// Execute immediately for fastest possible optimization
(function() {
    // Only apply optimizations on mobile devices
    if (window.innerWidth < 768) {
        // Add a listener for when DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', optimizeImages);
        } else {
            optimizeImages();
        }
    }
    
    function optimizeImages() {
        // 1. Find all images on the page
        const allImages = document.querySelectorAll('img');
        
        // 2. Process each image
        allImages.forEach(img => {
            // Skip already processed images
            if (img.dataset.optimized) return;
            
            // Mark as optimized to avoid duplicate processing
            img.dataset.optimized = 'true';
            
            // Ensure loading attribute is set
            if (!img.hasAttribute('loading')) {
                // Only lazy load images below the fold
                if (!isInViewport(img)) {
                    img.loading = 'lazy';
                } else {
                    img.loading = 'eager'; // Load immediately for above-fold images
                }
            }
            
            // Ensure images have explicit width and height to prevent layout shifts
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                // Set dimensions based on natural size or parent container
                setImageDimensions(img);
            }
            
            // Add fetchpriority="high" to important images (like hero images)
            if (isImportantImage(img)) {
                img.setAttribute('fetchpriority', 'high');
            }
            
            // Try to use WebP format if available
            tryUseWebP(img);
            
            // Add decoding="async" to non-critical images
            if (!isImportantImage(img)) {
                img.decoding = 'async';
            } else {
                img.decoding = 'sync'; // Use sync for critical images
            }
            
            // Force immediate visibility
            img.style.opacity = '1';
        });
        
        // 3. Add IntersectionObserver for images that are lazy loaded
        setupLazyLoadObserver();
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
    
    // Helper function to determine if an image is important (part of LCP)
    function isImportantImage(img) {
        // Check if image is in hero section or has specific classes
        const isHeroImage = img.closest('.hero-content') !== null;
        const isProfileImage = img.closest('.profile-img') !== null;
        const hasImportantClass = img.classList.contains('important') || 
                                img.classList.contains('critical');
        
        return isHeroImage || isProfileImage || hasImportantClass;
    }
    
    // Helper function to set image dimensions
    function setImageDimensions(img) {
        // If image is already loaded, use its natural dimensions
        if (img.complete && img.naturalWidth > 0) {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            
            // If parent has a defined width, use that to calculate height
            const parent = img.parentElement;
            const parentWidth = parent.offsetWidth;
            
            if (parentWidth > 0) {
                img.width = parentWidth;
                img.height = Math.round(parentWidth / aspectRatio);
            } else {
                // Use natural dimensions but scaled down if too large
                const maxWidth = window.innerWidth * 0.9; // 90% of viewport width
                if (img.naturalWidth > maxWidth) {
                    img.width = maxWidth;
                    img.height = Math.round(maxWidth / aspectRatio);
                } else {
                    img.width = img.naturalWidth;
                    img.height = img.naturalHeight;
                }
            }
        } else {
            // For images not yet loaded, set a default aspect ratio
            // and update when loaded
            img.width = img.parentElement.offsetWidth || 300;
            img.height = Math.round(img.width * 0.75); // Assume 4:3 aspect ratio
            
            img.addEventListener('load', function() {
                if (this.naturalWidth > 0) {
                    const aspectRatio = this.naturalWidth / this.naturalHeight;
                    this.height = Math.round(this.width / aspectRatio);
                }
            });
        }
    }
    
    // Helper function to try using WebP format if available
    function tryUseWebP(img) {
        // Only proceed if the image is not already a WebP
        if (!img.src.toLowerCase().endsWith('.webp')) {
            const originalSrc = img.src;
            const srcPath = originalSrc.split('?')[0]; // Remove query parameters
            const webpSrc = srcPath.substring(0, srcPath.lastIndexOf('.')) + '.webp';
            
            // Check if WebP version exists in the optimized folder
            const optimizedWebpSrc = srcPath.substring(0, srcPath.lastIndexOf('/')) + 
                                    '/optimized/' + 
                                    srcPath.substring(srcPath.lastIndexOf('/') + 1, srcPath.lastIndexOf('.')) + 
                                    '.webp';
            
            // Try to load the WebP version
            const testImg = new Image();
            testImg.onload = function() {
                // WebP exists, use it
                img.src = optimizedWebpSrc;
            };
            testImg.onerror = function() {
                // Try the regular webp path
                const regularTest = new Image();
                regularTest.onload = function() {
                    img.src = webpSrc;
                };
                regularTest.src = webpSrc;
            };
            testImg.src = optimizedWebpSrc;
        }
    }
    
    // Setup IntersectionObserver for better lazy loading
    function setupLazyLoadObserver() {
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        
                        // If image has data-src, load from there
                        if (lazyImage.dataset.src) {
                            lazyImage.src = lazyImage.dataset.src;
                            delete lazyImage.dataset.src;
                        }
                        
                        // If image has data-srcset, load from there
                        if (lazyImage.dataset.srcset) {
                            lazyImage.srcset = lazyImage.dataset.srcset;
                            delete lazyImage.dataset.srcset;
                        }
                        
                        lazyImage.classList.add('loaded');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            }, {
                rootMargin: '200px 0px' // Start loading when image is 200px from viewport
            });
            
            // Observe all images with loading="lazy"
            document.querySelectorAll('img[loading="lazy"]').forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        }
    }
})();