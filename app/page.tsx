'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {
  ArrowUpRight,
  ArrowDown,
  Volume2,
  VolumeX,
  Pause,
  Play,
  MoveUpRight,
  Plus,
} from 'lucide-react';
import BlogPortal from './blog-portal';
import EnergyField from './energy-field';
import MotionExtras from './motion-extras';
import CrewShowcase from './crew-showcase';
import { populateHeroTimeline } from './hero-timeline';

const subscribeToHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

const crew = [
  {
    id: 'swarit',
    first: 'Swarit',
    last: 'Sawarkar',
    role: 'Team Captain',
    tag: 'LEAD THE WAY',
    crop: '790 110 390 520',
    color: '#5364ff',
  },
  {
    id: 'pragun',
    first: 'Pragun',
    last: 'Bhartiya',
    role: 'Marketing Head',
    tag: 'TURN UP THE SIGNAL',
    crop: '685 215 360 480',
    color: '#ff41b7',
  },
  {
    id: 'aryansh',
    first: 'Aryansh',
    last: 'Jajoo',
    role: 'Mechanical Head',
    tag: 'MAKE IT REAL',
    crop: '235 170 255 340',
    color: '#c3ccff',
  },
  {
    id: 'yash',
    first: 'Yash',
    last: 'Agrawal',
    role: 'Programming / Software',
    tag: 'THINK IN LOGIC',
    crop: '665 40 405 540',
    color: '#5364ff',
  },
  {
    id: 'swarnika',
    first: 'Swarnika',
    last: 'Sawarkar',
    role: 'Outreach & Communications',
    tag: 'CONNECT THE DOTS',
    crop: '245 195 300 400',
    color: '#ff41b7',
  },
  {
    id: 'rohan',
    first: 'Rohan',
    last: 'Tharwani',
    role: 'Driver',
    tag: 'OWN EVERY MOVE',
    crop: '133 125 345 460',
    color: '#c3ccff',
  },
  {
    id: 'shaurya',
    first: 'Shaurya',
    last: 'Ranjan',
    role: 'Main Player',
    tag: 'BRING THE ENERGY',
    crop: '675 170 360 480',
    color: '#5364ff',
  },
];
const instagram = 'https://www.instagram.com/davincinrlofficial/';

export default function Home() {
  // No server-rendered video for browser extensions to wrap before hydration.
  const videoReady = useSyncExternalStore(
    subscribeToHydration,
    clientReady,
    serverReady,
  );
  const root = useRef<HTMLElement>(null),
    video = useRef<HTMLVideoElement>(null),
    lenisRef = useRef<Lenis | null>(null);
  const [motion, setMotion] = useState(true),
    [muted, setMuted] = useState(true),
    [paused, setPaused] = useState(false);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const q = matchMedia('(prefers-reduced-motion: reduce)');
    const frame = requestAnimationFrame(() => {
      if (q.matches) {
        setMotion(false);
        setPaused(true);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const lenis = motion
      ? new Lenis({ lerp: 0.075, smoothWheel: true, anchors: { offset: -85 } })
      : null;
    lenisRef.current = lenis;
    const tick = (t: number) => lenis?.raf(t * 1000);
    if (lenis) {
      lenis.on('scroll', () => ScrollTrigger.update());
      gsap.ticker.add(tick);
    }
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      if (!motion) return;
      gsap.from('.hero-word span', {
        yPercent: 110,
        rotate: 5,
        stagger: 0.05,
        duration: 1.1,
        ease: 'power4.out',
      });
      gsap.from('.hero-object-enter', {
        scale: 0.7,
        opacity: 0,
        rotate: -20,
        duration: 1.5,
        ease: 'power3.out',
      });
      gsap.from('.hero-bottom > div,.hero-meta > span', {
        opacity: 0,
        y: 15,
        delay: 0.5,
        duration: 0.8,
      });
      mm.add('(min-width: 900px) and (min-height: 680px)', () => {
        const hero = gsap.timeline({
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '+=110%',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        populateHeroTimeline(hero, {
          word: host.querySelector('.hero-word')!,
          number: host.querySelector('.hero-number')!,
          object: host.querySelector('.hero-object')!,
          details: host.querySelectorAll('.hero-bottom,.hero-meta'),
          caption: host.querySelector('.portal-caption')!,
        });
        const assembly = gsap.timeline({
          scrollTrigger: {
            trigger: '.build-scene',
            start: 'top top',
            end: '+=170%',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        assembly
          .from(
            '.robot-slice-one',
            { xPercent: -55, yPercent: -25, rotate: -17, opacity: 0.1 },
            0,
          )
          .from(
            '.robot-slice-two',
            { yPercent: 60, rotate: 8, opacity: 0.1 },
            0,
          )
          .from(
            '.robot-slice-three',
            { xPercent: 55, yPercent: -20, rotate: 18, opacity: 0.1 },
            0,
          )
          .from('.robot-callout', { opacity: 0, y: 25, stagger: 0.15 }, 0.65)
          .to('.build-stage', { scale: 1.1, rotate: -4 }, 0.6)
          .to('.build-title span', { xPercent: 8, stagger: 0.1 }, 0)
          .to('.build-progress', { scaleX: 1, ease: 'none' }, 0);
      });
      mm.add('(max-width: 899px), (max-height: 679px)', () => {
        gsap.fromTo(
          '.hero-object',
          { yPercent: 0, rotation: 0, scale: 1, opacity: 1 },
          {
            yPercent: 20,
            rotation: 20,
            immediateRender: false,
            scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          },
        );
        gsap.from('.build-stage', {
          scale: 0.75,
          rotation: -12,
          scrollTrigger: {
            trigger: '.build-scene',
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          },
        });
      });
      gsap.utils.toArray<HTMLElement>('.manifesto-word').forEach((el, i) =>
        gsap.fromTo(
          el,
          { opacity: 0.18 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: '.manifesto',
              start: () => `top ${80 - i * 4}%`,
              end: () => `top ${65 - i * 4}%`,
              scrub: true,
            },
          },
        ),
      );
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) =>
        gsap.from(el, {
          y: 55,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        }),
      );
      gsap.to('.ticker-track', {
        xPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: '.ticker',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
      gsap.from('.reel-frame', {
        clipPath: 'inset(12% 18% round 100px)',
        scale: 0.88,
        scrollTrigger: {
          trigger: '.reel-section',
          start: 'top 80%',
          end: 'center center',
          scrub: 1,
        },
      });
      gsap.to('.footer-word', {
        xPercent: -5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.footer',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        },
      });
      gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.15 },
      });
    }, host);
    const resize = () => ScrollTrigger.refresh();
    void document.fonts.ready.then(resize);
    window.addEventListener('load', resize);
    return () => {
      mm.revert();
      ctx.revert();
      lenis?.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(tick);
      window.removeEventListener('load', resize);
    };
  }, [motion]);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    el.muted = muted;
    if (paused) {
      el.pause();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => setPaused(true));
        else el.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [muted, paused, videoReady]);
  const toggleSound = () => {
    const el = video.current;
    if (!el) return;
    el.muted = !muted;
    setMuted(!muted);
    setPaused(false);
    void el.play().catch(() => setPaused(true));
  };
  const moveEmblem = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!motion || event.pointerType === 'touch') return;
    const b = event.currentTarget.getBoundingClientRect();
    gsap.to('.hero-logo', {
      rotateY: (event.clientX - b.left - b.width / 2) / 25,
      rotateX: -(event.clientY - b.top - b.height / 2) / 25,
      duration: 0.6,
      ease: 'power2.out',
    });
  };
  return (
    <main
      ref={root}
      id="top"
      className={motion ? 'davinci-site' : 'davinci-site low-motion'}
    >
      <MotionExtras enabled={motion} />
      <a className="skip-link" href="#team">
        Skip to the team
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <header className="site-nav">
        <a className="brand" href="#top" aria-label="DaVinci 027 home">
          <Image
            unoptimized
            src="/media/logo.png"
            alt=""
            width="34"
            height="34"
          />
          <strong>
            DAVINCI<span>✳</span>
          </strong>
          <small>027</small>
        </a>
        <nav aria-label="Main navigation">
          <a href="#build">
            The build <span>01</span>
          </a>
          <a href="#team">
            The crew <span>02</span>
          </a>
          <a href="#in-motion">
            The energy <span>03</span>
          </a>
          <a href="/season-plan">
            The blog <span>04</span>
          </a>
        </nav>
        <a className="nav-plan-mobile" href="/season-plan">
          The blog <ArrowUpRight size={15} />
        </a>
        <a
          className="nav-follow"
          href={instagram}
          target="_blank"
          rel="noreferrer"
        >
          Follow the signal <ArrowUpRight size={17} />
        </a>
      </header>
      <section
        className="hero"
        aria-labelledby="hero-title"
        onPointerMove={moveEmblem}
        onPointerLeave={() => {
          if (motion)
            gsap.to('.hero-logo', {
              rotateX: 0,
              rotateY: 0,
              duration: 0.8,
              overwrite: 'auto',
            });
        }}
      >
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-meta mono">
          <span>
            <i className="status-dot" /> NATIONAL ROBOTICS LEAGUE
          </span>
          <span>EMERALD HEIGHTS / TEAM 027</span>
        </div>
        <h1 id="hero-title" className="hero-word" aria-label="DaVinci">
          {'DAVINCI'.split('').map((letter, i) => (
            <span key={i} aria-hidden="true">
              {letter}
            </span>
          ))}
        </h1>
        <div className="hero-number" aria-hidden="true">
          027<span>✳</span>
        </div>
        <div className="hero-object">
          <div className="hero-object-enter">
            <EnergyField enabled={motion} />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <Image
              unoptimized
              className="hero-logo"
              src="/media/logo.png"
              alt="Chrome DaVinci emblem"
              width="500"
              height="500"
            />
            <span className="object-coordinate mono">
              DV—027 / HUMAN POWERED
            </span>
          </div>
        </div>
        <div className="portal-caption" aria-hidden="true">
          <span>IDEAS IN.</span>
          <strong>ORDINARY OUT.</strong>
        </div>
        <div className="hero-bottom">
          <div>
            <p>
              Seven minds.
              <br />
              <span>Zero ordinary.</span>
            </p>
            <a className="round-link" href="#build">
              <span className="round-icon">
                <ArrowDown size={22} />
              </span>
              Enter the DaVinci orbit
            </a>
          </div>
          <div className="hero-note">
            <span className="mono">DESIGN. BUILD. AUTOMATE.</span>
            <p>
              Same starting kit.
              <br />
              Our own way through the arena.
            </p>
            <span className="scroll-hint mono">
              <i /> SCROLL TO EXPLORE
            </span>
          </div>
        </div>
      </section>
      <section className="manifesto" id="about">
        <div className="section-label mono">
          <span>01 / DIFFERENT MINDS. SAME FREQUENCY.</span>
          <Plus size={22} />
        </div>
        <h2>
          {'Same kit. Different decisions. Clean core runs. Clear alliance roles. Every move has a job.'
            .split(' ')
            .map((word, i) => (
              <span className="manifesto-word" key={i}>
                {word}{' '}
              </span>
            ))}
        </h2>
        <div className="manifesto-bottom">
          <span className="asterisk" aria-hidden="true">
            ✳
          </span>
          <p>
            DaVinci 027 brings together seven students from Emerald Heights for
            the National Robotics League. Our focus: controlled pickups, repeatable routes
            and knowing when to hand the next job to our alliance partner.
          </p>
          <a
            className="circle-cta"
            href="#team"
            aria-label="Meet our seven team members"
          >
            <ArrowDown size={28} />
          </a>
        </div>
      </section>
      <section className="build-scene" id="build">
        <div className="section-label mono">
          <span>02 / FROM THE IDEA TO THE ARENA</span>
          <span>DESIGN → BUILD → AUTOMATE</span>
        </div>
        <h2 className="build-title">
          <span>THINK IT.</span>
          <span>BUILD IT.</span>
          <span className="pink">SEND IT.</span>
        </h2>
        <div className="build-stage">
          <div className="blueprint-grid" />
          <div className="robot-scanner" aria-hidden="true" />
          <figure
            className="robot-composition"
            aria-label="Robot illustration based on the DaVinci team poster"
          >
            <div className="robot-slice robot-slice-one" />
            <div className="robot-slice robot-slice-two" />
            <div className="robot-slice robot-slice-three" />
          </figure>
          <span className="robot-callout callout-one mono">
            <i /> ONE SERVO / ARM LIFT
          </span>
          <span className="robot-callout callout-two mono">
            <i /> ONE SERVO / GRABBER
          </span>
          <span className="stage-number" aria-hidden="true">
            027
          </span>
        </div>
        <div className="build-bottom">
          <p>
            Grip. Lift. Carry.
            <br />
            Place. Reset. Repeat.
          </p>
          <span className="mono">
            DAVINCI / BUILD IN PROGRESS <span className="blink">●</span>
          </span>
        </div>
        <div className="build-progress" />
      </section>
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          HUMAN MINDS <span>✳</span> ROBOT MOVES <span>✳</span> HUMAN MINDS{' '}
          <span>✳</span> ROBOT MOVES <span>✳</span> HUMAN MINDS <span>✳</span>
        </div>
      </div>
      <BlogPortal motion={motion} />
      <CrewShowcase
        members={crew}
        motion={motion}
        onNavigate={(position) => {
          if (lenisRef.current)
            lenisRef.current.scrollTo(position, { duration: 1.2 });
          else window.scrollTo({ top: position, behavior: 'smooth' });
        }}
      />
      <section className="reel-section" id="in-motion">
        <div className="section-label mono reveal">
          <span>04 / FEEL THE FREQUENCY</span>
          <span>4 SECONDS / INFINITE ENERGY</span>
        </div>
        <div className="reel-heading reveal">
          <h2>
            SMALL TEAM.
            <br />
            <em>BIG ENERGY.</em>
          </h2>
          <div className="sound-invite">
            <span className="equalizer" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <p>
              A little DaVinci on repeat.
              <br />
              Sound on for the full hit.
            </p>
          </div>
        </div>
        <div className="reel-frame">
          {videoReady ? (
            <video
              ref={video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/media/sting-poster.jpg"
              aria-label="Four-second DaVinci motion sting with original electronic music"
            >
              <source src="/media/davinci-sting.mp4" type="video/mp4" />
            </video>
          ) : (
            <Image
              unoptimized
              className="reel-placeholder"
              data-video-placeholder="true"
              src="/media/sting-poster.jpg"
              width={1280}
              height={720}
              alt="DaVinci motion film"
            />
          )}
          <div className="reel-controls">
            <button
              disabled={!videoReady}
              onClick={() => setPaused(!paused)}
              aria-label={paused ? 'Play animation' : 'Pause animation'}
            >
              {paused ? <Play size={18} /> : <Pause size={18} />}
              <span>{paused ? 'PLAY' : 'PAUSE'}</span>
            </button>
            <button
              className="sound-button"
              disabled={!videoReady}
              onClick={toggleSound}
              aria-label={muted ? 'Turn music on' : 'Mute music'}
            >
              {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
              <span>{muted ? 'SOUND ON' : 'SOUND OFF'}</span>
            </button>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-top">
          <span className="mono">THE BUILD CONTINUES.</span>
          <a href="#top" className="back-top">
            Back to orbit <ArrowUpRight size={18} />
          </a>
        </div>
        <a
          className="footer-link"
          href={instagram}
          target="_blank"
          rel="noreferrer"
        >
          <span>
            KEEP UP WITH
            <br />
            <em>THE CHAOS.</em>
          </span>
          <MoveUpRight />
        </a>
        <a
          href={instagram}
          className="social-handle"
          target="_blank"
          rel="noreferrer"
        >
          @davincinrlofficial <ArrowUpRight size={20} />
        </a>
        <div className="footer-word" aria-hidden="true">
          {'DAVINCI✳'.split('').map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </div>
        <div className="footer-bottom">
          <span>DaVinci 027 · Emerald Heights</span>
          <a
            href="https://nrl.theinnovationstory.com/"
            target="_blank"
            rel="noreferrer"
          >
            National Robotics League ↗
          </a>
          <button
            onClick={() => {
              setMotion(!motion);
              if (motion) setPaused(true);
            }}
          >
            {motion ? 'Reduce motion' : 'Enable motion'}
          </button>
        </div>
      </footer>
    </main>
  );
}
