import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowDown, ArrowLeft, ArrowUpRight, Crosshair, MoveUpRight } from 'lucide-react';
import './season-plan.css';
import PlanMotion from './plan-motion';
import GameBreakdown from './game-breakdown';

export const metadata: Metadata = {
  title: 'Field Notes: Same Kit. Different Game. | DaVinci 027',
  description:
    'Inside DaVinci 027’s NRL strategy: core cycles, alliance roles, separate lift and grab controls, and the tests before match day.',
};

const strategy = [
  { number: '01', title: 'CORES FIRST.', detail: 'Our opening priority is repeatable core delivery. Pick up, carry, place, reset. A clean cycle beats a rushed pickup that needs rescuing.' },
  { number: '02', title: 'SPLIT THE JOBS.', detail: 'Proposed alliance split: DaVinci runs the core route while our partner prepares the next task. Agree lanes and handoffs before the match. One robot, one scoring task at a time.' },
  { number: '03', title: 'EARN THE SWITCH.', detail: 'Our working sequence is four cores, then Starburst. Confirm the unlock condition against the official rules before treating it as a match call. The player checks progress; the driver stays on the route.' },
  { number: '04', title: 'RESET. GO AGAIN.', detail: 'A missed grip is a reset, not a new strategy. Back out, line up and repeat. Keep a fallback core route ready if the planned lane is blocked.' },
];

const build = [
  { label: '01 / DRIVE', title: 'Learn the kit.', text: 'We start from the shared NRL kit. Mark an approach route and practise the same turns, stops and placement until the driver can repeat them.', proof: 'LOG: cycle time + failed approaches' },
  { label: '02 / LIFT + GRAB', title: 'Two servos. Two jobs.', text: 'One servo lifts and lowers the arm. A separate servo opens and closes the grabber. Practise grip, lift, carry, lower and release as a controlled sequence.', proof: 'CHECK: clearance through full arm travel' },
  { label: '03 / EXPERIMENT', title: 'Prove it before play.', text: 'A two-core grabber is an idea to investigate, not an approved upgrade. Servo clearance, secure holding and permission under the kit rules all need checking first.', proof: 'BASELINE: reliable single-core handling' },
];

const phases = [
  ['01', 'CHECK', 'Verify scoring, the four-core gate and permitted kit changes.', 'A rules-backed match sequence.'],
  ['02', 'BASELINE', 'Run ten single-core cycles. Record time, misses and drops.', 'An honest starting point.'],
  ['03', 'SPLIT', 'Rehearse separate jobs and routes with our alliance partner.', 'Clear lanes and handoff calls.'],
  ['04', 'PRESSURE', 'Add a blocked route, a missed grip and a reset to practice.', 'A fallback the driver knows.'],
  ['05', 'REHEARSE', 'Run the full sequence and check the robot between attempts.', 'Repeatable match execution.'],
];

const skills = [
  ['BUILD', 'Mechanical design, assembly and repair'],
  ['CODE', 'Controls, debugging and reliable behaviour'],
  ['DRIVE', 'Precision, timing and match decisions'],
  ['COMMUNICATE', 'Clear handoffs, documentation and teamwork'],
];

const crew = [
  ['Swarit Sawarkar', 'Team Captain', 'Coordinate decisions, priorities and team progress.'],
  ['Aryansh Jajoo', 'Mechanical Head', 'Lead the robot build, mechanisms and repairs.'],
  ['Yash Agrawal', 'Programming / Software', 'Develop and debug the robot controls.'],
  ['Rohan Tharwani', 'Team Driver', 'Practise movement, control and match execution.'],
  ['Shaurya Ranjan', 'Main Player', 'Work with the driver on match play and rehearsals.'],
  ['Pragun Bhartiya', 'Marketing Head', 'Document the process and present our progress.'],
  ['Swarnika Sawarkar', 'Outreach & Communications', 'Connect the team with our wider community.'],
];

const goals = [
  ['01', 'Ten measured cycles', 'Record every attempt, including the drops. Compare consistency before speed.'],
  ['02', 'One clear handoff', 'Both alliance teams know who does what and when the job changes.'],
  ['03', 'A rehearsed reset', 'A missed pickup has a familiar response instead of a scramble.'],
  ['04', 'Evidence over claims', 'Publish what we actually test. Keep concepts separate from proven match choices.'],
];

export default function SeasonPlan() {
  return (
    <main className="plan-page" id="top">
      <PlanMotion />
      <a className="skip-link" href="#strategy">Skip to the plan</a>
      <header className="plan-nav">
        <a className="brand" href="/" aria-label="DaVinci 027 home">
          <Image unoptimized src="/media/logo.png" alt="" width={35} height={35} />
          <strong>DAVINCI<span>✳</span></strong><small>027</small>
        </a>
        <span className="plan-nav-marker mono">DAVINCI BLOG / FIELD NOTES</span>
        <a className="plan-nav-back" href="/"><ArrowLeft size={16} /> Back to site</a>
      </header>

      <section className="plan-hero" aria-labelledby="plan-title">
        <div className="plan-hero-grid" aria-hidden="true" />
        <div className="plan-hero-top mono">
          <span><i className="status-dot" /> DAVINCI / FIELD NOTES</span>
          <span>STRATEGY NOTE / 01</span>
        </div>
        <div className="plan-hero-copy">
          <p className="plan-kicker mono">HYPERDRIVE / OUR WORKING STRATEGY</p>
          <h1 id="plan-title"><span className="plan-title-line"><span>SAME KIT.</span></span><span className="plan-title-line"><em>OUR GAME.</em></span></h1>
          <p className="plan-lead">The kit is shared. The decisions are ours. Core cycles, alliance handoffs and a driver who knows the next move.</p>
          <a className="plan-scroll" href="#strategy"><span><ArrowDown size={20} /></span> Read the field notes</a>
        </div>
        <div className="plan-hero-stamp" aria-hidden="true"><Crosshair size={22} /><strong>027</strong><small>SEASON / 2026</small></div>
        <div className="plan-hero-bottom mono">
          <span>DESIGN. BUILD. AUTOMATE.</span><span>WORKING PLAN / SUBJECT TO TESTING</span>
        </div>
      </section>

      <div className="plan-index mono" aria-label="Plan sections">
        <a href="#strategy">01 / STRATEGY</a><a href="#robot">02 / ROBOT</a><a href="#timeline">03 / TIMELINE</a>
        <a href="#skills">04 / SKILLS</a><a href="#roles">05 / CREW</a><a href="#goals">06 / GOALS</a>
      </div>

      <section className="plan-section plan-strategy" id="strategy" aria-labelledby="strategy-title">
        <div className="plan-section-head mono"><span>01 / GAME PLAN</span><span>HYPERDRIVE</span></div>
        <div className="plan-heading-row"><h2 id="strategy-title">THINK.<br /><em>THEN MOVE.</em></h2><p>The advantage has to come from execution. This is the sequence we want to rehearse, with the four-core unlock still marked for a rulebook check.</p></div>
        <div className="strategy-grid">{strategy.map((item) => <article key={item.number}><span className="mono">{item.number} / 04</span><h3>{item.title}</h3><p>{item.detail}</p><span className="strategy-arrow" aria-hidden="true">↗</span></article>)}</div>
        <GameBreakdown />
      </section>

      <section className="plan-section plan-robot" id="robot" aria-labelledby="robot-title">
        <div className="plan-section-head mono"><span>02 / WORK WITH THE KIT</span><span>DRIVE / LIFT / GRAB</span></div>
        <div className="plan-heading-row"><h2 id="robot-title">BUILD.<br /><em>TEST. REPEAT.</em></h2><p>We do not need a different robot to practise a better match. Start with the kit, understand its limits, and test one change at a time.</p></div>
        <div className="plan-robot-visual" role="img" aria-label="Practice sequence: grip the core, lift and carry it, then place and release">
          <span className="mono plan-visual-label">DAVINCI / SYSTEM VIEW</span>
          <div className="plan-system"><span>GRIP</span><i aria-hidden="true" /><span>LIFT</span><i aria-hidden="true" /><span>PLACE</span></div>
          <span className="mono plan-visual-foot">GRABBER SERVO + ARM SERVO / SEPARATE CONTROLS. ONE CLEAN CYCLE.</span>
        </div>
        <div className="build-grid">{build.map((item) => <article key={item.label}><span className="mono">{item.label}</span><h3>{item.title}</h3><p>{item.text}</p><small className="mono">{item.proof}</small></article>)}</div>
      </section>

      <section className="plan-section plan-timeline" id="timeline" aria-labelledby="timeline-title">
        <div className="plan-section-head mono"><span>03 / SEASON TIMELINE</span><span>FIVE PHASES / ONE DIRECTION</span></div>
        <div className="plan-heading-row"><h2 id="timeline-title">NO SHORTCUTS.<br /><em>JUST STEPS.</em></h2><p>We move on when the last drill works. No invented lap times or promises. Each session should leave us with a result we can compare.</p></div>
        <div className="phase-list">{phases.map(([number, title, detail, result]) => <article key={number}><span className="phase-number mono">{number}</span><h3>{title}</h3><p>{detail}</p><span className="phase-result mono">OUTPUT → {result}</span></article>)}</div>
      </section>

      <section className="plan-section plan-skills" id="skills" aria-labelledby="skills-title">
        <div className="plan-section-head mono"><span>04 / SKILL BUILDING</span><span>PEOPLE ARE THE SYSTEM</span></div>
        <div className="plan-heading-row"><h2 id="skills-title">GET<br /><em>BETTER TOGETHER.</em></h2><p>The robot improves when we do. We practise the technical work and the handoffs that keep seven people moving as one.</p></div>
        <div className="skills-list">{skills.map(([title, detail], i) => <div key={title}><span className="mono">0{i + 1}</span><strong>{title}</strong><p>{detail}</p><span aria-hidden="true">✳</span></div>)}</div>
      </section>

      <section className="plan-section plan-roles" id="roles" aria-labelledby="roles-title">
        <div className="plan-section-head mono"><span>05 / RESPONSIBILITIES</span><span>SEVEN MINDS / CLEAR ROLES</span></div>
        <div className="plan-heading-row"><h2 id="roles-title">OWN THE<br /><em>PART YOU PLAY.</em></h2><p>These are the team’s roles and planned responsibilities. In the workshop and on the field, we help each other when the work calls for it.</p></div>
        <div className="roles-grid">{crew.map(([name, role, responsibility], i) => <article key={name}><span className="mono">DV / 0{i + 1}</span><h3>{name}</h3><strong>{role}</strong><p>{responsibility}</p></article>)}</div>
      </section>

      <section className="plan-section plan-goals" id="goals" aria-labelledby="goals-title">
        <div className="plan-section-head mono"><span>06 / COMPETITION GOALS</span><span>HOW WE DEFINE PROGRESS</span></div>
        <div className="plan-heading-row"><h2 id="goals-title">MAKE IT<br /><em>COUNT.</em></h2><p>Winning matters. We also need goals we can work towards every session and prove through testing and match practice.</p></div>
        <div className="goals-grid">{goals.map(([number, title, detail]) => <article key={number}><span className="mono">TARGET / {number}</span><h3>{title}</h3><p>{detail}</p></article>)}</div>
        <div className="plan-closing"><span className="mono">THE PLAN WILL CHANGE. THE WORK DOESN’T STOP.</span><strong><span>THEN DO IT</span> <em>BETTER.</em></strong><a href="/">Meet DaVinci <MoveUpRight size={23} /></a></div>
      </section>

      <footer className="plan-footer mono"><span>DAVINCI 027 · EMERALD HEIGHTS</span><a href="https://www.instagram.com/davincinrlofficial/" target="_blank" rel="noreferrer">FOLLOW THE JOURNEY <ArrowUpRight size={15} /></a><a href="#top">BACK TO TOP ↑</a></footer>
    </main>
  );
}
