(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('load', () => {
    if (reduceMotion) return;
    document.querySelectorAll('.hero-title .line > span').forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'transform 850ms cubic-bezier(.2,.8,.2,1)';
        el.style.transform = 'translateY(0)';
      }, 100 + i * 120);
    });
  });

  if (!reduceMotion) {
    const items = document.querySelectorAll('.project-meta, .workflow-board, .claude-card, .timeline-row, .live-proof-grid');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.animate([
          { opacity: 0, transform: 'translateY(18px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 600, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' });
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    items.forEach(el => observer.observe(el));
  }

  const output = document.querySelector('#mobileOutput');
  if (!output) return;
  const states = {
    discover: ['AGENT PREVIEW','Social Content Planner','Turn one idea into posts, scripts, visuals, and a publishing plan.','Open agent →'],
    work: ['WORK','Bring agents into one conversation','Type @ to call in a different agent without losing the context you already built.','Start working →'],
    tasks: ['TASKS','Put recurring work on a schedule','Schedule supported recurring tasks, then return to the result when it is ready.','View tasks →'],
    creator: ['CREATOR PLATFORM','Package what you know into an agent','Build an AI agent around a useful workflow and publish it for other people to use.','Create an agent →']
  };
  document.querySelectorAll('.agent-chip').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.agent-chip').forEach(x => x.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    const [label,title,desc,cta] = states[btn.dataset.screen] || states.discover;
    output.style.opacity = 0;
    setTimeout(() => {
      output.innerHTML = `<small>${label}</small><strong>${title}</strong><p>${desc}</p><span>${cta}</span>`;
      output.style.opacity = 1;
    }, 120);
  }));
})();
