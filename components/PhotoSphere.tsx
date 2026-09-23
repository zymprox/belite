'use client';
import { useEffect, useRef, useState } from 'react';
import { Move, Pause, Play } from 'lucide-react';
import type { Memory } from '@/lib/memories';
type Props = { memories: Memory[]; onSelect: (memory: Memory) => void; reducedMotion: boolean };
export default function PhotoSphere({ memories, onSelect, reducedMotion }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rotation = useRef({ x: -9, y: 0 });
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const count = Math.max(18, Math.min(memories.length * 3, 42));
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let frame = 0; let last = 0;
    const tick = (time: number) => {
      if (!paused && !reducedMotion && !drag.current && visible) rotation.current.y += Math.min(time - (last || time), 40) * .007;
      last = time;
      if (stage.current) stage.current.style.transform = `rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, reducedMotion, visible]);
  return <div className="sphere-experience" ref={root}>
    <div className="sphere-viewport" aria-label="Interactive photo sphere. Drag to rotate or use arrow keys." role="group" tabIndex={0}
      onKeyDown={e => { if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) { e.preventDefault(); rotation.current.y += e.key === 'ArrowLeft' ? -12 : e.key === 'ArrowRight' ? 12 : 0; rotation.current.x = Math.max(-65, Math.min(65, rotation.current.x + (e.key === 'ArrowUp' ? -10 : e.key === 'ArrowDown' ? 10 : 0))); } }}
      onPointerDown={e => { drag.current = { x: e.clientX, y: e.clientY, moved: false }; }}
      onPointerMove={e => { if (!drag.current) return; const dx = e.clientX - drag.current.x; const dy = e.clientY - drag.current.y; if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true; rotation.current.y += dx * .35; rotation.current.x = Math.max(-65, Math.min(65, rotation.current.x - dy * .25)); drag.current.x = e.clientX; drag.current.y = e.clientY; }}
      onPointerUp={() => { window.setTimeout(() => { drag.current = null; }, 0); }} onPointerLeave={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
      <div className="sphere-orbit orbit-one"/><div className="sphere-orbit orbit-two"/>
      <div className="sphere-stage" ref={stage}>
        {Array.from({ length: count }, (_, i) => {
          const phi = Math.acos(1 - 2 * (i + .5) / count); const theta = Math.PI * (1 + Math.sqrt(5)) * i;
          const latitude = phi * 180 / Math.PI - 90; const longitude = theta * 180 / Math.PI;
          const memory = memories[i % memories.length];
          return <button className="sphere-photo" key={i} style={{ transform: `translate(-50%, -50%) rotateY(${longitude}deg) rotateX(${latitude}deg) translateZ(var(--sphere-radius))` }} onClick={() => { if (!drag.current?.moved) onSelect(memory); }} aria-label={`View ${memory.title}`} tabIndex={i < memories.length ? 0 : -1}><img src={memory.src} alt="" draggable={false} loading="lazy" style={{ objectPosition: memory.position }}/></button>;
        })}
      </div>
    </div>
    <div className="sphere-controls"><span><Move size={14}/> Drag to explore your little universe</span><button className="round-button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Rotate photo sphere' : 'Pause photo sphere'}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button></div>
  </div>;
}
