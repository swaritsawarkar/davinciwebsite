'use client';

import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

const calls = [
  { title: 'LINE UP THE FIRST RUN.', detail: 'Pick one core route. Approach square, close the grabber, then lift. The arm and grabber have separate controls.', driver: 'Approach → grip → lift', partner: 'Agree separate routes before the opening run.' },
  { title: 'ONE PLACED. RESET.', detail: 'Lower, release, then clear the placement area. Return along the agreed route before lining up the next pickup.', driver: 'Place → clear → return', partner: 'Keep the return lane clear; call any obstruction.' },
  { title: 'REPEAT THE CLEAN CYCLE.', detail: 'Two deliveries in this walkthrough. Keep the pickup sequence consistent. A dropped core needs a recovery call, not a rushed second attempt.', driver: 'Repeat the same approach', partner: 'Call a blocked lane early so both robots can adjust.' },
  { title: 'FINISH THE CORE JOB.', detail: 'Three deliveries in this walkthrough. Stay with the remaining core instead of leaving the opening task unfinished.', driver: 'Complete the fourth delivery', partner: 'Confirm who takes the Starburst task next.' },
  { title: 'CHECK. THEN SWITCH.', detail: 'Four cores placed in our working sequence. Confirm the Starburst access condition and field state before switching tasks. The next job belongs to one agreed robot.', driver: 'Clear the approach and call the handoff', partner: 'Take the agreed next task once access is confirmed.' },
];

export default function GameBreakdown() {
  const [cores, setCores] = useState(0);
  const call = calls[cores];
  return (
    <div className="game-breakdown">
      <div className="game-breakdown-top mono"><span>THE OPENING / STEP THROUGH IT</span><span>CONCEPT VIEW · NOT AN ARENA MAP</span></div>
      <div className="game-breakdown-grid">
        <div className="game-board">
          <div className="game-counter"><span className="mono">CORES PLACED</span><strong>{String(cores).padStart(2, '0')}<small>/04</small></strong></div>
          <div className="game-core-row" aria-label={`${cores} of four cores placed in this walkthrough`}>
            {[0, 1, 2, 3].map(index => <div key={index} className={`game-core ${index < cores ? 'is-placed' : ''}`}><span aria-hidden="true">{index < cores ? '✳' : '+'}</span><small className="mono">CORE 0{index + 1}</small></div>)}
          </div>
          <div className={`game-starburst ${cores === 4 ? 'is-ready' : ''}`}><span className="game-starburst-icon" aria-hidden="true">✳</span><div><span className="mono">NEXT OBJECTIVE</span><strong>STARBURST</strong><p>{cores === 4 ? 'Check access. Call the handoff.' : 'Finish the core sequence first.'}</p></div></div>
          <p className="game-board-note mono">Working assumption: four cores before Starburst. Official unlock condition still to be verified.</p>
        </div>
        <div className="game-call">
          <div className="game-call-copy" aria-live="polite" aria-atomic="true"><span className="mono">DRIVER CALL / 0{cores + 1}</span><h3>{call.title}</h3><p>{call.detail}</p></div>
          <dl className="game-alliance"><div><dt className="mono">DAVINCI / CORE RUN</dt><dd>{call.driver}</dd></div><div><dt className="mono">PARTNER / AGREED SUPPORT</dt><dd>{call.partner}</dd></div></dl>
          <div className="game-controls"><button type="button" className="game-next" disabled={cores === 4} onClick={() => setCores(value => Math.min(4, value + 1))}>{cores === 4 ? 'SEQUENCE COMPLETE' : 'PLACE A CORE'}<ArrowRight size={19} aria-hidden="true" /></button><button type="button" className="game-reset" onClick={() => setCores(0)} disabled={cores === 0} aria-label="Reset core walkthrough"><RotateCcw size={19} aria-hidden="true" /></button></div>
          <span className="game-controls-note mono">ILLUSTRATIVE WALKTHROUGH / NOT A LIVE MATCH SCORE</span>
        </div>
      </div>
    </div>
  );
}
