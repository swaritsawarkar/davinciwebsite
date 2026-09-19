'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function MotionExtras({ enabled }: { enabled: boolean }) {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = cursor.current;
    const host = node?.closest('main');
    if (!enabled || !node || !host) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let context: gsap.Context | undefined;

    // Parent scroll scenes create their pin spacing before these accents measure it.
    const frame = requestAnimationFrame(() => {
      context = gsap.context(() => {
        gsap.to('.orbit-one', {
          rotationZ: '+=210',
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
        gsap.to('.orbit-two', {
          rotationZ: '-=150',
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
        const stage = host.querySelector<HTMLElement>('.build-stage');
        if (stage) {
          gsap.fromTo(
            '.robot-scanner',
            { y: 0, opacity: 0 },
            {
              y: () => stage.clientHeight,
              opacity: 0.85,
              ease: 'none',
              scrollTrigger: {
                trigger: '.build-scene',
                start: 'top 45%',
                end: 'bottom 35%',
                scrub: 0.7,
                invalidateOnRefresh: true,
              },
            },
          );
        }
        gsap.from('.footer-word span', {
          yPercent: 115,
          rotation: 12,
          stagger: 0.065,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.footer-word',
            start: 'top 96%',
            end: 'bottom 95%',
            scrub: 1,
          },
        });

        media.add('(hover: hover) and (pointer: fine)', () => {
          const followX = gsap.quickTo(node, 'x', {
            duration: 0.3,
            ease: 'power3.out',
          });
          const followY = gsap.quickTo(node, 'y', {
            duration: 0.3,
            ease: 'power3.out',
          });
          const sizeX = gsap.quickTo(node, 'scaleX', {
            duration: 0.3,
            ease: 'power3.out',
          });
          const sizeY = gsap.quickTo(node, 'scaleY', {
            duration: 0.3,
            ease: 'power3.out',
          });
          let inside = false;
          const pointer = (event: PointerEvent) => {
            if (event.pointerType === 'touch') return;
            if (!inside) {
              gsap.set(node, {
                x: event.clientX,
                y: event.clientY,
                opacity: 1,
              });
              inside = true;
            }
            followX(event.clientX);
            followY(event.clientY);
            const target =
              event.target instanceof Element ? event.target : null;
            const interactive = Boolean(
              target?.closest('a, button, .crew-card'),
            );
            node.classList.toggle('is-interactive', interactive);
            sizeX(interactive ? 1.9 : 1);
            sizeY(interactive ? 1.9 : 1);
          };
          const leave = () => {
            inside = false;
            gsap.set(node, { opacity: 0 });
          };
          window.addEventListener('pointermove', pointer, { passive: true });
          document.documentElement.addEventListener('pointerleave', leave);
          window.addEventListener('blur', leave);
          const removeListeners: Array<() => void> = [];

          host
            .querySelectorAll<HTMLElement>(
              '.nav-follow, .round-icon, .circle-cta, .crew-controls button, .back-top',
            )
            .forEach((element) => {
              const x = gsap.quickTo(element, 'x', {
                duration: 0.35,
                ease: 'power3.out',
              });
              const y = gsap.quickTo(element, 'y', {
                duration: 0.35,
                ease: 'power3.out',
              });
              const move = (event: PointerEvent) => {
                const box = element.getBoundingClientRect();
                x(
                  gsap.utils.clamp(
                    -9,
                    9,
                    (event.clientX - box.left - box.width / 2) * 0.18,
                  ),
                );
                y(
                  gsap.utils.clamp(
                    -9,
                    9,
                    (event.clientY - box.top - box.height / 2) * 0.18,
                  ),
                );
              };
              const reset = () => {
                x(0);
                y(0);
              };
              element.addEventListener('pointermove', move, { passive: true });
              element.addEventListener('pointerleave', reset);
              removeListeners.push(() => {
                element.removeEventListener('pointermove', move);
                element.removeEventListener('pointerleave', reset);
              });
            });

          host.querySelectorAll<HTMLElement>('.crew-card').forEach((card) => {
            const move = (event: PointerEvent) => {
              const box = card.getBoundingClientRect();
              const x = gsap.utils.clamp(
                0,
                1,
                (event.clientX - box.left) / box.width,
              );
              const y = gsap.utils.clamp(
                0,
                1,
                (event.clientY - box.top) / box.height,
              );
              card.style.setProperty('--shine-x', `${x * 100}%`);
              card.style.setProperty('--shine-y', `${y * 100}%`);
              card.style.setProperty('--tilt-x', `${(0.5 - y) * 8}deg`);
              card.style.setProperty('--tilt-y', `${(x - 0.5) * 8}deg`);
            };
            const reset = () => {
              card.style.setProperty('--tilt-x', '0deg');
              card.style.setProperty('--tilt-y', '0deg');
            };
            card.addEventListener('pointermove', move, { passive: true });
            card.addEventListener('pointerleave', reset);
            removeListeners.push(() => {
              card.removeEventListener('pointermove', move);
              card.removeEventListener('pointerleave', reset);
              reset();
            });
          });
          const skew = gsap.quickTo('.ticker-track', 'skewX', {
            duration: 0.2,
            ease: 'power2.out',
          });
          const settle = gsap.delayedCall(0.15, () => skew(0)).pause();
          ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => {
              skew(gsap.utils.clamp(-7, 7, self.getVelocity() / -500));
              settle.restart(true);
            },
          });
          return () => {
            window.removeEventListener('pointermove', pointer);
            document.documentElement.removeEventListener('pointerleave', leave);
            window.removeEventListener('blur', leave);
            removeListeners.forEach((remove) => remove());
            settle.kill();
            node.classList.remove('is-interactive');
          };
        });
      }, host);
    });
    return () => {
      cancelAnimationFrame(frame);
      media.revert();
      context?.revert();
    };
  }, [enabled]);

  return (
    <div ref={cursor} className="orbit-cursor" aria-hidden="true">
      <i />
    </div>
  );
}
