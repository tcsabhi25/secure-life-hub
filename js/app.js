  const navibar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navibar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // HAMBURGER
  const hamburgerMenu = document.getElementById('hamburger');
  const mobMenu = document.getElementById('mobileMenu');
  hamburgerMenu.addEventListener('click', () => {
    mobMenu.style.display = mobMenu.style.display === 'flex' ? 'none' : 'flex';
  });
  mobMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { mobMenu.style.display = 'none'; });
  });

  // SCROLL REVEAL
  const revealEl = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const interObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        interObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEl.forEach(el => interObs.observe(el));

  // COUNTERS
  let count = false;
  const counterEl = document.querySelectorAll('.counter-num[data-target]');
  const counterObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !count) {
      count = true;
      counterEl.forEach(el => {
        const target = +el.dataset.target;
        const suffix = target === 5000 ? '+' : target === 98 ? '%' : target === 7 ? '×' : '+';
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current.toLocaleString() + suffix;
          if (current >= target) clearInterval(timer);
        }, 30);
      });
    }
  }, { threshold: 0.5 });
  counterObs.observe(document.querySelector('.counters'));

  // MODAL
  function openModal() {
    document.getElementById('callbackModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    document.getElementById('callbackModal').classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('callbackModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  // FORM HANDLERS - Now handled by form-handler.js with EmailJS and Twilio integration
