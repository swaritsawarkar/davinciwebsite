'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function PlanMotion() {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('.plan-page');
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('.plan-index a'));
    const sections = Array.from(root.querySelectorAll<HTMLElement>('.plan-section'));
    const index = root.querySelector<HTMLElement>('.plan-index')!;
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = index.offsetHeight + 80;
      let active = '';
      sections.forEach(section => { if (section.getBoundingClientRect().top <= offset) active = section.id; });
      links.forEach(link => {
        if (link.hash === `#${active}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      const start = sections[0].offsetTop - index.offsetHeight;
      const end = root.offsetTop + root.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, end - start)));
      root.style.setProperty('--reading-progress', String(progress));
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();

    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const cursor = root.querySelector<HTMLElement>('.plan-cursor')!;
      const ring = cursor.querySelector<HTMLElement>('.plan-cursor-ring')!;
      // Move the fixed overlay outside any animated/clipped page ancestor.
      const parent = cursor.parentNode!;
      document.body.appendChild(cursor);
      const moveX = gsap.quickTo(ring, 'x', { duration: .18, ease: 'power3.out' });
      const moveY = gsap.quickTo(ring, 'y', { duration: .18, ease: 'power3.out' });
      let visible = false;
      const hide = () => {
        visible = false;
        cursor.classList.remove('is-visible');
        root.classList.remove('has-plan-cursor');
        cursor.classList.remove('is-pressed', 'is-link', 'is-card');
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') { hide(); return; }
        const target = event.target instanceof Element ? event.target : null;
        if (!target || !root.contains(target)) { hide(); return; }
        cursor.style.setProperty('--cursor-x', `${event.clientX}px`);
        cursor.style.setProperty('--cursor-y', `${event.clientY}px`);
        if (!visible) {
          gsap.set(ring, { x: event.clientX, y: event.clientY });
          visible = true;
          cursor.classList.add('is-visible');
          root.classList.add('has-plan-cursor');
        }
        moveX(event.clientX);
        moveY(event.clientY);
        cursor.classList.toggle('is-link', Boolean(target.closest('a, button')));
        cursor.classList.toggle('is-card', Boolean(target.closest('article, .skills-list > div')));
      };
      const down = () => cursor.classList.add('is-pressed');
      const up = () => cursor.classList.remove('is-pressed');
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerdown', down, { passive: true });
      window.addEventListener('pointerup', up, { passive: true });
      window.addEventListener('blur', hide);
      document.documentElement.addEventListener('pointerleave', hide);
      window.addEventListener('keydown', hide);
      return () => {
        hide();
        moveX.tween.kill();
        moveY.tween.kill();
        parent.appendChild(cursor);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerdown', down);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('blur', hide);
        document.documentElement.removeEventListener('pointerleave', hide);
        window.removeEventListener('keydown', hide);
      };
    });

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const small = window.matchMedia('(max-width: 700px)').matches;
      const distance = small ? 16 : 32;
      let stopVelocity = () => {};
      const context = gsap.context(() => {
        const velocity = gsap.quickTo('.plan-hero-stamp', 'rotation', { duration: .5, ease: 'power3.out' });
        const settle = gsap.delayedCall(.15, () => velocity(12)).pause();
        ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => { velocity(12 + gsap.utils.clamp(-18, 18, self.getVelocity() / 180)); settle.restart(true); } });
        stopVelocity = () => { settle.kill(); velocity.tween.kill(); };
        const hero = gsap.timeline({ defaults: { duration: .65, ease: 'power3.out' } });
        hero.from('.plan-title-line > span, .plan-title-line > em', { yPercent: 110, stagger: .12 })
          .from('.plan-kicker, .plan-hero-top', { opacity: 0, y: 10, stagger: .06 }, 0)
          .from('.plan-hero-stamp', { opacity: 0, rotation: -14, scale: .85 }, .2)
          .from('.plan-lead, .plan-scroll, .plan-hero-bottom', { opacity: 0, y: 16, stagger: .09 }, .35);

        sections.forEach(section => {
          const heading = section.querySelector('h2');
          gsap.from(heading, { clipPath: 'inset(100% 0 0 0)', y: distance, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 92%', once: true } });
          gsap.from(section.querySelector('.plan-section-head'), { '--rule-scale': 0, duration: .7, scrollTrigger: { trigger: section, start: 'top 88%', once: true } });
          gsap.from(section.querySelector('.plan-heading-row > p'), { opacity: 0, y: 12, duration: .55, scrollTrigger: { trigger: heading, start: 'top 85%', once: true } });
        });
        root.querySelectorAll('.strategy-grid, .build-grid, .roles-grid, .goals-grid').forEach(grid => {
          const cards = Array.from(grid.children);
          // Each card has its own viewport trigger so later mobile rows never animate offscreen.
          cards.forEach((card, i) => gsap.from(card, { opacity: 0, y: distance, duration: .6, delay: small ? 0 : (i % 4) * .07, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 94%', once: true } }));
        });
        const system = gsap.timeline({ scrollTrigger: { trigger: '.plan-system', start: 'top 85%', once: true } });
        const blocks = gsap.utils.toArray<HTMLElement>('.plan-system > span');
        const connectors = gsap.utils.toArray<HTMLElement>('.plan-system > i');
        blocks.forEach((block, i) => {
          system.from(block, { opacity: 0, y: distance, duration: .4, ease: 'power3.out' });
          if (connectors[i]) system.from(connectors[i], { scaleX: 0, transformOrigin: 'left', duration: .25 });
        });
        connectors.forEach((connector, i) => {
          system.fromTo(connector, { '--signal-position': '0%', '--signal-opacity': 0 }, { '--signal-position': '100%', '--signal-opacity': 1, duration: .4, ease: 'none' });
          system.to(connector, { '--signal-opacity': 0, duration: .1 });
          system.fromTo(blocks[i + 1], { borderColor: '#ff41b7' }, { borderColor: '#171721', duration: .4 });
        });
        gsap.fromTo('.phase-list', { '--phase-progress': 0 }, { '--phase-progress': 1, ease: 'none', scrollTrigger: { trigger: '.phase-list', start: 'top 65%', end: 'bottom 65%', scrub: .25 } });
        root.querySelectorAll('.phase-list article').forEach(row => {
          gsap.from(row, { opacity: 0, x: small ? 0 : 18, duration: .5, scrollTrigger: { trigger: row, start: 'top 90%', once: true } });
          ScrollTrigger.create({ trigger: row, start: 'top 65%', end: 'bottom 65%', toggleClass: 'is-reading' });
        });
        root.querySelectorAll('.skills-list > div').forEach(row => {
          const timeline = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 92%', once: true } });
          timeline.from(row, { opacity: 0, x: -distance, duration: .55, ease: 'power3.out' })
            .from(row.lastElementChild, { rotation: -90, duration: .65, ease: 'power3.out' }, 0);
        });
        gsap.timeline({ scrollTrigger: { trigger: '.plan-closing strong', start: 'top 88%', once: true } })
          .from('.plan-closing strong > span', { opacity: 0, y: distance, duration: .5 })
          .from('.plan-closing strong > em', { opacity: 0, scale: 1.14, y: 12, duration: .5, ease: 'back.out(1.5)' }, .25);
      }, root);
      return () => { stopVelocity(); context.revert(); };
    });
    return () => {
      media.revert();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      links.forEach(link => link.removeAttribute('aria-current'));
      root.style.removeProperty('--reading-progress');
    };
  }, []);
  return (
    <div className="plan-cursor" aria-hidden="true">
      <span className="plan-cursor-dot" />
      <span className="plan-cursor-ring"><i /><b>↗</b></span>
    </div>
  );
}
