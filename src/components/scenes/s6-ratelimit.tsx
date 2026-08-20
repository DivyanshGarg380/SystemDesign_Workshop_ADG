import { motion } from 'framer-motion';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, Prompt } from '../stage';
import { stagger } from '../../lib/helpers';
import type { SceneDef } from '../../lib/types';

const USER = { x: 240, y: 480 };
const GATE = { x: 620, y: 480 };
const AI = { x: 1050, y: 480 };

function AiProblemScene({ step }: { step: number }) {
  const delays = stagger(10, 0.09);
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 7 · AI-based Requests" title='LabXam adds "Explain this answer with AI."' sub="Each explanation is expensive to generate — real compute, real cost." />
      <Node x={USER.x} y={USER.y} type="user" label="One student" status={step >= 1 ? 'overloaded' : 'active'} />
      <Node x={AI.x} y={AI.y} type="worker" label="AI Service" status={step >= 1 ? 'overloaded' : 'idle'} />
      <EdgeLayer><Edge from={USER} to={AI} muted /></EdgeLayer>
      {step >= 1 && Array.from({ length: 10 }).map((_, i) => (
        <Packet key={i} from={USER} to={AI} label="explain this" variant="request" small duration={0.5} delay={delays[i]} />
      ))}
      {step >= 1 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1 } }} className="absolute font-mono text-[15px]" style={{ left: 380, top: 620, color: 'var(--color-red)' }}>
          … 500 requests, from a single student, in under a minute.
        </motion.p>
      )}
      <Prompt show={step >= 2}>What happens if one user sends 500 AI requests?</Prompt>
    </div>
  );
}

function RateLimitScene({ step }: { step: number }) {
  const delays = stagger(8, 0.14);
  const allowed = [0, 1, 2];
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 7 · AI-based Requests" title="A rate limit sits in front of expensive work." sub="Every student gets a fair share. No one can monopolise the AI service." />
      <Node x={USER.x} y={USER.y} type="user" label="Student" status="active" />
      <Node x={GATE.x} y={GATE.y} type="gate" label="Rate Limiter" sublabel="5 / min per user" status="active" />
      <Node x={AI.x} y={AI.y} type="worker" label="AI Service" status="healthy" />
      <EdgeLayer>
        <Edge from={USER} to={GATE} muted />
        <Edge from={GATE} to={AI} muted />
      </EdgeLayer>
      {step >= 1 && Array.from({ length: 8 }).map((_, i) => (
        <Packet key={i} from={USER} to={GATE} label={`req ${i + 1}`} variant="request" small duration={0.5} delay={delays[i]} />
      ))}
      {step >= 2 && Array.from({ length: 8 }).map((_, i) => (
        allowed.includes(i)
          ? <Packet key={`a${i}`} from={GATE} to={AI} label="ok" variant="request" small duration={0.5} delay={delays[i] + 0.4} />
          : <Packet key={`b${i}`} from={GATE} to={{ x: GATE.x, y: GATE.y + 140 }} label="429" variant="blocked" small duration={0.35} delay={delays[i] + 0.4} />
      ))}
      {step === 2 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.4 } }} className="absolute font-body text-[17px]" style={{ left: 500, top: 700, color: 'var(--color-ink-400)' }}>
          Excess requests are rejected early — cheaply — before they reach the expensive service.
        </motion.p>
      )}
    </div>
  );
}

function AiQueueCacheScene({ step }: { step: number }) {
  const QUEUE = { x: 820, y: 480 };
  const WORKER = { x: 1080, y: 480 };
  const CACHE = { x: 1350, y: 480 };
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 7 · AI-based Requests" title="Allowed requests still shouldn't block the user." sub="Queue it, process it, and cache the answer for the next student who asks the same thing." />
      <Node x={USER.x} y={USER.y} type="user" label="Student" status="idle" />
      <Node x={QUEUE.x} y={QUEUE.y} type="queue" label="AI Job Queue" status={step >= 1 ? 'active' : 'idle'} />
      <Node x={WORKER.x} y={WORKER.y} type="worker" label="AI Worker" status={step >= 2 ? 'active' : 'idle'} />
      <Node x={CACHE.x} y={CACHE.y} type="cache" label="Cache" sublabel="answer, by question" status={step >= 3 ? 'healthy' : 'idle'} />
      <EdgeLayer>
        <Edge from={USER} to={QUEUE} muted />
        <Edge from={QUEUE} to={WORKER} muted />
        <Edge from={WORKER} to={CACHE} muted />
      </EdgeLayer>
      {step >= 1 && <Packet from={USER} to={QUEUE} label="explain Q7" variant="request" duration={0.6} />}
      {step >= 1 && <Packet from={QUEUE} to={USER} label="202 — we'll notify you" variant="response" duration={0.6} delay={0.2} />}
      {step >= 2 && <Packet from={QUEUE} to={WORKER} label="job" variant="job" duration={0.6} />}
      {step >= 3 && <Packet from={WORKER} to={CACHE} label="store answer" variant="data" duration={0.6} />}
      {step >= 4 && <Packet from={CACHE} to={USER} label="answer ready" variant="response" duration={0.9} />}
      {step === 4 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1 } }} className="absolute font-display font-semibold text-[19px]" style={{ left: 700, top: 700, color: 'var(--color-teal)' }}>
          Next student asking the same question? Straight from the cache — no AI call at all.
        </motion.p>
      )}
    </div>
  );
}

export const section6Scenes: SceneDef[] = [
  { id: 'ai-problem', title: 'One user, 500 AI requests', steps: 3, Component: AiProblemScene },
  { id: 'rate-limit', title: 'Rate limiting', steps: 3, Component: RateLimitScene, notes: 'Core concept.' },
  { id: 'ai-queue-cache', title: 'Queue, worker, cache — together', steps: 5, Component: AiQueueCacheScene, notes: 'Nice moment to show concepts composing.' },
];
