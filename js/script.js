// Main document ready function
document.addEventListener("DOMContentLoaded", function () {
  // Initialize site functionality
  // Initialize AOS animation library with mobile optimizations
  const isMobile = window.innerWidth < 768;
  const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches || navigator.maxTouchPoints > 0;
  if (window.AOS) {
    AOS.init({
      duration: isMobile ? 500 : 1000,
      once: true,
      mirror: false,
      disable: isMobile, // Disable animations on mobile for better performance
    });
  }

  // Subtle hero parallax for the unified hero scene
  const heroSection = document.querySelector(".hero-section");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const disableMouseMotionEffects = isMobile || isTouchDevice || prefersReducedMotion;

  // Loop the hero role one title at a time.
  const heroGreeting = document.querySelector(".hero-greeting[data-hero-roles]");
  if (heroGreeting) {
    const heroRoles = (heroGreeting.dataset.heroRoles || heroGreeting.textContent.trim())
      .split("|")
      .map(function (role) { return role.trim(); })
      .filter(Boolean);
    let activeRole = 0;
    let roleIndex = heroRoles[0] ? heroRoles[0].length : 0;
    let isDeletingRole = true;

    heroGreeting.textContent = heroRoles[0] || "FRONT-END DEVELOPER";

    if (!prefersReducedMotion && heroRoles.length > 1) {
      const typeDelay = 76;
      const deleteDelay = 42;
      const fullPause = 1550;
      const emptyPause = 320;

      function tickHeroGreeting() {
        const currentRole = heroRoles[activeRole];
        heroGreeting.textContent = currentRole.slice(0, roleIndex);

        if (isDeletingRole) {
          if (roleIndex > 0) {
            roleIndex -= 1;
            window.setTimeout(tickHeroGreeting, deleteDelay);
          } else {
            activeRole = (activeRole + 1) % heroRoles.length;
            isDeletingRole = false;
            window.setTimeout(tickHeroGreeting, emptyPause);
          }
          return;
        }

        const nextRole = heroRoles[activeRole];
        if (roleIndex < nextRole.length) {
          roleIndex += 1;
          window.setTimeout(tickHeroGreeting, typeDelay);
        } else {
          isDeletingRole = true;
          window.setTimeout(tickHeroGreeting, fullPause);
        }
      }

      window.setTimeout(tickHeroGreeting, fullPause);
    }
  }

  // Keep the 3 fixed, then hide/show the remaining logo letters from the end.
  const logoAnimatedChars = Array.from(document.querySelectorAll(".side-nav .logo .logo-letter, .side-nav .logo .logo-symbol.s2"));
  if (logoAnimatedChars.length && !prefersReducedMotion) {
    const charDelay = 72;
    const cyclePause = 1450;
    const hiddenPause = 360;

    function hideLogoChar(index) {
      if (index < 0) {
        window.setTimeout(function () { showLogoChar(0); }, hiddenPause);
        return;
      }

      logoAnimatedChars[index].classList.add("is-hidden");
      window.setTimeout(function () { hideLogoChar(index - 1); }, charDelay);
    }

    function showLogoChar(index) {
      if (index >= logoAnimatedChars.length) {
        window.setTimeout(function () { hideLogoChar(logoAnimatedChars.length - 1); }, cyclePause);
        return;
      }

      logoAnimatedChars[index].classList.remove("is-hidden");
      window.setTimeout(function () { showLogoChar(index + 1); }, charDelay);
    }

    window.setTimeout(function () { hideLogoChar(logoAnimatedChars.length - 1); }, cyclePause);
  }
  if (heroSection && !disableMouseMotionEffects) {
    let frameId = null;
    heroSection.addEventListener("mousemove", function (event) {
      if (frameId) return;
      frameId = requestAnimationFrame(function () {
        const rect = heroSection.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        heroSection.style.setProperty("--hero-x", `${Math.max(-36, Math.min(36, x / 18))}px`);
        heroSection.style.setProperty("--hero-y", `${Math.max(-36, Math.min(36, y / 18))}px`);
        frameId = null;
      });
    });
    heroSection.addEventListener("mouseleave", function () {
      heroSection.style.setProperty("--hero-x", "0px");
      heroSection.style.setProperty("--hero-y", "0px");
    });
  }

  // Initialize particles.js as a very subtle hero texture
  if (document.getElementById("particles-js") && window.particlesJS) {
    const isMobileDevice = window.innerWidth < 768;
    particlesJS("particles-js", {
      particles: {
        number: {
          value: isMobileDevice ? 8 : 22, // Keep the hero texture quiet
          density: {
            enable: true,
            value_area: isMobileDevice ? 1400 : 1100,
          },
        },
        color: {
          value: "#6EA8FF",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
        },
        opacity: {
          value: isMobileDevice ? 0.08 : 0.12,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 2,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#6EA8FF",
          opacity: 0.08,
          width: 1,
        },
        move: {
          enable: true,
          speed: isMobileDevice ? 1.2 : 2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: !isMobileDevice,
            mode: "grab",
          },
          onclick: {
            enable: false,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.16,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    });
  }

  // ============================================================
  // UNIFIED SCROLL HANDLER — single listener for everything
  // ============================================================
  const navbarEl = document.querySelector(".side-nav");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section");
  const backToTopBtn = document.querySelector(".scroll-top-btn");
  const NAVBAR_HEIGHT = 108;

  let ticking = false;

  function onScroll() {
    const scrollY = window.scrollY;

    // 1. Navbar scroll effect (add/remove "scrolled" class)
    if (navbarEl) {
      navbarEl.classList.toggle("scrolled", scrollY > 50);
    }

    // 2. Active nav link based on scroll position
    let currentId = "";
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - NAVBAR_HEIGHT;
      const sectionBottom = sectionTop + section.clientHeight;
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      const isActive = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    // 3. Back-to-top button visibility
    if (backToTopBtn) {
      backToTopBtn.classList.toggle("active", scrollY > 300);
    }

    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // ============================================================
  // SMOOTH SCROLLING
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - NAVBAR_HEIGHT,
          behavior: "smooth",
        });

        // Reset scroll-down-btn style if this is the button
        if (this.classList.contains("scroll-down-btn")) {
          this.classList.add("clicked");
          setTimeout(function () {
            anchor.classList.remove("clicked");
          }, 300);
        }
      }
    });
  });

  // ============================================================
  // BACK TO TOP BUTTON
  // ============================================================
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      this.classList.add("clicked");
      setTimeout(function () {
        backToTopBtn.classList.remove("clicked");
      }, 300);
    });
  }

  // ============================================================
  // FORM SUBMISSION (Formspree AJAX)
  // ============================================================
  const contactForm = document.getElementById("my-form");
  const formStatus = document.getElementById("my-form-status");
  const formButton = document.getElementById("my-form-button");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      formButton.disabled = true;
      formButton.textContent = "Sending...";
      formStatus.textContent = "";

      const data = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          formStatus.textContent =
            "Message sent successfully! I'll get back to you soon.";
          formStatus.style.color = "#3B82F6";
          contactForm.reset();
        } else {
          formStatus.textContent = "Something went wrong. Please try again.";
          formStatus.style.color = "#f85149";
        }
      } catch (error) {
        formStatus.textContent = "Network error. Please check your connection.";
        formStatus.style.color = "#f85149";
      } finally {
        formButton.disabled = false;
        formButton.textContent = "Send Message";
      }
    });
  }

  // ============================================================
  // PROJECT FILTERS
  // ============================================================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-item");

  filterButtons.forEach(function (button) {
    button.setAttribute("role", "button");
    button.setAttribute(
      "aria-pressed",
      button.classList.contains("active") ? "true" : "false",
    );

    button.addEventListener("click", function () {
      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });

      this.classList.add("active");
      this.setAttribute("aria-pressed", "true");

      const filterValue = this.getAttribute("data-filter");

      projectItems.forEach(function (item) {
        const itemCategories = item.getAttribute("data-category");
        if (filterValue === "all" || itemCategories.includes(filterValue)) {
          item.style.display = "block";
          item.removeAttribute("aria-hidden");
        } else {
          item.style.display = "none";
          item.setAttribute("aria-hidden", "true");
        }
      });
    });
  });

  // ============================================================
  // PROJECT SLIDER
  // ============================================================
  const projectSlider = document.querySelector(".project-slider");
  if (projectSlider) {
    const slides = Array.from(projectSlider.querySelectorAll(".project-slide"));
    const prevButton = projectSlider.querySelector(".project-slider-btn.prev");
    const nextButton = projectSlider.querySelector(".project-slider-btn.next");
    const dotsContainer = projectSlider.querySelector(".project-slider-dots");
    const progressBar = projectSlider.querySelector(".project-slider-progress span");
    const sliderReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const AUTOPLAY_MS = 5000;
    let activeSlide = 0;
    let autoplayTimer = null;
    let isPaused = false;
    let touchStartX = 0;

    slides.forEach(function (_, index) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to project " + (index + 1));
      dot.addEventListener("click", function () { showSlide(index, true); });
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll("button"));

    function restartProgress() {
      if (!progressBar) return;
      progressBar.style.animation = "none";
      progressBar.offsetHeight;
      progressBar.style.animation = "";
    }

    function updateSliderState() {
      slides.forEach(function (slide, index) {
        var isActive = index === activeSlide;
        slide.classList.toggle("active", isActive);
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      });
      dots.forEach(function (dot, index) {
        dot.classList.toggle("active", index === activeSlide);
        dot.setAttribute("aria-current", index === activeSlide ? "true" : "false");
      });
      restartProgress();
    }

    function stopAutoplay() {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = null;
      projectSlider.classList.remove("is-playing");
    }

    function startAutoplay() {
      stopAutoplay();
      if (sliderReducedMotion.matches || isPaused || document.hidden || slides.length < 2) return;
      projectSlider.classList.add("is-playing");
      restartProgress();
      autoplayTimer = window.setTimeout(function () { showSlide(activeSlide + 1, false); }, AUTOPLAY_MS);
    }

    function showSlide(index, userInitiated) {
      activeSlide = (index + slides.length) % slides.length;
      updateSliderState();
      startAutoplay();
    }

    if (prevButton) prevButton.addEventListener("click", function () { showSlide(activeSlide - 1, true); });
    if (nextButton) nextButton.addEventListener("click", function () { showSlide(activeSlide + 1, true); });

    projectSlider.addEventListener("mouseenter", function () {
      isPaused = true;
      stopAutoplay();
    });
    projectSlider.addEventListener("mouseleave", function () {
      isPaused = false;
      startAutoplay();
    });

    projectSlider.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") showSlide(activeSlide - 1, true);
      if (event.key === "ArrowRight") showSlide(activeSlide + 1, true);
    });
    projectSlider.setAttribute("tabindex", "0");

    projectSlider.addEventListener("touchstart", function (event) {
      touchStartX = event.changedTouches[0].clientX;
      isPaused = true;
      stopAutoplay();
    }, { passive: true });

    projectSlider.addEventListener("touchend", function (event) {
      var deltaX = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 45) showSlide(activeSlide + (deltaX < 0 ? 1 : -1), true);
      isPaused = false;
      startAutoplay();
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    if (sliderReducedMotion.addEventListener) {
      sliderReducedMotion.addEventListener("change", function () {
        updateSliderState();
        startAutoplay();
      });
    }

    updateSliderState();
    startAutoplay();
  }

  // ============================================================
  // SCROLL REVEAL — IntersectionObserver
  // ============================================================
  const revealTargets = document.querySelectorAll(
    ".section-header, .about-visual, .about-content-v2, " +
    ".stats-row-v2 .stat-item, .skill-item, .skill-group, .service-card, .service-card-v2, " +
    ".project-slider, .project-slide, .project-actions a, .contact-info, .contact-form, " +
    ".contact-icon-grid a, .footer-compact, .capability-card, .availability-card, " +
    ".contact-method-card, .about-img-wrapper, .about-actions .btn, .skills-category"
  );

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );

    revealTargets.forEach(function (element, index) {
      element.classList.add("reveal-on-scroll");
      element.style.setProperty("--reveal-delay", Math.min(index % 6, 5) * 60 + "ms");
      revealObserver.observe(element);
    });
  } else {
    // For users who prefer reduced motion, show everything immediately
    revealTargets.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  // ============================================================
  // LAZY LOADING
  // ============================================================
  if ("IntersectionObserver" in window) {
    const lazyElements = document.querySelectorAll(".lazy");

    const lazyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (entry.target.tagName.toLowerCase() === "img") {
              entry.target.src = entry.target.dataset.src;
              entry.target.classList.remove("lazy");
            } else {
              entry.target.classList.add("in-view");
            }
            lazyObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    lazyElements.forEach(function (element) {
      lazyObserver.observe(element);
    });
  }

  // ============================================================
  // ADVANCED HERO ANIMATIONS
  // ============================================================
  
  // 1. Vanilla Tilt for Hero Avatar
  if (typeof VanillaTilt !== "undefined" && !disableMouseMotionEffects) {
    const avatar = document.querySelector(".hero-avatar-wrap");
    if (avatar) {
      VanillaTilt.init(avatar, {
        max: 12,
        speed: 400,
        glare: false,
        scale: 1.05
      });
    }
  }

  // 1.5 Staggered Letters for Hero Name
  const heroLetters = document.querySelectorAll(".hero-name .hero-letter");
  heroLetters.forEach(function(letter, index) {
    letter.style.animationDelay = (index * 0.05) + "s";
  });

  // 3. Magnetic Hover Effect for Buttons and Social Icons
  const magneticElements = document.querySelectorAll(".hero-social a, .cta-buttons a");
  
  if (!disableMouseMotionEffects) {
    magneticElements.forEach(function (elem) {
      elem.addEventListener("mousemove", function (e) {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        elem.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      elem.addEventListener("mouseleave", function () {
        elem.style.transform = "";
      });
    });
  }

  // ============================================================
  // GLOBAL MOUSE GLOW EFFECT
  // ============================================================
  const mouseGlow = document.querySelector('.global-mouse-glow');
  if (mouseGlow && !disableMouseMotionEffects) {
    let glowX = window.innerWidth / 2;
    let glowY = window.innerHeight / 2;
    let targetX = glowX;
    let targetY = glowY;
    let isMouseMoving = false;

    document.addEventListener('mousemove', function(e) {
      targetX = e.clientX;
      targetY = e.clientY;
      isMouseMoving = true;
    }, { passive: true });

    function animateGlow() {
      // Slowed down interpolation from 0.15 to 0.05 for smoother/slower follow
      glowX += (targetX - glowX) * 0.05;
      glowY += (targetY - glowY) * 0.05;
      
      if (isMouseMoving) {
        mouseGlow.style.transform = `translate(calc(${glowX}px - 50%), calc(${glowY}px - 50%))`;
      }
      
      requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
  }

});
