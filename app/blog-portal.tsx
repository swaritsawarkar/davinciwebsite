'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

export default function BlogPortal({ motion }: { motion: boolean }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!motion || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.blog-line > span', {
          yPercent: 115, rotate: 5, stagger: .09, duration: 1.1, ease: 'power4.out',
          scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
        });
        const skew = gsap.quickTo('.blog-running-type', 'skewX', { duration: .25, ease: 'power3.out' });
        const settle = gsap.delayedCall(.12, () => skew(0)).pause();
        ScrollTrigger.create({ trigger: root.current, start: 'top bottom', end: 'bottom top',
          onUpdate: self => { skew(gsap.utils.clamp(-6, 6, self.getVelocity() / -550)); settle.restart(true); },
        });
        return () => { settle.kill(); skew.tween.kill(); };
      });
    }, root);
    return () => { media.revert(); context.revert(); };
  }, [motion]);
  return (
    <section className="blog-portal" ref={root} aria-labelledby="blog-title">
      <div className="section-label mono"><span>THE DAVINCI BLOG</span><span>FIELD NOTES / 01</span></div>
      <div className="blog-portal-grid">
        <div>
          <p className="mono blog-eyebrow">INSIDE THE DECISIONS.</p>
          <h2 id="blog-title"><span className="blog-line"><span>SAME KIT.</span></span><span className="blog-line"><span>DIFFERENT</span></span><span className="blog-line"><span><em>GAME.</em></span></span></h2>
        </div>
        <div className="blog-editor-note"><span className="blog-note-number" aria-hidden="true">01↗</span><p>The core route. The alliance split. The ideas that still need testing.</p><p>Our working HYPERDRIVE strategy, straight from the team.</p><span className="mono">STRATEGY / KIT / PRACTICE</span></div>
      </div>
      <a className="blog-launch" href="/season-plan"><span><small className="mono">GET INTO IT</small><strong>OPEN THE FIELD NOTES</strong></span><span className="blog-launch-arrow"><ArrowUpRight aria-hidden="true" /></span></a>
      <div className="blog-running-type mono" aria-hidden="true">READ THE GAME. MAKE THE CALL. REPEAT. <span>✳</span> READ THE GAME. MAKE THE CALL. REPEAT.</div>
    </section>
  );
}
