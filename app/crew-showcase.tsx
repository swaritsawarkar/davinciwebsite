'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

type Member = {
  id: string;
  first: string;
  last: string;
  role: string;
  tag: string;
  crop: string;
  color: string;
};
export default function CrewShowcase({
  members,
  motion,
  onNavigate,
}: {
  members: Member[];
  motion: boolean;
  onNavigate: (position: number) => void;
}) {
  const root = useRef<HTMLElement>(null),
    sequence = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const host = root.current;
    if (!host || !motion) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let context: gsap.Context | undefined;
    const frame = requestAnimationFrame(() => {
      context = gsap.context(() => {
        gsap.from('.crew-intro-line', {
          yPercent: 65,
          opacity: 0,
          rotation: 3,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.crew-header',
            start: 'top 85%',
            end: 'bottom 65%',
            scrub: 1,
          },
        });
        media.add('(min-width:900px) and (min-height:680px)', () => {
          const stage = host.querySelector<HTMLElement>('.crew-stage')!;
          const cards = Array.from(
            host.querySelectorAll<HTMLElement>('.crew-card'),
          );
          stage.classList.add('is-staged');
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: () => '+=' + innerHeight * 6.5,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
          sequence.current = timeline;
          gsap.set(cards, { autoAlpha: 0, pointerEvents: 'none' });
          gsap.set(cards[0], { autoAlpha: 1, pointerEvents: 'auto' });
          members.forEach((_, i) => {
            if (i === 0) return;
            const start = (i - 1) * 1.3 + 0.7;
            const card = cards[i],
              previous = cards[i - 1];
            timeline
              .fromTo(
                previous,
                { autoAlpha: 1, scale: 1, yPercent: 0, rotation: 0 },
                {
                  autoAlpha: 0,
                  scale: 0.84,
                  yPercent: -15,
                  rotation: i % 2 ? -7 : 7,
                  duration: 0.6,
                  ease: 'power2.in',
                  immediateRender: false,
                },
                start,
              )
              .set(previous, { pointerEvents: 'none' }, start)
              .set(card, { pointerEvents: 'auto' }, start + 0.3)
              .fromTo(
                card,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 0.35 },
                start + 0.15,
              )
              .fromTo(
                card.querySelector('.crew-portrait-shell'),
                { yPercent: 110, rotation: i % 2 ? 14 : -14, scale: 0.75 },
                {
                  yPercent: 0,
                  rotation: 0,
                  scale: 1,
                  duration: 0.65,
                  ease: 'power3.out',
                },
                start,
              )
              .fromTo(
                card.querySelectorAll('.member-name-line'),
                { yPercent: 120, rotation: 7 },
                {
                  yPercent: 0,
                  rotation: 0,
                  stagger: 0.065,
                  duration: 0.5,
                  ease: 'power3.out',
                },
                start + 0.1,
              )
              .fromTo(
                card.querySelector('.crew-member-index'),
                { scale: 1.5, rotation: -12 },
                { scale: 1, rotation: 0, duration: 0.7, ease: 'power2.out' },
                start,
              )
              .fromTo(
                card.querySelector('.crew-role'),
                { x: i % 2 ? -55 : 55, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.4 },
                start + 0.3,
              );
          });
          timeline.to({}, { duration: 0.7 }, 7.8);
          // Read the scrubbed playhead, so the roster marker follows the visible scene.
          timeline.eventCallback('onUpdate', () =>
            setActive(
              Math.min(
                6,
                Math.max(0, Math.floor((timeline.time() + 0.3) / 1.3)),
              ),
            ),
          );
          gsap.to('.crew-chapter-fill', {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: () => '+=' + innerHeight * 6.5,
              scrub: 0.3,
            },
          });
          return () => {
            sequence.current = null;
            stage.classList.remove('is-staged');
          };
        });
        media.add('(max-width:899px), (max-height:679px)', () => {
          host
            .querySelectorAll<HTMLElement>('.crew-card')
            .forEach((card, i) => {
              const reveal = gsap.timeline({
                scrollTrigger: { trigger: card, start: 'top 83%', once: true },
              });
              reveal
                .from(card.querySelector('.crew-portrait-shell'), {
                  y: 65,
                  rotation: i % 2 ? -7 : 7,
                  opacity: 0,
                  duration: 0.9,
                  ease: 'power3.out',
                })
                .from(
                  card.querySelectorAll('.member-name-line'),
                  {
                    yPercent: 105,
                    stagger: 0.07,
                    duration: 0.7,
                    ease: 'power3.out',
                  },
                  0.15,
                );
            });
        });
      }, host);
      ScrollTrigger.refresh();
    });
    return () => {
      cancelAnimationFrame(frame);
      media.revert();
      context?.revert();
      sequence.current = null;
    };
  }, [members, motion]);
  const go = (index: number) => {
    const next = Math.max(0, Math.min(6, index));
    const timeline = sequence.current,
      trigger = timeline?.scrollTrigger;
    if (timeline && trigger) {
      const progress = (next * 1.3 + 0.1) / timeline.duration();
      onNavigate(trigger.start + (trigger.end - trigger.start) * progress);
    } else
      document.getElementById(members[next].id)?.scrollIntoView({
        behavior: motion ? 'smooth' : 'instant',
        block: 'start',
      });
  };
  return (
    <section
      ref={root}
      className="crew-section crew-showcase"
      id="team"
      aria-labelledby="crew-title"
    >
      <header className="crew-header">
        <span className="mono section-eyebrow">
          03 / THE PEOPLE BEHIND THE MACHINE
        </span>
        <h2 id="crew-title">
          <span className="crew-intro-line">SEVEN MINDS.</span>
          <span className="crew-intro-line">
            <em>ONE DAVINCI.</em>
          </span>
        </h2>
        <div className="crew-intro-bottom">
          <p>
            Different strengths. Same obsession.
            <br />
            Meet the people who make it move.
          </p>
          <span className="crew-intro-arrow" aria-hidden="true">
            <ArrowDown />
          </span>
        </div>
      </header>
      <div className="crew-stage">
        <div className="crew-stage-hud">
          <span className="mono">DAVINCI / HUMAN HARDWARE</span>
          <div className="crew-controls">
            <span className="mono" aria-live="polite">
              0{active + 1}
              <span className="dim"> / 07</span>
            </span>
            <button
              onClick={() => go(active - 1)}
              disabled={active === 0}
              aria-label="Previous team member"
            >
              <ArrowLeft />
            </button>
            <button
              onClick={() => go(active + 1)}
              disabled={active === 6}
              aria-label="Next team member"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
        <div className="crew-track">
          {members.map((m, i) => (
            <article
              className="crew-card"
              id={m.id}
              key={m.id}
              style={{ '--member-color': m.color } as CSSProperties}
              aria-label={`${m.first} ${m.last}, ${m.role}`}
            >
              <span className="crew-member-index" aria-hidden="true">
                0{i + 1}
              </span>
              <div className="crew-portrait-shell">
                <div className="card-top mono">
                  <span>{m.tag}</span>
                  <span>DV / 0{i + 1}</span>
                </div>
                <div className="portrait-window">
                  <svg
                    viewBox={m.crop}
                    preserveAspectRatio="xMidYMid slice"
                    className="portrait-image"
                    aria-hidden="true"
                  >
                    <image
                      href={`/media/${m.id}.png`}
                      width="1254"
                      height="1254"
                    />
                  </svg>
                  <span className="portrait-cross" aria-hidden="true">
                    +
                  </span>
                </div>
                <span className="photo-edge-label mono">
                  EMERALD HEIGHTS / TEAM 027
                </span>
              </div>
              <div className="card-bottom">
                <span className="crew-member-kicker mono">
                  THE MIND BEHIND / 0{i + 1}
                </span>
                <h3>
                  <span className="name-mask">
                    <span className="member-name-line">{m.first}</span>
                  </span>
                  <span className="name-mask">
                    <span className="member-name-line">
                      {m.last}
                      <span className="name-period">.</span>
                    </span>
                  </span>
                </h3>
                <p className="crew-role">
                  <span aria-hidden="true">↳</span>
                  {m.role}
                </p>
                <span className="member-signature mono">
                  DESIGN. BUILD. AUTOMATE.
                </span>
              </div>
            </article>
          ))}
        </div>
        <nav className="crew-chapters" aria-label="Jump to a team member">
          {members.map((m, i) => (
            <button
              key={m.id}
              className={active === i ? 'is-current' : ''}
              onClick={() => go(i)}
              aria-label={`Show ${m.first} ${m.last}`}
              aria-current={active === i ? 'step' : undefined}
            >
              <span className="chapter-number">0{i + 1}</span>
              <span>{m.first}</span>
              <i />
            </button>
          ))}
        </nav>
        <div className="crew-chapter-progress" aria-hidden="true">
          <div className="crew-chapter-fill" />
        </div>
      </div>
    </section>
  );
}
