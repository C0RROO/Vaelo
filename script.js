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
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

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
    card.addEventListener('mouseenter', () => {
      themeCards.forEach(c => c.style.opacity = '0.5');
      card.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      themeCards.forEach(c => c.style.opacity = '1');
    });
  });

  // ——— Download Modal ———
  const downloadModal = document.getElementById('downloadModal');
  const paymentModal = document.getElementById('paymentModal');
  const modalClose = document.getElementById('modalClose');
  const paymentClose = document.getElementById('paymentClose');
  const apkOption = document.getElementById('apkOption');
  const checkPaymentBtn = document.getElementById('checkPaymentBtn');
  const paymentTimer = document.getElementById('paymentTimer');
  const paymentQr = document.getElementById('paymentQr');
  const paymentSuccess = document.getElementById('paymentSuccess');
  const qrPlaceholder = document.getElementById('qrPlaceholder');
  const qrImage = document.getElementById('qrImage');

  function openDownloadModal(e) {
    if (e) e.preventDefault();
    downloadModal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  // Hero "Начать сейчас" button
  const heroBtn = document.querySelector('.hero-actions .btn-primary');
  if (heroBtn) heroBtn.addEventListener('click', openDownloadModal);

  // CTA "Скачать сейчас" button
  const ctaDownloadBtn = document.querySelector('.section-cta .btn-primary');
  if (ctaDownloadBtn) ctaDownloadBtn.addEventListener('click', openDownloadModal);

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  function closeAllModals() {
    closeModal(downloadModal);
    closeModal(paymentModal);
    clearInterval(paymentInterval);
    // Reset payment state
    paymentQr.style.display = '';
    paymentSuccess.style.display = 'none';
  }

  modalClose.addEventListener('click', () => closeModal(downloadModal));
  paymentClose.addEventListener('click', () => {
    closeModal(paymentModal);
    clearInterval(paymentInterval);
    paymentQr.style.display = '';
    paymentSuccess.style.display = 'none';
  });

  // Close on overlay click
  [downloadModal, paymentModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // ——— APK Payment Flow ———
  let paymentInterval = null;

  apkOption.addEventListener('click', () => {
    // Close download modal, open payment modal
    closeModal(downloadModal);
    paymentModal.classList.add('active');
    document.body.classList.add('modal-open');

    // Reset state
    paymentQr.style.display = '';
    paymentSuccess.style.display = 'none';

    // Start payment timer (15 minutes)
    startPaymentTimer();

    // TODO: Replace with real payment API call
    // Example flow:
    // 1. POST to your backend → create SBP payment
    // 2. Backend calls YooKassa / Robokassa API
    // 3. Returns QR code URL or payment URL
    // 4. Display QR code here
    //
    // fetch('/api/create-payment', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount: 10, currency: 'RUB', description: 'Vaelo APK' })
    // })
    // .then(res => res.json())
    // .then(data => {
    //   qrPlaceholder.style.display = 'none';
    //   qrImage.src = data.qr_url;
    //   qrImage.style.display = 'block';
    //   // Store payment ID for status check
    //   currentPaymentId = data.payment_id;
    // });
  });

  function startPaymentTimer() {
    let seconds = 15 * 60; // 15 minutes
    clearInterval(paymentInterval);

    function updateTimer() {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      paymentTimer.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

      if (seconds <= 0) {
        clearInterval(paymentInterval);
        paymentTimer.textContent = 'Истёк';
        paymentTimer.style.color = 'var(--danger)';
      }
      seconds--;
    }

    updateTimer();
    paymentInterval = setInterval(updateTimer, 1000);
  }

  // Check payment status
  checkPaymentBtn.addEventListener('click', () => {
    checkPaymentBtn.disabled = true;
    checkPaymentBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Проверяем...
    `;

    // TODO: Replace with real payment status check
    // fetch(`/api/check-payment/${currentPaymentId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     if (data.status === 'succeeded') {
    //       showSuccess();
    //     } else {
    //       // Payment not found or pending
    //       checkPaymentBtn.disabled = false;
    //       checkPaymentBtn.innerHTML = `...retry text...`;
    //     }
    //   });

    // Demo: simulate payment success after 2 seconds
    setTimeout(() => {
      showSuccess();
    }, 2000);
  });

  function showSuccess() {
    clearInterval(paymentInterval);
    paymentQr.style.display = 'none';
    paymentSuccess.style.display = '';

    // Auto-start download
    const downloadLink = document.getElementById('downloadLink');
    if (downloadLink) {
      setTimeout(() => {
        downloadLink.click();
      }, 800);
    }
  }

});
