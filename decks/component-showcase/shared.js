// ===== Scroll-based sidebar notes =====
// Notes with data-for="section-id" become visible when that section is in view

function initSidebarNotes() {
  const notes = document.querySelectorAll('.sidebar-note[data-for]');
  if (!notes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        notes.forEach((note) => {
          if (note.dataset.for === id) {
            note.classList.toggle('visible', entry.isIntersecting);
          }
        });
      });
    },
    { rootMargin: '-20% 0px -60% 0px' }
  );

  document.querySelectorAll('.section[id]').forEach((section) => {
    observer.observe(section);
  });
}

// ===== Top nav active state =====
function initTopNav() {
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.topnav-sections a');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // Also handle in-page section highlighting
  const sections = document.querySelectorAll('.section[id]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href && href.includes('#' + id)) {
              link.classList.add('active');
            } else if (href && href.startsWith('#')) {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

// ===== Keyboard navigation between slides & sections =====
function initKeyNav(prevUrl, nextUrl) {
  const sections = Array.from(document.querySelectorAll('.section'));
  const lastSection = sections.length > 0 ? sections[sections.length - 1] : null;

  // Inject "Next slide →" at the bottom of the last section
  if (lastSection && nextUrl) {
    const nav = document.createElement('div');
    nav.className = 'section-nav';
    const btn = document.createElement('a');
    btn.href = nextUrl;
    btn.className = 'section-nav-btn next-page';
    btn.textContent = 'Next →';
    nav.appendChild(btn);
    lastSection.appendChild(nav);
  }

  // Keyboard: left/right arrows navigate between slides
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' && nextUrl) {
      e.preventDefault();
      window.location.href = nextUrl;
    }
    if (e.key === 'ArrowLeft' && prevUrl) {
      e.preventDefault();
      window.location.href = prevUrl;
    }
  });
}

// ===== Scroll-triggered fade-in =====
function initScrollFade() {
  const els = document.querySelectorAll('.fade-on-scroll');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px' }
  );

  els.forEach((el) => observer.observe(el));
}

// ===== Typewriter effect =====
function typewriter(el, text, speed = 30) {
  return new Promise((resolve) => {
    let i = 0;
    el.textContent = '';
    function tick() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(tick, speed);
      } else {
        resolve();
      }
    }
    tick();
  });
}

// ===== Staggered appear =====
function staggerAppear(container, selector, delay = 100) {
  const items = container.querySelectorAll(selector);
  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(8px)';
    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, i * delay);
  });
}

// ===== Wait helper =====
function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initSidebarNotes();
  initTopNav();
  initScrollFade();
});
