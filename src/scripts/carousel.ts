// src/scripts/carousel.ts
// Interactive projects section tracker and laser progress line

export function initProjectsTracker(): void {
  const projectsSection = document.getElementById('projects');
  const laserBar = document.getElementById('projects-laser-bar') as HTMLElement | null;
  const laserFill = document.getElementById('projects-laser-fill') as HTMLElement | null;
  const beacons = document.querySelectorAll<HTMLElement>('.project-laser-beacon');
  const continueCta = document.getElementById('continue-projects-cta');
  const slides = document.querySelectorAll<HTMLElement>('.project-snap-slide');

  if (!projectsSection || !laserBar || !laserFill || slides.length === 0) return;

  const barEl = laserBar;
  const fillEl = laserFill;
  let activeSlideIndex = -1;

  function updateTracker(index: number) {
    if (index === activeSlideIndex) return;
    activeSlideIndex = index;

    if (index >= 0 && index < slides.length) {
      barEl.classList.remove('opacity-0', '-translate-x-6', 'pointer-events-none');
      barEl.classList.add('opacity-100', 'translate-x-0');

      const progressPercentages = ['20%', '40%', '60%', '80%', '100%'];
      fillEl.style.height = progressPercentages[index];

      beacons.forEach((beacon, i) => {
        if (i <= index) {
          beacon.className = 'project-laser-beacon h-3 w-3 rounded-full border-2 border-blue-500 bg-blue-500 ring-4 ring-blue-500/20 shadow-md shadow-blue-500/30 transition-all duration-300';
        } else {
          beacon.className = 'project-laser-beacon h-2.5 w-2.5 rounded-full border-2 border-zinc-400 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition-all duration-300';
        }
      });

      if (index === 4 && continueCta) {
        continueCta.classList.remove('translate-x-72', 'opacity-0', 'pointer-events-none');
        continueCta.classList.add('translate-x-0', 'opacity-100', 'pointer-events-auto');
      } else if (continueCta) {
        continueCta.classList.remove('translate-x-0', 'opacity-100', 'pointer-events-auto');
        continueCta.classList.add('translate-x-72', 'opacity-0', 'pointer-events-none');
      }
    } else {
      barEl.classList.remove('opacity-100', 'translate-x-0');
      barEl.classList.add('opacity-0', '-translate-x-6', 'pointer-events-none');
      if (continueCta) {
        continueCta.classList.remove('translate-x-0', 'opacity-100', 'pointer-events-auto');
        continueCta.classList.add('translate-x-72', 'opacity-0', 'pointer-events-none');
      }
    }
  }

  const slideObserver = new IntersectionObserver((entries) => {
    let maxRatio = 0;
    let mostVisibleIndex = -1;

    entries.forEach((entry) => {
      const slide = entry.target as HTMLElement;
      const idx = parseInt(slide.dataset.slideIndex || '-1', 10);
      if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleIndex = idx;
        }
      }
    });

    if (mostVisibleIndex !== -1) {
      updateTracker(mostVisibleIndex);
    } else {
      const anyVisible = Array.from(slides).some(s => {
        const r = s.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      });
      if (!anyVisible) {
        updateTracker(-1);
      }
    }
  }, {
    root: null,
    threshold: [0.1, 0.45, 0.7, 0.9]
  });

  slides.forEach(slide => slideObserver.observe(slide));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        updateTracker(-1);
      }
    });
  }, { threshold: 0 });

  sectionObserver.observe(projectsSection);

  const contactSection = document.getElementById('contact');
  let contactObserver: IntersectionObserver | null = null;
  if (contactSection) {
    contactObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.05) {
          updateTracker(-1);
        }
      });
    }, { threshold: [0.05, 0.2, 0.5] });
    contactObserver.observe(contactSection);
  }

  document.addEventListener('astro:before-swap', () => {
    slideObserver.disconnect();
    sectionObserver.disconnect();
    if (contactObserver) contactObserver.disconnect();
  }, { once: true });
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', initProjectsTracker);
}
