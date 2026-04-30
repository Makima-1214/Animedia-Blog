/**
 * Enhanced Animations Library
 * Provides smooth, performant animations for the website
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════
  // INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
  // ═══════════════════════════════════════════════════════
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animate-fade-in');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 50); // Stagger effect
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with data-animate attribute
  function initAnimations() {
    document.querySelectorAll('[data-animate="fade-in"]').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      fadeInObserver.observe(el);
    });
  }

  // ═══════════════════════════════════════════════════════
  // SMOOTH HOVER EFFECTS
  // ═══════════════════════════════════════════════════════
  
  function initHoverEffects() {
    // Card hover lift effect
    document.querySelectorAll('[data-hover="lift"]').forEach(card => {
      card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease';
      
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });

    // Button ripple effect
    document.querySelectorAll('[data-ripple="true"]').forEach(button => {
      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
        `;
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // ═══════════════════════════════════════════════════════
  // PARALLAX SCROLL EFFECTS
  // ═══════════════════════════════════════════════════════
  
  let ticking = false;
  
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ═══════════════════════════════════════════════════════
  // SMOOTH SCROLL TO ANCHOR
  // ═══════════════════════════════════════════════════════
  
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════
  // NUMBER COUNTER ANIMATION
  // ═══════════════════════════════════════════════════════
  
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  function initCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => {
      counterObserver.observe(el);
    });
  }

  // ═══════════════════════════════════════════════════════
  // STAGGER ANIMATION FOR LISTS
  // ═══════════════════════════════════════════════════════
  
  function initStaggerAnimation() {
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, index * 100);
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-stagger]').forEach(container => {
      Array.from(container.children).forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });
      staggerObserver.observe(container);
    });
  }

  // ═══════════════════════════════════════════════════════
  // IMAGE LAZY LOAD WITH BLUR EFFECT
  // ═══════════════════════════════════════════════════════
  
  function initLazyImages() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => {
      img.style.filter = 'blur(10px)';
      img.style.transition = 'filter 0.3s ease';
      
      img.addEventListener('load', () => {
        img.style.filter = 'blur(0)';
      });
      
      imageObserver.observe(img);
    });
  }

  // ═══════════════════════════════════════════════════════
  // SCROLL PROGRESS INDICATOR
  // ═══════════════════════════════════════════════════════
  
  function initScrollProgress() {
    const progressBar = document.querySelector('[data-scroll-progress]');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.pageYOffset / windowHeight) * 100;
      progressBar.style.width = `${scrolled}%`;
    }, { passive: true });
  }

  // ═══════════════════════════════════════════════════════
  // REDUCED MOTION SUPPORT
  // ═══════════════════════════════════════════════════════
  
  function respectReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
  }

  // ═══════════════════════════════════════════════════════
  // INITIALIZE ALL ANIMATIONS
  // ═══════════════════════════════════════════════════════
  
  function init() {
    respectReducedMotion();
    initAnimations();
    initHoverEffects();
    initParallax();
    initSmoothScroll();
    initCounters();
    initStaggerAnimation();
    initLazyImages();
    initScrollProgress();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize on Astro page transitions
  document.addEventListener('astro:page-load', init);

  // Export for global use
  window.EnhancedAnimations = {
    init,
    animateCounter,
    initAnimations,
    initHoverEffects
  };

})();

// ═══════════════════════════════════════════════════════
// CSS ANIMATIONS (injected via JS for better control)
// ═══════════════════════════════════════════════════════

const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes animate-fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: animate-fade-in 0.6s ease-out forwards;
  }

  /* Smooth transitions for theme changes */
  * {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-duration: 300ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Disable transitions during theme change */
  .theme-transitioning * {
    transition: none !important;
  }

  /* Enhanced focus styles */
  *:focus-visible {
    outline: 2px solid #7c3aed;
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Smooth scroll behavior */
  html {
    scroll-behavior: smooth;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
document.head.appendChild(style);
