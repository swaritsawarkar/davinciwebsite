import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import './game.css';

export const metadata: Metadata = {
  title: 'HYPERDRIVE Driver Lab | DaVinci 027',
  description: 'Practice driving the DaVinci NRL robot in the HYPERDRIVE field simulator.',
};

export default function GamePage() {
  return (
    <main className="driver-lab-page">
      <header className="driver-lab-nav">
        <a className="driver-lab-brand" href="/" aria-label="Back to DaVinci 027">
          <Image unoptimized src="/media/logo.png" alt="" width={34} height={34} />
          <strong>DAVINCI<span>✳</span></strong><small>027</small>
        </a>
        <div className="driver-lab-meta">
          <span>HYPERDRIVE / DRIVER LAB</span>
          <span>FREE PRACTICE / 2026</span>
        </div>
        <a className="driver-lab-back" href="/"><ArrowLeft size={16} /> Back to site</a>
      </header>

      <section className="driver-lab-intro">
        <div>
          <p className="driver-lab-kicker">SIMULATOR / 01</p>
          <h1>DRIVE IT.<br /><em>BEFORE MATCH DAY.</em></h1>
        </div>
        <div className="driver-lab-copy">
          <p>Same HYPERDRIVE field. Same lift and grab controls. Use keyboard or a DualSense controller and practise the route before the robot hits the arena.</p>
          <span>CLICK INSIDE THE GAME BEFORE USING CONTROLS.</span>
        </div>
      </section>

      <section className="driver-lab-frame-wrap" aria-label="Embedded HYPERDRIVE simulator">
        <div className="driver-lab-frame-head">
          <span><i /> SIMULATOR ONLINE</span>
          <span>WASD / DUALSENSE</span>
          <a href="/hyperdrive/index.html" target="_blank" rel="noreferrer">Open standalone <Maximize2 size={14} /></a>
        </div>
        <iframe
          className="driver-lab-frame"
          src="/hyperdrive/index.html"
          title="HYPERDRIVE Driver Lab simulator"
          allow="gamepad; fullscreen"
          allowFullScreen
        />
      </section>

      <footer className="driver-lab-footer">
        <span>DAVINCI 027 / EMERALD HEIGHTS</span>
        <span>DESIGN. BUILD. AUTOMATE.</span>
      </footer>
    </main>
  );
}
