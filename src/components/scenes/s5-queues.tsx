import { motion } from 'framer-motion';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, Prompt } from '../stage';
import type { SceneDef } from '../../lib/types';

const USER = { x: 260, y: 480 };
const SERVER = { x: 720, y: 480 };
const QUEUE = { x: 1120, y: 480 };
const W1 = { x: 1420, y: 250 };
const W2 = { x: 1420, y: 480 };
const W3 = { x: 1420, y: 710 };

function SyncProblemScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 6 · Slow Background Work" title="A professor uploads a new exam." sub="5,000 enrolled students should be notified." />
      <Node x={USER.x} y={USER.y} type="user" label="Professor" status="active" />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" status={step >= 1 ? 'overloaded' : 'idle'} />
      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute font-mono text-[15px] leading-relaxed"
          style={{ left: 940, top: 400, color: 'var(--color-red)', width: 380 }}
        >
          sending notification 1 / 5000<br />
          sending notification 2 / 5000<br />
          sending notification 3 / 5000<br />
          <span style={{ color: 'var(--color-ink-600)' }}>… the request is still open …</span>
        </motion.div>
      )}
      {step >= 1 && <Packet from={USER} to={SERVER} label="POST /upload" variant="request" duration={0.01} />}
      <Prompt show={step >= 2}>Should this professor wait while 5,000 notifications are sent, one by one?</Prompt>
    </div>
  );
}

function QueueIntroScene({ step }: { step: number }) {
  const jobCount = Math.min(step, 5);
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 6 · Slow Background Work" title="Instead: hand the slow part to a queue." sub="The server responds immediately. The notifications happen separately." />
      <Node x={USER.x} y={USER.y} type="user" label="Professor" status="idle" />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" status="idle" />
      <Node x={QUEUE.x} y={QUEUE.y} type="queue" label="Queue" sublabel="5,000 jobs" status="active" badge={jobCount > 0 ? jobCount : undefined} />
      <EdgeLayer><Edge from={SERVER} to={QUEUE} muted /></EdgeLayer>
      {step >= 1 && <Packet from={USER} to={SERVER} label="POST /upload" variant="request" duration={0.01} />}
      {step >= 1 && <Packet from={SERVER} to={USER} label="202 Accepted" variant="response" duration={0.6} />}
      {step >= 2 && Array.from({ length: jobCount }).map((_, i) => (
        <Packet key={i} from={SERVER} to={QUEUE} label="job" variant="job" small duration={0.5} delay={i * 0.15} />
      ))}
      {step >= 2 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.4 } }} className="absolute font-body text-[18px]" style={{ left: 660, top: 700, color: 'var(--color-teal)' }}>
          The professor already got a response. Work continues quietly, off to the side.
        </motion.p>
      )}
    </div>
  );
}

function WorkersScene({ step }: { step: number }) {
  const workers = [W1, W2, W3];
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 6 · Slow Background Work" title="Workers pull jobs off the queue." sub="Several can work in parallel, at their own pace." />
      <Node x={QUEUE.x} y={QUEUE.y} type="queue" label="Queue" status={step < 2 ? 'active' : 'idle'} badge={step === 0 ? 12 : step === 1 ? 7 : 2} />
      {workers.map((w, i) => (
        <Node key={i} x={w.x} y={w.y} type="worker" label={`Worker ${i + 1}`} status={step >= 1 ? 'active' : 'idle'} />
      ))}
      <EdgeLayer>{workers.map((w, i) => <Edge key={i} from={QUEUE} to={w} muted />)}</EdgeLayer>
      {step >= 1 && workers.map((w, i) => (
        <Packet key={i} from={QUEUE} to={w} label="job" variant="job" small duration={0.6} delay={i * 0.2} />
      ))}
      {step >= 1 && workers.map((w, i) => (
        <Packet key={`n${i}`} from={w} to={{ x: 1560, y: w.y }} label="notify" variant="response" small duration={0.5} delay={0.9 + i * 0.2} />
      ))}
      {step === 2 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute font-display font-semibold text-[20px]" style={{ left: 220, top: 700, color: 'var(--color-teal)' }}>
          The queue drains steadily, no one waits, nothing is dropped.
        </motion.p>
      )}
    </div>
  );
}

function PubSubScene() {
  const SUBS = [{ x: 1300, y: 250, label: 'Notifications' }, { x: 1300, y: 480, label: 'Analytics' }, { x: 1300, y: 710, label: 'Search Index' }];
  const EVENT = { x: 850, y: 480 };
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 6 · Optional" title="One event, several interested listeners." sub="Publish–subscribe: one 'exam uploaded' event, many independent reactions." />
      <Node x={EVENT.x} y={EVENT.y} type="queue" label="Event: exam uploaded" size={110} status="active" />
      {SUBS.map((s, i) => (
        <Node key={i} x={s.x} y={s.y} type="worker" label={s.label} status="healthy" />
      ))}
      <EdgeLayer>{SUBS.map((s, i) => <Edge key={i} from={EVENT} to={s} muted />)}</EdgeLayer>
      {SUBS.map((s, i) => <Packet key={i} from={EVENT} to={s} variant="job" small duration={0.7} delay={i * 0.15} />)}
    </div>
  );
}

export const section5Scenes: SceneDef[] = [
  { id: 'sync-problem', title: 'Synchronous work blocks', steps: 3, Component: SyncProblemScene },
  { id: 'queue-intro', title: 'The queue', steps: 3, Component: QueueIntroScene, notes: 'Core concept.' },
  { id: 'workers', title: 'Workers drain the queue', steps: 3, Component: WorkersScene },
  { id: 'pubsub', title: 'Publish-subscribe (brief)', steps: 1, Component: PubSubScene, optional: true, notes: 'Skippable if short on time. One line is enough.' },
];