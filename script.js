/* ─────────────────────────────────────────
   Custom Cursor
───────────────────────────────────────── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

// Hide on touch devices
if (window.matchMedia('(hover: none)').matches) {
  cursorDot.style.display  = 'none';
  cursorRing.style.display = 'none';
} else {
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Grow ring on interactive elements
  document.querySelectorAll('a, button, .skill-pills span').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
  });
}

/* ─────────────────────────────────────────
   Typewriter Effect
───────────────────────────────────────── */
const roles = ['Data Analyst', 'BI Developer', 'Analytics Engineer'];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const twEl = document.getElementById('typewriter');

function type() {
  const current = roles[roleIndex];
  twEl.textContent = isDeleting
    ? current.slice(0, charIndex - 1)
    : current.slice(0, charIndex + 1);

  isDeleting ? charIndex-- : charIndex++;

  let delay = isDeleting ? 55 : 95;

  if (!isDeleting && charIndex === current.length) {
    delay = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length;
    delay = 420;
  }
  setTimeout(type, delay);
}
type();

/* ─────────────────────────────────────────
   Animated Number Counters
───────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Trigger counters when stats bar enters viewport
const statsBar = document.querySelector('.hero-stats');
let countersFired = false;

if (statsBar) {
  const cObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersFired) {
      countersFired = true;
      document.querySelectorAll('.stat-num').forEach(animateCounter);
      cObs.disconnect();
    }
  }, { threshold: 0.4 });
  cObs.observe(statsBar);
}

/* ─────────────────────────────────────────
   Scroll Reveal (IntersectionObserver)
───────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Stagger siblings of the same parent
    const siblings = Array.from(
      entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
    );
    const idx = siblings.indexOf(entry.target);
    entry.target.style.transitionDelay = (idx * 0.08) + 's';
    entry.target.classList.add('visible');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─────────────────────────────────────────
   Nav — scroll class + scrollspy
───────────────────────────────────────── */
const nav      = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Frosted nav after scroll
  nav.classList.toggle('scrolled', window.scrollY > 40);

  // Active link highlight
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

/* ─────────────────────────────────────────
   Mobile Menu
───────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─────────────────────────────────────────
   Skill pills — stagger entrance animation
───────────────────────────────────────── */
const pillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.skill-pills span').forEach((pill, i) => {
      pill.style.transitionDelay = (i * 0.04) + 's';
      pill.style.opacity  = '1';
      pill.style.transform = 'translateY(0)';
    });
    pillObs.unobserve(entry.target);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-group').forEach(group => {
  group.querySelectorAll('.skill-pills span').forEach(pill => {
    pill.style.opacity   = '0';
    pill.style.transform = 'translateY(12px)';
    pill.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.2s, color 0.2s, background 0.2s';
  });
  pillObs.observe(group);
});
