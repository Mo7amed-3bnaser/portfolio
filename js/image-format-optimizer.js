/**
 * Image Format Optimizer
 * This script optimizes image loading by using modern formats (WebP) and responsive images
 * without hiding images or affecting desktop experience
 */

// Execute when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only apply on mobile devices
    if (window.innerWidth < 768) {
        // Check if browser supports WebP
        checkWebPSupport(function(webpSupported) {
            // Find all images
            const images = document.querySelectorAll('img:not([srcset])');
            
            // Process each image
            images.forEach(function(img) {
                // Skip SVGs and already processed images
                if (img.src.toLowerCase().endsWith('.svg') || img.dataset.formatOptimized === 'true') {
                    return;
                }
                
                // Mark as processed
                img.dataset.formatOptimized = 'true';
                
                // Get original image source
                const originalSrc = img.src;
                const srcPath = originalSrc.split('?')[0]; // Remove query parameters
                const fileExtension = srcPath.substring(srcPath.lastIndexOf('.') + 1).toLowerCase();
                
                // Only process JPG, JPEG, and PNG images
                if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
                    // Create responsive image with srcset
                    createResponsiveImage(img, webpSupported);
                }
            });
        });
    }
    
    // Function to check WebP support
    function checkWebPSupport(callback) {
        const webP = new Image();
        webP.onload = function() { callback(true); };
        webP.onerror = function() { callback(false); };
        webP.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
    }
    
    // Function to create responsive image
    function createResponsiveImage(img, webpSupported) {
        // Get original image source
        const originalSrc = img.src;
        const srcPath = originalSrc.split('?')[0]; // Remove query parameters
        const fileName = srcPath.substring(srcPath.lastIndexOf('/') + 1);
        const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        const basePath = srcPath.substring(0, srcPath.lastIndexOf('/') + 1);
        
        // Check if we have optimized versions in the optimized folder
        const optimizedBasePath = basePath + 'optimized/';
        
        // Create srcset for different screen sizes
        let srcsetValues = [];
        
        // Define sizes to use in srcset
        const sizes = [320, 480, 768, 1024, 1280];
        
        // Check if we should use WebP
        const format = webpSupported ? 'webp' : 'jpg';
        
        // Try to find optimized versions
        checkOptimizedVersions(img, sizes, optimizedBasePath, fileNameWithoutExt, format, function(availableSizes) {
            if (availableSizes.length > 0) {
                // Create srcset with available optimized versions
                availableSizes.forEach(function(size) {
                    const optimizedPath = `${optimizedBasePath}${fileNameWithoutExt}-${size}.${format}`;
                    srcsetValues.push(`${optimizedPath} ${size}w`);
                });
                
                // Set srcset and sizes attributes
                img.srcset = srcsetValues.join(', ');
                img.sizes = '(max-width: 768px) 100vw, 50vw';
                
                // Set src to the smallest version as fallback
                const smallestSize = Math.min(...availableSizes);
                img.src = `${optimizedBasePath}${fileNameWithoutExt}-${smallestSize}.${format}`;
            } else {
                // If no optimized versions found, try to use WebP version if available
                if (webpSupported) {
                    const webpPath = srcPath.substring(0, srcPath.lastIndexOf('.')) + '.webp';
                    checkImageExists(webpPath, function(exists) {
                        if (exists) {
                            img.src = webpPath;
                        }
                    });
                }
            }
        });
    }
    
    // Function to check which optimized versions exist
    function checkOptimizedVersions(img, sizes, basePath, fileName, format, callback) {
        let availableSizes = [];
        let checksCompleted = 0;
        
        // Check each size
        sizes.forEach(function(size) {
            const path = `${basePath}${fileName}-${size}.${format}`;
            checkImageExists(path, function(exists) {
                if (exists) {
                    availableSizes.push(size);
                }
                
                checksCompleted++;
                if (checksCompleted === sizes.length) {
                    callback(availableSizes);
                }
            });
        });
    }
    
    // Function to check if an image exists
    function checkImageExists(url, callback) {
        const img = new Image();
        img.onload = function() { callback(true); };
        img.onerror = function() { callback(false); };
        img.src = url;
    }
});

// Add a script to generate WebP versions of images if they don't exist
// This is for demonstration - in production, you would generate these server-side
(function() {
    // Only run in development environment and if WebP is supported
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Check WebP support
        const webP = new Image();
        webP.onload = function() {
            // WebP is supported, log a message for the developer
            console.log('WebP is supported. For production, generate WebP versions of all images.');
            console.log('You can use tools like cwebp, imagemin, or sharp to convert images to WebP format.');
        };
        webP.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
    }
})();