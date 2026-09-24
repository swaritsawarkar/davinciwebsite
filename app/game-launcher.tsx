'use client';
import { usePathname } from 'next/navigation';
import { Gamepad2, MoveUpRight } from 'lucide-react';

export default function GameLauncher() {
  const pathname = usePathname();
  if (pathname === '/game') return null;
  return (
    <a className="game-launcher" href="/game" aria-label="Open the HYPERDRIVE Driver Lab">
      <span className="game-launcher-icon"><Gamepad2 size={18} /></span>
      <span>
        <small>HYPERDRIVE / LIVE</small>
        <strong>DRIVER LAB</strong>
      </span>
      <MoveUpRight size={18} />
    </a>
  );
}
