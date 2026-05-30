/**
 * Pepe Amoedo — Portfolio Landing Page
 * Core interactive features & layout animations
 */

import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  initIntersectionObserver();
  initHeaderScroll();
  initCardSpotlight();
  initParticleBackground();
  initSmoothScroll();
  initHUDInteractivity();
});

/**
 * 1. Intersection Observer for Smooth Fade-up Reveals
 */
function initIntersectionObserver() {
  const fadeElements = document.querySelectorAll('.fade-up');
  
  if (fadeElements.length === 0) return;
  
  const options = {
    root: null, // Viewport
    rootMargin: '0px 0px -10% 0px', // Trigger slightly before entering fully
    threshold: 0.1 // 10% of element is visible
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Once the animation triggers, we can unobserve
        observer.unobserve(entry.target);
      }
    });
  }, options);
  
  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * 2. Navigation Header Scroll Effect
 */
function initHeaderScroll() {
  const header = document.querySelector('.main-header');
  if (!header) return;
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  // Call once in case they reload scrolled down
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * 3. Modern Interactive Spotlight Glow for Project Cards
 * Tracks cursor position and updates CSS variables --mouse-x and --mouse-y
 */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.project-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within the element
      const y = e.clientY - rect.top;  // y coordinate within the element
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * 4. Interactive Particle Swarm Canvas (2D Physics Simulation)
 * Drifts organically, draws mathematical nodes, and reacts magnetically to cursor gravity.
 */
function initParticleBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  let animationFrameId;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  
  const particles = [];
  const particleCount = Math.min(100, Math.floor((width * height) / 15000)); // Dynamic count based on viewport density
  const connectionDistance = 120;
  
  // Mouse coordinates and interactive gravity
  const mouse = {
    x: null,
    y: null,
    radius: 180, // Influence radius
    active: false
  };
  
  class Particle {
    constructor() {
      this.reset();
      // Start in random screen positions initially
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.5 + 0.5; // Very fine nodes
      // Slow organic drift speeds
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    
    update() {
      // Mouse gravity effect (attraction)
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Apply gentle pull toward mouse
          this.vx += Math.cos(angle) * force * 0.02;
          this.vy += Math.sin(angle) * force * 0.02;
        }
      }
      
      // Apply movement and inertia
      this.x += this.vx;
      this.y += this.vy;
      
      // Friction / Speed limit
      this.vx *= 0.98;
      this.vy *= 0.98;
      
      // Bounce or loop screen boundaries
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 245, 212, ${this.alpha})`; // Sleek neon cyan
      ctx.fill();
    }
  }
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < connectionDistance) {
          // Opacity based on proximity
          const alpha = (1 - dist / connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          // Blended gradient lines (from Indigo/Purple to Neon Cyan)
          ctx.strokeStyle = `rgba(123, 44, 191, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    
    animationFrameId = requestAnimationFrame(animate);
  }
  
  // Mouse interaction events
  const handleMouseMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  };
  
  const handleMouseLeave = () => {
    mouse.x = null;
    mouse.y = null;
    mouse.active = false;
  };
  
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
  
  // Responsive resize handler
  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    // Adjust particle count on resize dynamically
    const targetCount = Math.min(100, Math.floor((width * height) / 15000));
    if (particles.length < targetCount) {
      for (let i = particles.length; i < targetCount; i++) {
        particles.push(new Particle());
      }
    } else if (particles.length > targetCount) {
      particles.splice(targetCount);
    }
  };
  
  window.addEventListener('resize', handleResize);
  
  // Start animation loop
  animate();
}

/**
 * 5. Smooth Scroll Navigation with Focus Management
 */
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  
  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      e.preventDefault();
      
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update browser history and focus for accessibility
      history.pushState(null, null, targetId);
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus({ preventScroll: true });
    });
  });
}

/**
 * 6. Interactive Graphics HUD simulations (dynamic metrics)
 */
function initHUDInteractivity() {
  const fpsElement = document.getElementById('hud-fps');
  if (!fpsElement) return;
  
  // Gentle simulated fluctuations in frame rate to appear live and responsive
  setInterval(() => {
    const randomFps = Math.floor(Math.random() * 3) + 58; // 58, 59, 60 FPS
    fpsElement.textContent = `${randomFps} FPS (Stable)`;
  }, 2000);
}
