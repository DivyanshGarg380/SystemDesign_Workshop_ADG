import { motion } from 'framer-motion';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, Prompt, ChapterBreak } from '../stage';
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
      <SceneTitle
        eyebrow="Part 6 · Slow Background Work"
        title="Admins uploads a new question"
        sub="5000+ students should be notified"
      />

      <Node
        x={USER.x}
        y={USER.y}
        type="user"
        label="Professor"
        status="active"
      />

      {/* Server stays normal initially */}
      <Node
        x={SERVER.x}
        y={SERVER.y}
        type="server"
        label="Server"
        status="idle"
      />

      {/* Request starts */}
      {step >= 1 && (
        <Packet
          from={USER}
          to={SERVER}
          label="POST /upload"
          variant="request"
          duration={1.5}
        />
      )}

      {/* Only turn red after request reaches server */}
      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 1.5 },
          }}
        >
          <Node
            x={SERVER.x}
            y={SERVER.y}
            type="server"
            label="Server"
            status="overloaded"
          />
        </motion.div>
      )}

      {/* Notification work starts after request reaches server */}
      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 1.5 },
          }}
          className="absolute font-mono text-[20px] leading-relaxed"
          style={{
            left: 940,
            top: 400,
            color: 'var(--color-red)',
            width: 380,
          }}
        >
          sending notification 1 / 5000<br />
          sending notification 2 / 5000<br />
          sending notification 3 / 5000<br />
          <span style={{ color: 'var(--color-ink-600)' }}>
            … the request is still open …
          </span>
        </motion.div>
      )}

      <Prompt show={step >= 2}>
        Do we wait while 5,000 notifications are sent, one by one?
      </Prompt>
    </div>
  );
}

function QueueIntroScene({ step }: { step: number }) {
  const jobCount = step >= 2 ? 5 : 0;

  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 6 · Slow Background Work"
        title="Instead: hand the slow part to a queue"
        sub="The server responds immediately. The notifications happen separately."
      />

      <Node x={USER.x} y={USER.y} type="user" label="Admin" status="idle" />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" status="idle" />

      <Node
        x={QUEUE.x}
        y={QUEUE.y}
        type="queue"
        label="Queue"
        sublabel="5,000 jobs"
        status="active"
        badge={jobCount > 0 ? jobCount : undefined}
      />

      <EdgeLayer>
        <Edge from={SERVER} to={QUEUE} muted />
      </EdgeLayer>

      {/* 1. Admin sends request */}
      {step >= 1 && (
        <Packet
          from={USER}
          to={SERVER}
          label="POST /upload"
          variant="request"
          duration={1.5}
        />
      )}

      {/* 2. Server responds only AFTER receiving request */}
      {step >= 1 && (
        <Packet
          from={SERVER}
          to={USER}
          label="202 Accepted"
          variant="response"
          duration={1.2}
          delay={1.5}
        />
      )}

      {/* 3. Slow work gets handed to queue separately */}
      {step >= 2 &&
        Array.from({ length: jobCount }).map((_, i) => (
          <Packet
            key={i}
            from={SERVER}
            to={QUEUE}
            label="job"
            variant="job"
            small
            duration={0.5}
            delay={i * 0.15}
          />
        ))}

      {step >= 2 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 0.4 },
          }}
          className="absolute font-body text-[18px]"
          style={{
            left: 660,
            top: 700,
            color: "var(--color-teal)",
          }}
        >
          The admin already got a response. Work continues quietly, off to the side.
        </motion.p>
      )}
    </div>
  );
}

function WorkersScene({ step }: { step: number }) {
  const workers = [W1, W2, W3];

  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 6 · Slow Background Work"
        title="Workers pull jobs off the queue"
        sub="Several can work in parallel, at their own pace."
      />

      <Node
        x={QUEUE.x}
        y={QUEUE.y}
        type="queue"
        label="Queue"
        status={step < 2 ? 'active' : 'idle'}
        badge={step === 0 ? 12 : step === 1 ? 7 : 2}
      />

      {/* Workers start idle */}
      {workers.map((w, i) => (
        <Node
          key={`idle-${i}`}
          x={w.x}
          y={w.y}
          type="worker"
          label={`Worker ${i + 1}`}
          status="idle"
        />
      ))}

      <EdgeLayer>
        {workers.map((w, i) => (
          <Edge key={i} from={QUEUE} to={w} muted />
        ))}
      </EdgeLayer>

      {/* Queue sends jobs */}
      {step >= 1 && workers.map((w, i) => (
        <Packet
          key={`job-${i}`}
          from={QUEUE}
          to={w}
          label="job"
          variant="job"
          small
          duration={0.6}
          delay={i * 0.2}
        />
      ))}

      {/* Worker becomes active only after job arrives */}
      {step >= 1 && workers.map((w, i) => (
        <motion.div
          key={`active-${i}`}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              delay: i * 0.2 + 0.6,
              duration: 0.15,
            },
          }}
        >
          <Node
            x={w.x}
            y={w.y}
            type="worker"
            label={`Worker ${i + 1}`}
            status="active"
          />
        </motion.div>
      ))}

      {/* Each worker sends notification only after receiving its job */}
      {step >= 1 && workers.map((w, i) => (
        <Packet
          key={`notify-${i}`}
          from={w}
          to={{ x: 1560, y: w.y }}
          label="notify"
          variant="response"
          small
          duration={0.5}
          delay={i * 0.2 + 0.8}
        />
      ))}

      {step === 2 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute font-display font-semibold text-[20px]"
          style={{
            left: 220,
            top: 700,
            color: 'var(--color-teal)',
          }}
        >
          The queue drains steadily, no one waits, nothing is dropped.
        </motion.p>
      )}
    </div>
  );
}

function PubSubScene() {
  const SUBS = [
    { x: 1300, y: 250, label: 'Notifications' },
    { x: 1300, y: 480, label: 'Analytics' },
    { x: 1300, y: 710, label: 'Search Index' },
  ];

  const EVENT = { x: 850, y: 480 };

  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 6 · Slow Background Work"
        title="One event, several interested listeners"
        sub="Publish–subscribe: one 'question uploaded' event, many independent reactions."
      />

      <Node
        x={EVENT.x}
        y={EVENT.y}
        type="queue"
        label="Event: Question uploaded"
        size={110}
        status="active"
      />

      {/* Subscribers initially wait */}
      {SUBS.map((s, i) => (
        <Node
          key={`idle-${i}`}
          x={s.x}
          y={s.y}
          type="worker"
          label={s.label}
          status="idle"
        />
      ))}

      <EdgeLayer>
        {SUBS.map((s, i) => (
          <Edge key={i} from={EVENT} to={s} muted />
        ))}
      </EdgeLayer>

      {/* Event fans out independently */}
      {SUBS.map((s, i) => (
        <Packet
          key={`event-${i}`}
          from={EVENT}
          to={s}
          variant="job"
          small
          duration={0.7}
          delay={i * 0.15}
        />
      ))}

      {/* Each subscriber activates after receiving the event */}
      {SUBS.map((s, i) => (
        <motion.div
          key={`active-${i}`}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              delay: i * 0.15 + 0.7,
              duration: 0.15,
            },
          }}
        >
          <Node
            x={s.x}
            y={s.y}
            type="worker"
            label={s.label}
            status="healthy"
          />
        </motion.div>
      ))}
    </div>
  );
}

export const section5Scenes: SceneDef[] = [
  { id: 'chapter-queues', title: 'Chapter: Async Work & Queues', steps: 1, Component: () => (
    <ChapterBreak part="Part 6" title="Async Work & Queues" hook="Some work is too slow to make anyone wait for." />
  ), notes: 'Pause here. Let the room reset before diving in.' },
  { id: 'sync-problem', title: 'Synchronous work blocks', steps: 3, Component: SyncProblemScene },
  { id: 'queue-intro', title: 'The queue', steps: 3, Component: QueueIntroScene, notes: 'Core concept.' },
  { id: 'workers', title: 'Workers drain the queue', steps: 3, Component: WorkersScene },
  { id: 'pubsub', title: 'Publish-subscribe (brief)', steps: 1, Component: PubSubScene, optional: true, notes: 'Skippable if short on time. One line is enough.' },
];