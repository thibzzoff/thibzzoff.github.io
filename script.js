/* ============================================================
   BRWN — script.js
   Cold Brew Coffee · Landing Page · Portfolio MMI
   ============================================================ */

'use strict';

// ============================================================
//  CUSTOM CURSOR
// ============================================================
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower with RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '0.5';
  });
}

// ============================================================
//  NAV — Scroll Effect
// ============================================================
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================================
//  SCROLL REVEAL — Intersection Observer
// ============================================================
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Respect data-delay attribute for staggered animations
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ============================================================
//  PARALLAX — Hero title subtle effect
// ============================================================
function initParallax() {
  const title = document.querySelector('.hero-title');
  const can   = document.querySelector('.can-wrapper');
  if (!title || !can) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const speed1 = scrollY * 0.12;
    const speed2 = scrollY * 0.06;
    title.style.transform = `translateY(${speed1}px)`;
    can.style.transform   = `translateY(${speed2}px)`;
  }, { passive: true });
}

// ============================================================
//  SMOOTH SCROLL — Anchor links
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ============================================================
//  MARQUEE — Pause on hover
// ============================================================
function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}

// ============================================================
//  NUMBERS COUNTER — Animate on scroll
// ============================================================
function initCounters() {
  const stats = document.querySelectorAll('.stat-n');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();

      // Extract numeric part + suffix
      const match = raw.match(/^(\d+)(.*)/);
      if (!match) return;

      const target = parseInt(match[1]);
      const suffix = match[2];
      let current = 0;
      const duration = 1000;
      const steps = 40;
      const increment = target / steps;
      const interval = duration / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target + suffix;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current) + suffix;
        }
      }, interval);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

// ============================================================
//  TESTI CARDS — 3D tilt effect on hover
// ============================================================
function initTilt() {
  const cards = document.querySelectorAll('.testi-card, .feat-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((y - centerY) / centerY) * -4;
      const rotY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============================================================
//  CTA SECTION — Floating watermark parallax
// ============================================================
function initCtaParallax() {
  const section = document.querySelector('.cta-section');
  if (!section) return;

  window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    section.style.setProperty('--watermark-y', `${(progress - 0.5) * 60}px`);
  }, { passive: true });
}

// ============================================================
//  PAGE LOAD — Animate hero in
// ============================================================
function initPageLoad() {
  document.body.style.opacity = '0';

  window.addEventListener('load', () => {
    // Quick fade in
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';

    // Trigger hero reveals immediately
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      const delay = Number(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay + 200);
    });
  });
}

// ============================================================
//  INIT
// ============================================================
function init() {
  initPageLoad();
  initCursor();
  initNav();
  initReveal();
  initParallax();
  initSmoothScroll();
  initMarquee();
  initCounters();
  initTilt();
  initCtaParallax();
}

document.addEventListener('DOMContentLoaded', init);
