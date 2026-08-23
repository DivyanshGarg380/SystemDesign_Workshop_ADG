import { motion } from 'framer-motion';
import { ScrollText, Gauge, Radio } from 'lucide-react';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, ChapterBreak } from '../stage';
import type { SceneDef } from '../../lib/types';

const USER = { x: 190, y: 480 };
const LB = { x: 460, y: 480 };
const SERVER = { x: 730, y: 480 };
const CACHE = { x: 1000, y: 330 };
const DB = { x: 1000, y: 630 };

function TraceScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 12 · Optional, Knowing What's Broken" title="One request, moving through many components." sub="It touches the balancer, the server, the cache, and the database. If it's slow, where do you even look?" />
      <Node x={USER.x} y={USER.y} type="user" label="Student" status="idle" size={72} />
      <Node x={LB.x} y={LB.y} type="loadbalancer" label="LB" status="idle" size={72} />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" status="idle" size={72} />
      <Node x={CACHE.x} y={CACHE.y} type="cache" label="Cache" status="idle" size={72} />
      <Node x={DB.x} y={DB.y} type="database" label="Database" status="idle" size={72} />
      <EdgeLayer>
        <Edge from={USER} to={LB} muted />
        <Edge from={LB} to={SERVER} muted />
        <Edge from={SERVER} to={CACHE} muted />
        <Edge from={SERVER} to={DB} muted />
      </EdgeLayer>
      {step === 1 && <Packet from={USER} to={LB} variant="request" duration={1} small />}
      {step === 2 && <Packet from={LB} to={SERVER} variant="request" duration={1} small />}
      {step === 3 && <Packet from={SERVER} to={CACHE} variant="request" duration={1} small />}
      {step === 4 && <Packet from={CACHE} to={SERVER} label="miss" variant="blocked" duration={0.7} small />}
      {step === 5 && <Packet from={SERVER} to={DB} variant="request" duration={1} small />}
      {step === 6 && <Packet from={DB} to={USER} label="finally, a response" variant="response" duration={1.3} />}
    </div>
  );
}

function BreakdownScene({ step }: { step: number }) {
  const items = [
    { key: 'logs', label: 'Logs', Icon: ScrollText, desc: '"cache miss for key exam:4 at 23:41:02": individual events, exact and detailed.' },
    { key: 'metrics', label: 'Metrics', Icon: Gauge, desc: 'requests/sec, error rate, p99 latency: numbers, tracked over time.' },
    { key: 'trace', label: 'Tracing', Icon: Radio, desc: 'the full path one request took, hop by hop, with timing for each.' },
  ] as const;
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 12 · Optional" title="Three different lenses on the same system." />
      <div className="absolute left-[130px] top-[280px] flex gap-10">
        {items.map(({ key, label, Icon, desc }, i) => {
          const active = step >= i;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: active ? 1 : 0.35, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-start gap-5 w-[380px] rounded-2xl p-8"
              style={{ background: 'var(--color-panel)', border: `1.5px solid ${active ? 'var(--color-teal)' : 'var(--color-line)'}`, boxShadow: '0 1px 3px rgba(20,24,29,0.06)' }}
            >
              <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-panel-2)', border: `2px solid ${active ? 'var(--color-teal)' : 'var(--color-line)'}` }}>
                <Icon size={32} color={active ? 'var(--color-teal)' : 'var(--color-ink-400)'} strokeWidth={1.75} />
              </div>
              <div>
                <div className="font-display font-semibold text-[22px]" style={{ color: 'var(--color-ink-100)' }}>{label}</div>
                <p className="font-body text-[15.5px] mt-2 leading-relaxed" style={{ color: 'var(--color-ink-400)' }}>{desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export const section11Scenes: SceneDef[] = [
  { id: 'chapter-observability', title: 'Chapter: Knowing What\u2019s Broken', steps: 1, Component: () => (
    <ChapterBreak part="Part 12 · Optional" title="Knowing What's Broken" hook="When something goes wrong, how do you even know?" />
  ), optional: true, notes: 'Pause here. Let the room reset before diving in.' },
  { id: 'trace', title: 'A request leaves a trail', steps: 7, Component: TraceScene, optional: true, notes: 'Each hop is its own click now — pace it with your narration.' },
  { id: 'breakdown', title: 'Logs, metrics, tracing', steps: 3, Component: BreakdownScene, optional: true },
];