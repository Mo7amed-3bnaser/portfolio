/**
 * Progressive Image Loader
 * This script implements progressive image loading for better user experience
 * It loads low-quality placeholders first, then loads the full quality images
 * without hiding images or affecting desktop experience
 */

// Execute when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only apply on mobile devices
    if (window.innerWidth < 768) {
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
    }
    
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
        const testImg = new Image();
        testImg.crossOrigin = 'Anonymous';
        testImg.onload = function() {
            // Tiny placeholder exists, use it
            callback(tinyPlaceholderPath);
        };
        testImg.onerror = function() {
            // Generate a tiny placeholder on the fly
            generateTinyPlaceholder(img, callback);
        };
        testImg.src = tinyPlaceholderPath;
    }
    
    // Function to generate a tiny placeholder on the fly
    function generateTinyPlaceholder(img, callback) {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set a very small size for the placeholder
        canvas.width = 20;
        canvas.height = 20;
        
        // Create a new image to draw on canvas
        const tempImg = new Image();
        tempImg.crossOrigin = 'Anonymous';
        tempImg.onload = function() {
            // Draw the image on canvas
            ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
            
            // Get the data URL
            try {
                const dataUrl = canvas.toDataURL('image/jpeg', 0.1);
                callback(dataUrl);
            } catch (e) {
                // If there's a security error (CORS), use a colored placeholder
                createColorPlaceholder(img, callback);
            }
        };
        tempImg.onerror = function() {
            // If loading fails, use a colored placeholder
            createColorPlaceholder(img, callback);
        };
        tempImg.src = img.src;
    }
    
    // Function to create a colored placeholder based on image position
    function createColorPlaceholder(img, callback) {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set a very small size for the placeholder
        canvas.width = 10;
        canvas.height = 10;
        
        // Use a color based on image position to create variety
        const rect = img.getBoundingClientRect();
        const hue = Math.floor((rect.top + rect.left) % 360);
        ctx.fillStyle = `hsl(${hue}, 70%, 80%)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Get the data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
        callback(dataUrl);
    }
});

// Add CSS styles for progressive loading
(function() {
    // Only apply on mobile devices
    if (window.innerWidth < 768) {
        const style = document.createElement('style');
        style.textContent = `
            .progressive-img-wrapper {
                position: relative;
                overflow: hidden;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                width: 100%;
            }
            
            .img-placeholder {
                opacity: 0;
                transition: opacity 0.5s ease-in;
                width: 100%;
                height: auto;
            }
            
            .img-placeholder.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
})();