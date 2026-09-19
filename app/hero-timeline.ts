import type gsap from 'gsap';

type HeroTargets = {
  word: gsap.TweenTarget;
  number: gsap.TweenTarget;
  object: gsap.TweenTarget;
  details: gsap.TweenTarget;
  caption: gsap.TweenTarget;
};

// Explicit endpoints survive ScrollTrigger refreshes and reverse scrolling.
// The entrance animation belongs to inner elements, never these scroll targets.
export function populateHeroTimeline(
  timeline: gsap.core.Timeline,
  targets: HeroTargets,
) {
  return timeline
    .fromTo(
      targets.word,
      { xPercent: 0, scale: 1, opacity: 1 },
      {
        xPercent: -22,
        scale: 1.15,
        opacity: 0,
        ease: 'none',
        immediateRender: false,
      },
      0,
    )
    .fromTo(
      targets.number,
      { xPercent: 0, yPercent: 0, opacity: 1 },
      {
        xPercent: 45,
        yPercent: 20,
        opacity: 0,
        ease: 'none',
        immediateRender: false,
      },
      0,
    )
    .fromTo(
      targets.object,
      { scale: 1, rotation: 0, yPercent: 0, opacity: 1 },
      {
        scale: 3.5,
        rotation: 65,
        opacity: 0,
        ease: 'power2.in',
        immediateRender: false,
      },
      0,
    )
    .fromTo(
      targets.details,
      { opacity: 1, y: 0 },
      { opacity: 0, y: -35, immediateRender: false },
      0,
    )
    .fromTo(
      targets.caption,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, immediateRender: false },
      0.5,
    );
}
