// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backTop').classList.toggle('visible', window.scrollY > 400);
  updateActiveNav();
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

// ===== ACTIVE NAV =====
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

// ===== REVEAL ON SCROLL =====
const revealEls = document.querySelectorAll('.project-card, .skill-category, .tl-card, .about-grid, .contact-grid, .timeline-item');
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== SKILL BARS =====
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-category').forEach(el => skillObs.observe(el));

// ===== COUNTER ANIMATION =====
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.astat-num').forEach(num => {
        const target = +num.dataset.target;
        let count = 0;
        const step = Math.ceil(target / 30);
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          num.textContent = count;
          if (count >= target) clearInterval(timer);
        }, 50);
      });
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.about-stats').forEach(el => counterObs.observe(el));

// ===== PROJECT FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

// ===== EMAILJS INIT =====
// Replace these three values after setting up your EmailJS account
const EMAILJS_PUBLIC_KEY = 'MK18tbrayFuxVBhuy';   // from EmailJS → Account → General
const EMAILJS_SERVICE_ID = 'service_3n5ox37';   // from EmailJS → Email Services
const EMAILJS_TEMPLATE_ID = 'template_0wrbotr';  // from EmailJS → Email Templates

emailjs.init(EMAILJS_PUBLIC_KEY);

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const btn = this.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name: name,
    from_email: email,
    subject: subject,
    message: message,
    to_email: 'sajangunarathna26@gmail.com',
    reply_to: email
  }).then(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    this.reset();
    success.style.display = 'block';
    setTimeout(() => success.style.display = 'none', 5000);
  }).catch((err) => {
    console.error('EmailJS error:', err);
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    alert('Failed to send message. Please check your EmailJS setup or email directly: sajangunarathna25@gmail.com');
  });
});

// ===== SMOOTH ACTIVE NAV INIT =====
updateActiveNav();

// ===== THEME CONTROLLER =====
(function initTheme() {
  const themeBtns = document.querySelectorAll('.theme-switch-btn');
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getPreference() {
    return localStorage.getItem('portfolio-theme') || 'system';
  }

  function resolveTheme(pref) {
    if (pref === 'system') {
      return mediaQuery.matches ? 'dark' : 'light';
    }
    return pref;
  }

  function applyTheme(pref, save = true) {
    const resolved = resolveTheme(pref);
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-preference', pref);

    if (save) {
      try {
        localStorage.setItem('portfolio-theme', pref);
      } catch (e) {}
    }

    themeBtns.forEach(btn => {
      const isSelected = btn.dataset.themeVal === pref;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
  }

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.themeVal, true);
    });
  });

  mediaQuery.addEventListener('change', () => {
    if (getPreference() === 'system') {
      applyTheme('system', false);
    }
  });

  // Sync initial button active state
  applyTheme(getPreference(), false);
})();
