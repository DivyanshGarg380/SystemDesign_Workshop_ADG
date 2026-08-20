import { motion } from 'framer-motion';
import { Node, Packet, EdgeLayer, Edge, SceneTitle } from '../stage';
import type { SceneDef } from '../../lib/types';

const USER = { x: 190, y: 480 };
const LB = { x: 460, y: 480 };
const SERVER = { x: 730, y: 480 };
const CACHE = { x: 1000, y: 330 };
const DB = { x: 1000, y: 630 };

function TraceScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 12 · Optional — Knowing What's Broken" title="One request, moving through many components." sub="It touches the balancer, the server, the cache, and the database. If it's slow, where do you even look?" />
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
      {step >= 1 && <Packet from={USER} to={LB} variant="request" duration={0.4} small />}
      {step >= 1 && <Packet from={LB} to={SERVER} variant="request" duration={0.4} delay={0.35} small />}
      {step >= 1 && <Packet from={SERVER} to={CACHE} variant="request" duration={0.4} delay={0.7} small />}
      {step >= 1 && <Packet from={CACHE} to={SERVER} label="miss" variant="blocked" duration={0.3} delay={1.05} small />}
      {step >= 1 && <Packet from={SERVER} to={DB} variant="request" duration={0.4} delay={1.35} small />}
      {step >= 1 && <Packet from={DB} to={USER} label="finally, a response" variant="response" duration={0.9} delay={1.7} />}
    </div>
  );
}

function BreakdownScene({ step }: { step: number }) {
  const items = [
    { key: 'logs', label: 'Logs', desc: '"cache miss for key exam:4 at 23:41:02" — individual events, exact and detailed.' },
    { key: 'metrics', label: 'Metrics', desc: 'requests/sec, error rate, p99 latency — numbers, tracked over time.' },
    { key: 'trace', label: 'Tracing', desc: 'the full path one request took, hop by hop, with timing for each.' },
  ] as const;
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 12 · Optional" title="Three different lenses on the same system." />
      <div className="absolute left-[130px] top-[240px] flex gap-14">
        {items.map((it, i) => (
          <motion.div
            key={it.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: step >= i ? 1 : 0.25, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative w-[420px] rounded-2xl p-6"
            style={{ background: 'var(--color-panel-2)', border: `1px solid ${step >= i ? 'var(--color-teal)' : 'var(--color-line)'}` }}
          >
            <Node x={210} y={70} type={it.key === 'logs' ? 'log' : it.key === 'metrics' ? 'metric' : 'trace'} label={it.label} status={step >= i ? 'healthy' : 'idle'} />
            <p className="font-body text-[15px] mt-16" style={{ color: 'var(--color-ink-400)' }}>{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export const section11Scenes: SceneDef[] = [
  { id: 'trace', title: 'A request leaves a trail', steps: 2, Component: TraceScene, optional: true },
  { id: 'breakdown', title: 'Logs, metrics, tracing', steps: 3, Component: BreakdownScene, optional: true },
];
