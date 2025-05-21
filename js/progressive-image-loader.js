/**
 * Progressive Image Loader
 * This script implements progressive image loading for better user experience
 * It loads low-quality placeholders first, then loads the full quality images
 * for all devices (desktop and mobile)
 */

// Execute when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Apply on all devices (removed mobile-only check)
    // Find all project images and other large images
    const projectImages = document.querySelectorAll('.project-img img, .hero-img img, img[width][height]');
    
    // Process each image
    projectImages.forEach(function(img) {
        // Skip already processed images
        if (img.dataset.progressive === 'true') return;
        
        // Mark as processed
        img.dataset.progressive = 'true';
        
        // Get original image source
        const originalSrc = img.src;
        
        // Create a wrapper for the image if it doesn't have one
        let wrapper = img.parentElement;
        if (!wrapper.classList.contains('progressive-img-wrapper')) {
            // Create a wrapper
            wrapper = document.createElement('div');
            wrapper.className = 'progressive-img-wrapper';
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
        }
        
        // Add placeholder class to image
        img.classList.add('img-placeholder');
        
        // Create a tiny version of the image (data URI or tiny thumbnail)
        createTinyPlaceholder(img, function(tinyDataUri) {
            // Set the tiny placeholder as background
            wrapper.style.backgroundImage = `url(${tinyDataUri})`;
            wrapper.style.backgroundSize = 'cover';
            wrapper.style.backgroundPosition = 'center';
            
            // Load the full image with IntersectionObserver
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            // Load the full image
                            const fullImg = entry.target;
                            
                            // Create a new image element to load the full image
                            const tempImg = new Image();
                            tempImg.onload = function() {
                                // Replace placeholder with full image
                                fullImg.src = originalSrc;
                                fullImg.classList.add('loaded');
                                
                                // Remove the background placeholder
                                setTimeout(function() {
                                    fullImg.parentElement.style.backgroundImage = 'none';
                                }, 500);
                                
                                // Stop observing
                                observer.unobserve(fullImg);
                            };
                            tempImg.src = originalSrc;
                        }
                    });
                }, {
                    rootMargin: '200px 0px' // Start loading when image is 200px from viewport
                });
                
                // Start observing
                observer.observe(img);
            } else {
                // Fallback for browsers that don't support IntersectionObserver
                setTimeout(function() {
                    img.src = originalSrc;
                    img.classList.add('loaded');
                }, 100);
            }
        });
    });
    
    // Function to create a tiny placeholder version of the image
    function createTinyPlaceholder(img, callback) {
        // Check if we can use the optimized folder
        const originalSrc = img.src;
        const srcPath = originalSrc.split('?')[0]; // Remove query parameters
        
        // Try to use a pre-generated tiny placeholder if available
        const tinyPlaceholderPath = srcPath.substring(0, srcPath.lastIndexOf('/')) + 
                                '/optimized/tiny_' + 
                                srcPath.substring(srcPath.lastIndexOf('/') + 1);
        
        // Try to load the tiny placeholder
        const tinyImg = new Image();
        tinyImg.onload = function() {
            callback(tinyPlaceholderPath);
        };
        tinyImg.onerror = function() {
            // If tiny placeholder doesn't exist, create a simple color placeholder
            // based on the average color of the image
            getAverageColor(img, function(color) {
                callback(`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" fill="${color}"><rect width="1" height="1"/></svg>`);
            });
        };
        tinyImg.src = tinyPlaceholderPath;
    }
    
    // Function to get the average color of an image
    function getAverageColor(img, callback) {
        // Default color if we can't calculate
        let color = '#222222';
        
        // If image is already loaded, calculate average color
        if (img.complete && img.naturalWidth > 0) {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 1;
                canvas.height = 1;
                
                ctx.drawImage(img, 0, 0, 1, 1);
                const data = ctx.getImageData(0, 0, 1, 1).data;
                
                color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
            } catch (e) {
                // If there's an error (e.g., CORS), use default color
            }
        }
        
        callback(color);
    }
});