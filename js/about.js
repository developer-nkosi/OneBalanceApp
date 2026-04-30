// about.js - OneBalance About Page Scripts

document.addEventListener('DOMContentLoaded', () => {
  initStatsAnimation();
  initMobileNav();
  initSmoothScroll();
});

/**
 * Animate number counters when they enter viewport
 */
function initStatsAnimation() {
  const stats = document.querySelectorAll('.stat-number');
  
  if (stats.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element) {
  const target = parseInt(element.dataset.target);
  const increment = target / 50;
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    // Format number with commas
    const displayValue = Math.floor(current).toLocaleString();
    element.textContent = element.textContent.replace(/\d+/, displayValue);
  }, 30);
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('#nav-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isExpanded = menu.style.display === 'flex';
    menu.style.display = isExpanded ? 'none' : 'flex';
    toggle.setAttribute('aria-expanded', !isExpanded);
  });

  // Close menu when clicking a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.style.display = 'none';
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Smooth scroll for anchor links
 */
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