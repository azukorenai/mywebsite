/* Azriel portfolio — nav, skills filter, lightbox, contact form */

(function () {
  'use strict';

  // —— Mobile menu ——
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // —— Active nav on scroll ——
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function setActiveNav(id) {
    navLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', match);
      link.classList.toggle('text-slate-300', !match);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href').slice(1);
      setActiveNav(id);
    });
  });

  window.addEventListener(
    'scroll',
    () => {
      let current = 'home';
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 180) {
          current = section.id;
        }
      });
      setActiveNav(current);
    },
    { passive: true }
  );

  // —— Skills filter ——
  const filterBtns = document.querySelectorAll('.skill-filter');
  const skillCards = document.querySelectorAll('.skill-card');

  const filterActive =
    'skill-filter active px-6 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 shadow-[0_0_16px_rgba(20,184,166,0.3)] transition';
  const filterInactive =
    'skill-filter px-6 py-2 rounded-full text-sm font-semibold border border-slate-600 text-slate-300 hover:border-teal-400 hover:text-teal-400 transition';

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach((b) => {
        b.className = b === btn ? filterActive : filterInactive;
      });

      skillCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden-skill', !show);
      });
    });
  });

  // —— Contact form (JS-only: opens mailto) ——
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');
  const CONTACT_EMAIL = 'azrielv.atara@gmail.com';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !subject || !message) {
        formStatus.textContent = 'Please fill in all fields.';
        formStatus.className = 'text-sm text-center text-red-400';
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.className = 'text-sm text-center text-red-400';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Opening mail…';

      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;

      formStatus.textContent = 'Your email client should open. If nothing happens, email me at azrielv.atara@gmail.com.';
      formStatus.className = 'text-sm text-center text-teal-400';
      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message 🚀';
      }, 1200);
    });
  }

  // —— Project lightbox ——
  const shots = Array.from(document.querySelectorAll('.project-shot'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  let currentShot = 0;

  function openLightbox(index) {
    currentShot = index;
    const shot = shots[currentShot];
    lightboxImg.src = shot.dataset.lightbox;
    lightboxImg.alt = shot.dataset.caption || '';
    lightboxCaption.textContent = shot.dataset.caption || '';
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  function showNext(step) {
    currentShot = (currentShot + step + shots.length) % shots.length;
    openLightbox(currentShot);
  }

  shots.forEach((shot, index) => {
    shot.addEventListener('click', () => openLightbox(index));
  });

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', () => showNext(-1));
  document.getElementById('lightbox-next')?.addEventListener('click', () => showNext(1));

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showNext(-1);
    if (e.key === 'ArrowRight') showNext(1);
  });
})();
