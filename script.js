/* Azriel portfolio — nav, skills filter, lightbox, contact form */

(function () {
  'use strict';

  // —— Hero typewriter ——
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const roles = [
      'a Frontend Developer.',
      'a Data Entry Specialist.',
      'an aspiring Administrative Officer.',
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeSpeed = 80;
    const deleteSpeed = 45;
    const holdDelay = 1800;

    function tick() {
      const current = roles[roleIndex];

      if (!deleting) {
        typedEl.textContent = current.slice(0, charIndex + 1);
        charIndex += 1;

        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, holdDelay);
          return;
        }
        setTimeout(tick, typeSpeed);
        return;
      }

      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex -= 1;

      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }

    tick();
  }

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

  // —— Contact form (EmailJS) ——
  const EMAILJS_PUBLIC_KEY = 'WwZvxKwavYO4CpTTk';
  const EMAILJS_SERVICE_ID = 'service_lgcg8rn';
  const EMAILJS_TEMPLATE_ID = 'template_xmqhr91';

  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  if (form && typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    form.addEventListener('submit', async (e) => {
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
      submitBtn.textContent = 'Sending…';
      formStatus.className = 'hidden text-sm text-center';

      // Include common Contact Us template variable names
      const templateParams = {
        from_name: name,
        from_email: email,
        user_name: name,
        user_email: email,
        name: name,
        email: email,
        title: subject,
        subject: subject,
        message: message,
        reply_to: email,
      };

      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );

        formStatus.textContent = 'Message sent! I will get back to you soon.';
        formStatus.className = 'text-sm text-center text-teal-400';
        form.reset();
      } catch (err) {
        console.error('EmailJS error:', err);
        const detail =
          (err && (err.text || err.message)) ||
          (typeof err === 'string' ? err : 'Unknown error');
        formStatus.textContent = `Failed to send: ${detail}`;
        formStatus.className = 'text-sm text-center text-red-400';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message 🚀';
      }
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
