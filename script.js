/* ============================================
   VAELO LANDING PAGE — script.js
   Animations, scroll effects, typewriter, carousels
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ——— Hero fade-in ———
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.opacity = '0';
    hero.style.transition = 'opacity 0.8s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hero.style.opacity = '1';
      });
    });
  }

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

  setTimeout(type, 800);

  // ——— Cursor Glow ———
  const glow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Hide glow on gray sections (section-alt)
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const section = el ? el.closest('.section') : null;
    glow.style.opacity = (section && section.classList.contains('section-alt')) ? '0' : '1';
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // ——— Soft snap: finish scroll only when very close to edge and user paused ———
  let snapTimeout = null;
  let scrollTimer = null;
  let isSnapping = false;

  function getSectionIndex(scrollY) {
    const vh = window.innerHeight;
    return Math.round(scrollY / vh);
  }

  window.addEventListener('scroll', () => {
    if (isSnapping) return;
    if (snapTimeout) clearTimeout(snapTimeout);
    if (scrollTimer) clearTimeout(scrollTimer);

    // Wait for user to stop scrolling for 200ms before considering snap
    scrollTimer = setTimeout(() => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const sectionIdx = getSectionIndex(scrollY);
      const sectionTop = sectionIdx * vh;
      const sectionBot = sectionTop + vh;
      const progress = (scrollY - sectionTop) / vh;

      // Only snap if very close to edge (92%+ down or 8%+ up from top)
      if (progress > 0.92 && scrollY < document.body.scrollHeight - vh) {
        isSnapping = true;
        window.scrollTo({ top: sectionBot, behavior: 'smooth' });
        setTimeout(() => { isSnapping = false; }, 600);
      } else if (progress < 0.08 && sectionIdx > 0) {
        isSnapping = true;
        window.scrollTo({ top: sectionTop, behavior: 'smooth' });
        setTimeout(() => { isSnapping = false; }, 600);
      }
    }, 200);
  }, { passive: true });

  // ——— Slide Entrance Animations ———
  const allSections = document.querySelectorAll('.section');

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.15
  });

  allSections.forEach(section => slideObserver.observe(section));

  // ——— Roadmap Scroll Tracking ———
  const roadmapItems = document.querySelectorAll('.roadmap-item');
  const sectionIds = ['hero', 'management', 'health', 'growth', 'notifications', 'design', 'cta'];
  const sectionElements = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  // Track which section is in view
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        roadmapItems.forEach(item => {
          item.classList.toggle('active', item.dataset.section === id);
        });
      }
    });
  }, {
    threshold: 0.5
  });

  sectionElements.forEach(el => sectionObserver.observe(el));

  // Smooth scroll for roadmap links (uses native snap)
  roadmapItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(item.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

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

    // Arrow navigation
    const prevArrow = carousel.querySelector('.carousel-arrow--prev');
    const nextArrow = carousel.querySelector('.carousel-arrow--next');

    if (prevArrow) {
      prevArrow.addEventListener('click', () => {
        goTo(current > 0 ? current - 1 : images.length - 1);
        resetAutoplay();
      });
    }

    if (nextArrow) {
      nextArrow.addEventListener('click', () => {
        goTo(current < images.length - 1 ? current + 1 : 0);
        resetAutoplay();
      });
    }

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

    carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carousel.addEventListener('mouseleave', autoplay);

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

  // ——— Notification cards mouse parallax (smooth, tracks entire section) ———
  const notifCards = document.querySelectorAll('.notification-card');
  const notifSection = document.getElementById('notifications');

  if (notifSection && notifCards.length) {
    const cardData = Array.from(notifCards).map((card, i) => ({
      el: card,
      depth: 15 + i * 5,
      rotBase: parseFloat(getComputedStyle(card).getPropertyValue('--rot')) || 0,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0
    }));

    notifSection.addEventListener('mousemove', (e) => {
      const rect = notifSection.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;

      cardData.forEach(d => {
        d.targetX = mx * d.depth;
        d.targetY = my * d.depth;
      });
    });

    notifSection.addEventListener('mouseleave', () => {
      cardData.forEach(d => {
        d.targetX = 0;
        d.targetY = 0;
      });
    });

    function animateNotifCards() {
      cardData.forEach(d => {
        d.currentX += (d.targetX - d.currentX) * 0.08;
        d.currentY += (d.targetY - d.currentY) * 0.08;
        d.el.style.transform = `rotate(${d.rotBase}deg) translate(${d.currentX}px, ${d.currentY}px)`;
      });
      requestAnimationFrame(animateNotifCards);
    }
    animateNotifCards();
  }

  // ——— Theme card hover glow ———
  const themeCards = document.querySelectorAll('.theme-card');

  themeCards.forEach(card => {
    const preview = card.querySelector('.theme-preview');
    const glow = card.querySelector('.theme-glow');
    const accent = card.dataset.accent;

    card.style.setProperty('--card-accent', accent);
    card.style.setProperty('--card-accent-glow', accent + '4d');

    card.addEventListener('mousemove', (e) => {
      const rect = preview.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      glow.style.left = x + 'px';
      glow.style.top = y + 'px';
      glow.style.width = '200px';
      glow.style.height = '200px';
      glow.style.marginLeft = '-100px';
      glow.style.marginTop = '-100px';

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

  // ——— Hero Floating Particles ———
  const particlesContainer = document.createElement('div');
  particlesContainer.classList.add('hero-particles');
  hero.prepend(particlesContainer);

  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (4 + Math.random() * 6) + 's';
    particle.style.animationDelay = Math.random() * 4 + 's';
    particle.style.width = (1 + Math.random() * 3) + 'px';
    particle.style.height = particle.style.width;
    particlesContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 12000);
  }

  setInterval(createParticle, 500);
  for (let i = 0; i < 12; i++) setTimeout(createParticle, i * 250);

});
