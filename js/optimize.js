// JavaScript for optimizing mobile performance
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Optimize image loading on mobile devices
if (isMobileDevice) {
    // Make critical images visible immediately
    document.querySelectorAll('img[data-critical="true"]').forEach(img => {
        img.style.visibility = 'visible';
    });
    
    // Optimize VIEW MY WORK button
    const viewWorkBtn = document.querySelector('.btn-primary');
    if (viewWorkBtn) {
        viewWorkBtn.style.willChange = 'transform';
    }
    
    // Use IntersectionObserver for efficient image loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '50px 0px', threshold: 0.1 });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.classList.add('loaded');
            }
        });
    }
}

// Defer non-critical CSS
function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

// Optimize CSS loading and animations
document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.innerWidth < 768;
    
    // Font Awesome is loaded directly in the document head because hero social icons are above the fold.
    const hasFontAwesome = document.querySelector('link[href*="font-awesome"], link[href*="fontawesome"]');
    if (!hasFontAwesome) {
        const fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.rel = 'stylesheet';
        fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fontAwesomeLink);
    }

    function updateHeroIconMode() {
        if (!document.fonts || !document.fonts.check) return;

        const hasBrandIcons = document.fonts.check('400 1em "Font Awesome 6 Brands"');
        const hasSolidIcons = document.fonts.check('900 1em "Font Awesome 6 Free"');
        document.documentElement.classList.toggle('fa-icons-ready', hasBrandIcons && hasSolidIcons);
    }

    updateHeroIconMode();

    if (document.fonts && document.fonts.load) {
        Promise.allSettled([
            document.fonts.load('400 1em "Font Awesome 6 Brands"'),
            document.fonts.load('900 1em "Font Awesome 6 Free"')
        ]).then(updateHeroIconMode);

        document.fonts.ready.then(updateHeroIconMode);
    }

    window.addEventListener('load', updateHeroIconMode);
    setTimeout(updateHeroIconMode, 1500);
    setTimeout(updateHeroIconMode, 4000);
    // Add performance optimizations
    const style = document.createElement('style');
    style.textContent = `
        img.loaded {
            animation: ${isMobile ? 'none' : 'fadeIn 0.5s ease-in-out'};
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .btn.btn-primary {
            ${isMobile ? 'contain: paint;' : ''}
            ${isMobile ? 'will-change: transform;' : ''}
            ${isMobile ? 'transform: translateZ(0);' : ''}
        }
    `;
    document.head.appendChild(style);
    
    // Optimize animations on mobile
    if (isMobile && window.AOS) {
        AOS.init({
            disable: true,
            once: true
        });
    }
});