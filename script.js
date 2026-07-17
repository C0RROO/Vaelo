/* ============================================
   VAELO LANDING PAGE — script.js
   Animations, scroll effects, typewriter, carousels
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ——— Typewriter Effect ———
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    'Управляй своей жизнью.',
    'Здоровье. Финансы. Цели.',
    'Всё в одном месте.',
    'Твоя жизнь — твои правила.'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 60;

  function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      typewriterEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 30;
    } else {
      typewriterEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 65;
    }

    if (!isDeleting && charIdx === current.length) {
      typeSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 1200);

  // ——— Cursor Glow ———
  const glow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // ——— Navigation Scroll ———
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ——— Mobile Menu ———
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('active', menuOpen);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('active');
    });
  });

  // ——— Scroll Reveal ———
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ——— Counter Animation ———
  const statNumbers = document.querySelectorAll('.hero-stat-number');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // ——— Smooth Scroll ———
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ——— Parallax for hero auras ———
  const heroAuras = document.querySelectorAll('.hero-aura');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroAuras.forEach((aura, i) => {
      const speed = i === 0 ? 0.15 : 0.1;
      aura.style.transform = `translate(-50%, calc(-50% + ${scrollY * speed}px))`;
    });
  });

  // ——— Image Carousels ———
  document.querySelectorAll('.image-carousel').forEach(carousel => {
    const images = carousel.querySelectorAll('.carousel-img');
    const dots = carousel.querySelectorAll('.carousel-dot');
    let current = 0;
    let autoplayTimer;

    function goTo(index) {
      images[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = index;
      images[current].classList.add('active');
      dots[current].classList.add('active');
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.index));
        resetAutoplay();
      });
    });

    function autoplay() {
      autoplayTimer = setInterval(() => {
        goTo((current + 1) % images.length);
      }, 3500);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplay();
    }

    autoplay();

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carousel.addEventListener('mouseleave', autoplay);

    // Touch/swipe support
    let startX = 0;

    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      clearInterval(autoplayTimer);
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].clientX - startX;
      if (Math.abs(deltaX) > 50) {
        if (deltaX < 0 && current < images.length - 1) {
          goTo(current + 1);
        } else if (deltaX > 0 && current > 0) {
          goTo(current - 1);
        }
      }
      autoplay();
    });
  });

  // ——— Notification cards stagger ———
  const notifCards = document.querySelectorAll('.notification-card');

  const notifObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const idx = Array.from(notifCards).indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, idx * 100);
        notifObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  notifCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    notifObserver.observe(card);
  });

  // ——— Theme card hover glow ———
  const themeCards = document.querySelectorAll('.theme-card');

  themeCards.forEach(card => {
    const preview = card.querySelector('.theme-preview');
    const glow = card.querySelector('.theme-glow');
    const accent = card.dataset.accent;

    // Set CSS custom properties for dynamic colors
    card.style.setProperty('--card-accent', accent);
    card.style.setProperty('--card-accent-glow', accent + '4d'); // 30% opacity

    card.addEventListener('mousemove', (e) => {
      const rect = preview.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Position glow at cursor
      glow.style.left = x + 'px';
      glow.style.top = y + 'px';
      glow.style.width = '200px';
      glow.style.height = '200px';
      glow.style.marginLeft = '-100px';
      glow.style.marginTop = '-100px';

      // Subtle parallax tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      preview.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      glow.style.width = '0';
      glow.style.height = '0';
      glow.style.marginLeft = '0';
      glow.style.marginTop = '0';
      preview.style.transform = '';
    });
  });

  // ——— QR Modal ———
  const qrBtn = document.getElementById('qrBtn');
  const qrModal = document.getElementById('qrModal');
  const qrBackdrop = document.getElementById('qrBackdrop');
  const qrClose = document.getElementById('qrClose');

  function openQr() { qrModal.classList.add('active'); }
  function closeQr() { qrModal.classList.remove('active'); }

  qrBtn.addEventListener('click', openQr);
  qrClose.addEventListener('click', closeQr);
  qrBackdrop.addEventListener('click', closeQr);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeQr(); });

});
