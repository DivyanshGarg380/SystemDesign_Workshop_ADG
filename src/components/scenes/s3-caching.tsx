import { motion } from 'framer-motion';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, MiniUser, Prompt } from '../stage';
import { grid, stagger } from '../../lib/helpers';
import type { SceneDef } from '../../lib/types';

const USER = { x: 260, y: 480 };
const SERVER = { x: 640, y: 480 };
const CACHE = { x: 1000, y: 320 };
const DB = { x: 1360, y: 480 };

function RepeatedScene({ step }: { step: number }) {
  const users = grid(8, 260, 480, 2, 90);
  const delays = stagger(8, 0.18);
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 3 · Repeated Requests" title='Every student asks for the same thing.' sub='"Show me last year\u2019s Data Structures lab exam."' />
      {users.map((u, i) => <MiniUser key={i} x={u.x} y={u.y} delay={i * 0.04} />)}
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" status={step >= 1 ? 'active' : 'idle'} />
      <Node x={DB.x} y={DB.y} type="database" label="Database" status={step >= 1 ? 'overloaded' : 'idle'} />
      <EdgeLayer><Edge from={SERVER} to={DB} muted /></EdgeLayer>
      {step >= 1 && users.map((u, i) => (
        <span key={i}>
          <Packet from={u} to={SERVER} variant="request" small duration={0.6} delay={delays[i]} />
          <Packet from={SERVER} to={DB} label="same query" variant="request" duration={0.6} delay={delays[i] + 0.5} />
        </span>
      ))}
      <Prompt show={step >= 2}>Why query the database the exact same way, a hundred times a minute?</Prompt>
    </div>
  );
}

function CacheMissScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 4 · Caching" title="First request: a cache miss." sub="Nothing is cached yet, so we still go all the way to the database." />
      <Node x={USER.x} y={USER.y} type="user" label="Student A" status={step === 0 ? 'active' : 'idle'} />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" status="idle" />
      <Node x={CACHE.x} y={CACHE.y} type="cache" label="Cache" sublabel="Redis · empty" status={step === 1 ? 'active' : 'idle'} />
      <Node x={DB.x} y={DB.y} type="database" label="Database" status={step === 2 ? 'active' : 'idle'} />
      <EdgeLayer>
        <Edge from={USER} to={SERVER} muted />
        <Edge from={SERVER} to={CACHE} muted />
        <Edge from={SERVER} to={DB} muted />
        <Edge from={CACHE} to={DB} muted dashed />
      </EdgeLayer>
      {step >= 0 && <Packet key={`m0-${step === 0}`} from={USER} to={SERVER} label="GET exam #4" variant="request" duration={step === 0 ? 1.1 : 0.01} />}
      {step >= 1 && <Packet key={`m1-${step === 1}`} from={SERVER} to={CACHE} label="have it?" variant="request" duration={step === 1 ? 1.1 : 0.01} />}
      {step === 2 && <Packet from={CACHE} to={SERVER} label="miss" variant="blocked" duration={0.35} small />}
      {step >= 2 && <Packet from={SERVER} to={DB} label="fetch it" variant="request" duration={1.1} delay={0.5} />}
      {step >= 3 && <Packet from={DB} to={SERVER} label="rows" variant="data" duration={1.1} />}
      {step >= 4 && <Packet from={SERVER} to={CACHE} label="store" variant="data" duration={1} />}
      {step >= 5 && <Packet from={SERVER} to={USER} label="200 OK" variant="response" duration={1.1} />}
      {step === 5 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.9 } }} className="absolute font-body text-[17px] max-w-[420px]" style={{ left: 850, top: 700, color: 'var(--color-ink-400)' }}>
          Slow, but next time, the cache already has the answer.
        </motion.p>
      )}
    </div>
  );
}

function CacheHitScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 4 · Caching" title="Second request: a cache hit." sub="Same question, a different student. This time, we never touch the database." />
      <Node x={USER.x} y={USER.y} type="user" label="Student B" status={step === 0 ? 'active' : 'idle'} />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" status="idle" />
      <Node x={CACHE.x} y={CACHE.y} type="cache" label="Cache" sublabel="Redis · warm" status={step >= 1 ? 'healthy' : 'idle'} />
      <Node x={DB.x} y={DB.y} type="database" label="Database" status="muted" />
      <EdgeLayer>
        <Edge from={USER} to={SERVER} muted />
        <Edge from={SERVER} to={CACHE} active={step >= 1} />
        <Edge from={SERVER} to={DB} muted />
      </EdgeLayer>
      {step >= 0 && <Packet from={USER} to={SERVER} label="GET exam #4" variant="request" duration={0.6} />}
      {step >= 1 && <Packet from={SERVER} to={CACHE} label="have it?" variant="request" duration={0.5} />}
      {step >= 2 && <Packet from={CACHE} to={SERVER} label="hit!" variant="response" duration={0.5} />}
      {step >= 3 && <Packet from={SERVER} to={USER} label="200 OK, fast" variant="response" duration={0.5} />}
      {step === 3 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.7 } }} className="absolute font-display font-semibold text-[20px]" style={{ left: 700, top: 700, color: 'var(--color-teal)' }}>
          Shorter path. No database load. Same answer, far faster.
        </motion.p>
      )}
    </div>
  );
}

export const section3Scenes: SceneDef[] = [
  { id: 'repeated-requests', title: 'Repeated requests', steps: 3, Component: RepeatedScene },
  { id: 'cache-miss', title: 'Cache miss', steps: 6, Component: CacheMissScene, notes: 'Walk each hop slowly the first time.' },
  { id: 'cache-hit', title: 'Cache hit', steps: 4, Component: CacheHitScene, notes: 'Contrast the path length against the miss scene.' },
];