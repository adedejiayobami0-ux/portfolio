(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Intro choreography: deliberately short, editorial, and non-template-like.
  window.addEventListener('load', () => {
    if (reduceMotion) return;
    document.querySelectorAll('.hero-title .line > span').forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'transform 900ms cubic-bezier(.2,.8,.2,1)';
        el.style.transform = 'translateY(0)';
      }, 120 + i * 115);
    });
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'opacity 700ms ease, transform 700ms ease';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, 520 + i * 120);
    });
  });

  // Custom contextual cursor.
  const cursor = document.querySelector('.cursor');
  const cursorLabel = cursor?.querySelector('span');
  if (cursor && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', e => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorLabel.textContent = el.dataset.cursor || 'View';
        cursor.classList.add('show');
      });
      el.addEventListener('mouseleave', () => cursor.classList.remove('show'));
    });
  }

  // Subtle 3D response on selected product objects.
  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(1200px) rotateY(${x * 7}deg) rotateX(${-y * 6}deg)`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });
  }

  // Jovita story progress: active narrative step and rail progress.
  const steps = [...document.querySelectorAll('.story-step')];
  const rail = document.querySelector('.rail-line i');
  if (steps.length) {
    const storyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const active = Number(entry.target.dataset.step || 1);
        steps.forEach(step => step.classList.toggle('is-active', Number(step.dataset.step) === active));
        if (rail) rail.style.height = `${active * 25}%`;
        document.querySelector('.story-visual')?.style.setProperty('--story-step', active);
      });
    }, { rootMargin: '-38% 0px -38% 0px', threshold: .01 });
    steps.forEach(step => storyObserver.observe(step));
  }

  // Reveals elsewhere are intentionally restrained: motion is used for hierarchy, not decoration.
  const revealEls = document.querySelectorAll('.project-meta, .workflow-board, .claude-card, .timeline-row');
  if (!reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.animate([
          { opacity: 0, transform: 'translateY(26px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' });
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .14 });
    revealEls.forEach(el => revealObserver.observe(el));
  }
})();
