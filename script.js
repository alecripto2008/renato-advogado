/* ===================================
   RENATO LOBO – LANDING PAGE
   JavaScript: Interactions & Analytics
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ===== MOBILE NAVIGATION =====
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close menu on link click
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

  // ===== HEADER SCROLL EFFECT =====
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all FAQ items
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ===== SCROLL REVEAL ANIMATION =====
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav__link').forEach(link => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => navObserver.observe(section));

  // ===== GOOGLE ANALYTICS / GTM – CTA EVENT TRACKING =====
  const ctaElements = document.querySelectorAll('[data-cta]');

  ctaElements.forEach(el => {
    el.addEventListener('click', function () {
      const ctaName = this.getAttribute('data-cta');

      // Push to dataLayer for GTM
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'cta_click',
          cta_name: ctaName,
          cta_text: this.textContent.trim().substring(0, 80),
          cta_url: this.href || '#',
          page_section: getClosestSectionId(this)
        });
      }

      // Send to GA4 directly via gtag (if available)
      if (typeof gtag === 'function') {
        gtag('event', 'cta_click', {
          event_category: 'engagement',
          event_label: ctaName,
          value: 1
        });
      }

      console.log(`[Analytics] CTA Click: ${ctaName}`);
    });
  });

  /**
   * Helper: Get closest section ID for analytics context
   */
  function getClosestSectionId(element) {
    const section = element.closest('section');
    return section ? section.id : 'unknown';
  }

  // ===== SCROLL PROGRESS (optional visual indicator) =====
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    document.documentElement.style.setProperty('--scroll-progress', `${scrollPercent}%`);
  }, { passive: true });

  // ===== CAL.COM MODAL =====
  // Torna as funções globais para uso nos onclick do HTML
  window.openCalModal = function () {
    const modal = document.getElementById('calModal');
    const iframe = document.getElementById('calIframe');

    // URL do Cal.com - SUBSTITUA pelo link do advogado quando disponível
    const calUrl = 'https://cal.com/helvecio-bello-siaxwl/30min?overlayCalendar=true';

    // Carrega o iframe apenas quando abre (lazy loading)
    if (!iframe.src || iframe.src === '' || iframe.src === window.location.href) {
      iframe.src = calUrl;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Analytics event
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'calendar_open',
        cta_name: 'cal_modal_open'
      });
    }
  };

  window.closeCalModal = function () {
    const modal = document.getElementById('calModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Fechar modal com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('calModal');
      if (modal && modal.classList.contains('active')) {
        window.closeCalModal();
      }
    }
  });

  console.log('✅ Renato Lobo – Landing Page loaded successfully');
});
