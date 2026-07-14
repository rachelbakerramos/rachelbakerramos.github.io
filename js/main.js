// Mouse-follow star trail (magic wand effect)
if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let lastSpawn = 0;
  const minInterval = 45; // ms between spawns

  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSpawn < minInterval) return;
    lastSpawn = now;

    const star = document.createElement('span');
    star.className = 'trail-star';
    const jitterX = (Math.random() - 0.5) * 10;
    const jitterY = (Math.random() - 0.5) * 10;
    const size = 3 + Math.random() * 4;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.transform = `translate(${e.clientX + jitterX}px, ${e.clientY + jitterY}px)`;
    document.body.appendChild(star);

    requestAnimationFrame(() => {
      star.classList.add('fade');
      star.style.transform = `translate(${e.clientX + jitterX}px, ${e.clientY + jitterY - 16}px) scale(0.3)`;
    });

    setTimeout(() => star.remove(), 750);
  });
}

// Case-page section TOC scroll-spy
const tocChips = document.querySelectorAll('.toc-chip');
if (tocChips.length) {
  const sections = Array.from(tocChips)
    .map((chip) => document.getElementById(chip.getAttribute('href').slice(1)))
    .filter(Boolean);

  const setActive = (id) => {
    tocChips.forEach((c) => c.classList.remove('active'));
    const match = Array.from(tocChips).find((c) => c.getAttribute('href') === '#' + id);
    if (match) match.classList.add('active');
  };

  if (sections[0]) setActive(sections[0].id);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
  );
  sections.forEach((sec) => observer.observe(sec));
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu after clicking a link (mobile)
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll reveal for sections
const revealTargets = document.querySelectorAll('.hero');

if ('IntersectionObserver' in window && revealTargets.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  // Fallback: just show everything
  revealTargets.forEach((el) => el.classList.add('in-view'));
}

// Lightbox: click any diagram/screenshot in a case-study body to view it
// full-size, similar to the Squarespace image-click behavior.
const lightboxImgs = document.querySelectorAll('.case-body img, .img-grid img');

if (lightboxImgs.length) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img class="lightbox-img" alt="">';
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector('.lightbox-img');
  const closeBtn = overlay.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    overlayImg.src = src;
    overlayImg.alt = alt || '';
    overlay.classList.add('is-open');
    document.body.classList.add('lightbox-locked');
  }

  function closeLightbox() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('lightbox-locked');
  }

  lightboxImgs.forEach((img) => {
    img.classList.add('is-zoomable');
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === closeBtn) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

