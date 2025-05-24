// Force loading screen to be visible on mobile
(function() {
    // Make sure loading screen is visible before anything else
    var loadingScreen = document.getElementById('loading-screen');
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (loadingScreen && isMobile) {
        // Force display on mobile devices
        loadingScreen.style.setProperty('display', 'flex', 'important');
        loadingScreen.style.setProperty('opacity', '1', 'important');
        loadingScreen.style.setProperty('visibility', 'visible', 'important');
        
        // Prevent any immediate hiding
        loadingScreen.classList.remove('hidden');
    }
})();

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library with mobile optimizations
    const isMobile = window.innerWidth < 768;
    AOS.init({
        duration: isMobile ? 500 : 1000,
        once: true,
        mirror: false,
        disable: isMobile // Disable animations on mobile for better performance
    });

    // Initialize Typed.js for typing animation
    const typed = new Typed('.typed-text', {
        strings: ['Front-End Developer',  'Freelancer'],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        loop: true
    });
    
    // Initialize particles.js with significantly reduced particles for mobile
    if(document.getElementById('particles-js')) {
        const isMobile = window.innerWidth < 768;
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: isMobile ? 20 : 80, // Reduce particles count on mobile
                    density: {
                        enable: true,
                        value_area: isMobile ? 1200 : 800 // Increase area on mobile
                    }
                },
                color: {
                    value: '#58a6ff'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: isMobile ? 0.3 : 0.5, // Reduce opacity on mobile
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#58a6ff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: isMobile ? 3 : 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: !isMobile,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }

    // Add toggle functionality for top navigation on mobile
    const sideNav = document.querySelector('.side-nav');
    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('nav-toggle-btn');
    toggleBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.appendChild(toggleBtn);
    
    toggleBtn.addEventListener('click', function() {
        const isExpanded = sideNav.classList.contains('collapsed');
        sideNav.classList.toggle('collapsed');
        this.classList.toggle('active');
        this.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        
        // Toggle between bars and times icon
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Use debounced scroll event for better performance
    let scrollTimeout;
    const debounceTime = 10; // ms
    
    function debounceScroll(callback) {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                scrollTimeout = null;
                callback();
            }, debounceTime);
        }
    }
    
    // Make side nav links active on scroll with debounce
    window.addEventListener('scroll', function() {
        debounceScroll(function() {
            const scrollPosition = window.scrollY;
            
            // Navbar scroll effect
            const navbar = document.querySelector('.side-nav');
            if (scrollPosition > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Ensure active nav link stays active
            const navLinks = document.querySelectorAll('.nav-links a');
            const sections = document.querySelectorAll('section');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href');
                if (linkHref === `#${current}`) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for navbar height
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                    navLink.removeAttribute('aria-current');
                });
                this.classList.add('active');
                this.setAttribute('aria-current', 'page');
                
                // Reset scroll-down-btn style if this is the button
                if (this.classList.contains('scroll-down-btn')) {
                    this.classList.add('clicked');
                    setTimeout(() => {
                        this.classList.remove('clicked');
                    }, 300);
                }
            }
        });
    });
    
    // Specific handler for scroll-down-btn
    const scrollDownBtn = document.querySelector('.scroll-down-btn');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function() {
            // Reset button style after click
            setTimeout(() => {
                this.style.background = 'linear-gradient(145deg, rgba(78, 158, 255, 0.4), rgba(46, 160, 67, 0.4))';
                this.style.boxShadow = '0 4px 15px rgba(78, 158, 255, 0.5)';
            }, 300);
        });
    }

    // Update active nav link on scroll with debouncing
    window.addEventListener('scroll', function() {
        debounceScroll(function() {
            let current = '';
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
                navLink.removeAttribute('aria-current');
                if (navLink.getAttribute('href') === `#${current}`) {
                    navLink.classList.add('active');
                    navLink.setAttribute('aria-current', 'page');
                }
            });
        });
    });

    // Back to top button functionality
    const backToTopBtn = document.querySelector('.scroll-top-btn');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Reset button style after click
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 300);
    });

    // Form submission handling - with improved form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Better validation
            let isValid = true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Simple form validation
            if (!name) {
                isValid = false;
                document.getElementById('name').classList.add('is-invalid');
            } else {
                document.getElementById('name').classList.remove('is-invalid');
            }
            
            if (!email || !emailRegex.test(email)) {
                isValid = false;
                document.getElementById('email').classList.add('is-invalid');
            } else {
                document.getElementById('email').classList.remove('is-invalid');
            }
            
            if (!subject) {
                isValid = false;
                document.getElementById('subject').classList.add('is-invalid');
            } else {
                document.getElementById('subject').classList.remove('is-invalid');
            }
            
            if (!message) {
                isValid = false;
                document.getElementById('message').classList.add('is-invalid');
            } else {
                document.getElementById('message').classList.remove('is-invalid');
            }
            
            if (isValid) {
                // In a real application, you would send this data to a server
                // For now, just show a success message and reset the form
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all fields correctly.');
            }
        });
    }

    // Project Filters with optimization for touch devices
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        // Add accessibility attributes
        button.setAttribute('role', 'button');
        button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
        
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.removeAttribute('aria-hidden');
                } else {
                    item.style.display = 'none';
                    item.setAttribute('aria-hidden', 'true');
                }
            });
            
            // Force the button to maintain its active state
            requestAnimationFrame(() => {
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');
                // Reset other buttons to ensure they don't stay in focus state
                filterButtons.forEach(btn => {
                    if (btn !== this) {
                        btn.blur();
                    }
                });
            });
        });
    });

    // Fix for project filter buttons to maintain their state after click
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.filter-btn')) {
            // When clicking outside buttons, ensure active button stays active
            const activeButton = document.querySelector('.filter-btn.active');
            if (activeButton) {
                activeButton.classList.add('active');
                activeButton.setAttribute('aria-pressed', 'true');
            }
        }
    });
    
    // Handle nav link clicks with improved persistence and accessibility
    const allNavLinks = document.querySelectorAll('.nav-links a');
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Store the clicked link in session storage
            sessionStorage.setItem('activeNavLink', this.getAttribute('href'));
            
            // Remove active class from all links
            allNavLinks.forEach(lnk => {
                lnk.classList.remove('active');
                lnk.removeAttribute('aria-current');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            this.setAttribute('aria-current', 'page');
            
            // Force active state to persist with requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                this.classList.add('active');
                // Ensure the link stays active even after page interactions
                const handleClick = function() {
                    const activeHref = sessionStorage.getItem('activeNavLink');
                    if (activeHref) {
                        const activeLink = document.querySelector(`.nav-links a[href="${activeHref}"]`);
                        if (activeLink) {
                            activeLink.classList.add('active');
                            activeLink.setAttribute('aria-current', 'page');
                        }
                    }
                    document.removeEventListener('click', handleClick);
                };
                
                document.addEventListener('click', handleClick, { once: true });
            });
        });
    });

    // Check for stored active link on page load
    const activeHref = sessionStorage.getItem('activeNavLink');
    if (activeHref) {
        const activeLink = document.querySelector(`.nav-links a[href="${activeHref}"]`);
        if (activeLink) {
            allNavLinks.forEach(lnk => lnk.classList.remove('active'));
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }
    }
    
    // Add hover effect for project cards with hardware acceleration for better performance
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        // Add accessibility attributes
        card.setAttribute('tabindex', '0');
        
        const handleHoverStart = function() {
            this.style.transform = 'translateY(-10px)';
            this.style.willChange = 'transform';
        };
        
        const handleHoverEnd = function() {
            this.style.transform = 'translateY(0)';
            this.style.willChange = 'auto';
        };
        
        // Mouse events for desktop
        card.addEventListener('mouseenter', handleHoverStart);
        card.addEventListener('mouseleave', handleHoverEnd);
        
        // Touch events for mobile with passive option for better performance
        card.addEventListener('touchstart', handleHoverStart, {passive: true});
        card.addEventListener('touchend', handleHoverEnd, {passive: true});
        
        // Keyboard navigation for accessibility
        card.addEventListener('focus', handleHoverStart);
        card.addEventListener('blur', handleHoverEnd);
    });
    
    // Add intersection observer for lazy-loading elements
    if ('IntersectionObserver' in window) {
        const lazyElements = document.querySelectorAll('.lazy');
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.tagName.toLowerCase() === 'img') {
                        entry.target.src = entry.target.dataset.src;
                        entry.target.classList.remove('lazy');
                    } else {
                        entry.target.classList.add('in-view');
                    }
                    lazyObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px',
            threshold: 0.1
        });
        
        lazyElements.forEach(element => {
            lazyObserver.observe(element);
        });
    }
    
    // Add event listeners only on the elements that need them
    function addEventListenersToVisibleElements() {
        // This function could be called when elements enter the viewport
        // Using the Intersection Observer API
    }
});