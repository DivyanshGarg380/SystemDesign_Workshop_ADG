import { motion } from 'framer-motion';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, MiniUser, Prompt, ChapterBreak } from '../stage';
import { grid, stagger } from '../../lib/helpers';
import type { SceneDef } from '../../lib/types';

const SERVER = { x: 900, y: 480 };
const DB = { x: 1350, y: 480 };
const USERS = grid(14, 320, 460, 4, 78);

function IntroScene({ step }: { step: number }) {
  const moments = [
    {
      word: 'ENDSEM',
      sub: 'Tomorrow morning',
      color: 'var(--color-amber)',
    },
    {
      word: '40 MARKS',
      sub: 'You really need those marks',
      color: 'var(--color-teal)',
    },
    {
      word: 'TENSION',
      sub: 'Everyone is looking for PYQs',
      color: 'var(--color-ink-100)',
    },
  ];

  const current = moments[Math.min(step, moments.length - 1)];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Small context */}
      <div
        className="absolute top-[60px] left-[64px] font-mono text-[25px] tracking-[0.2em] uppercase"
        style={{ color: 'var(--color-amber)' }}
      >
        Part 3 · Exam-Night Traffic
      </div>

      {/* Main sequence */}
      <motion.div
        key={current.word}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="text-center"
      >
        <div
          className="font-display font-semibold text-[112px] leading-none tracking-tight"
          style={{ color: current.color }}
        >
          {current.word}
        </div>

        <p
          className="font-body text-[24px] mt-7"
          style={{ color: 'var(--color-ink-400)' }}
        >
          {current.sub}
        </p>
      </motion.div>

      {/* Final reveal */}
      {step >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-[110px] text-center"
        >
          <div
            className="font-display font-semibold text-[36px]"
            style={{ color: 'var(--color-ink-100)' }}
          >
            And suddenly, everyone needs LabXam
          </div>

          <p
            className="font-body text-[20px] mt-3"
            style={{ color: 'var(--color-ink-400)' }}
          >
            The traffic spike begins
          </p>
        </motion.div>
      )}
    </div>
  );
}

function OverloadScene({ step }: { step: number }) {
  const delays = stagger(USERS.length, 0.06);
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 3 · Exam-Night Traffic" title="One server. Hundreds of requests, all at once." />
      {USERS.map((u, i) => <MiniUser key={i} x={u.x} y={u.y} delay={i * 0.03} />)}
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" status={step >= 1 ? 'overloaded' : 'idle'} />
      <Node x={DB.x} y={DB.y} type="database" label="Database" status="idle" />
      <EdgeLayer>
        <Edge from={SERVER} to={DB} muted />
      </EdgeLayer>
      {step >= 1 && USERS.map((u, i) => (
        <Packet key={i} from={u} to={SERVER} variant="request" small duration={0.8} delay={delays[i]} />
      ))}
      {step >= 1 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.2 } }} className="absolute font-body text-[20px]" style={{ left: 760, top: 660, color: 'var(--color-red)' }}>
          Requests pile up faster than the server can answer them.
        </motion.p>
      )}
      <Prompt show={step >= 2}>What do you think breaks first?</Prompt>
    </div>
  );
}

function VerticalScene({ step }: { step: number }) {
  const size = step >= 1 ? 150 : 96;
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 3 · Exam-Night Traffic" title="First instinct: make the server bigger." sub="More CPU, more RAM. This is vertical scaling." />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" sublabel={step >= 1 ? '16 vCPU · 64GB' : '2 vCPU · 4GB'} status={step >= 1 ? 'healthy' : 'idle'} size={size} />
      <Node x={DB.x} y={DB.y} type="database" label="Database" status="idle" />
      <EdgeLayer><Edge from={SERVER} to={DB} muted /></EdgeLayer>
      {step >= 2 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute font-body text-[20px] max-w-[560px]" style={{ left: 620, top: 690, color: 'var(--color-ink-400)' }}>
          It helps, for a while. But a single machine still has a ceiling,
          and if that one machine goes down, <b style={{ color: 'var(--color-red)' }}>everything</b> goes down with it.
        </motion.div>
      )}
    </div>
  );
}

const H_SERVERS = [{ x: 950, y: 260 }, { x: 950, y: 480 }, { x: 950, y: 700 }];

function HorizontalScene({ step }: { step: number }) {
  const rowServers = step === 0 ? [SERVER] : H_SERVERS;
  const DB = { x: 1350, y: 480 };
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 3 · Exam-Night Traffic" title="Instead: many ordinary servers." sub="This is horizontal scaling." />
      {rowServers.map((s, i) => (
        <Node key={i} x={s.x} y={s.y} type="server" label={step === 0 ? 'Server' : `Server ${i + 1}`} status="healthy" />
      ))}
      <Node x={DB.x} y={DB.y} type="database" label="Database" status="idle" />
      <EdgeLayer>
        {rowServers.map((s, i) => <Edge key={i} from={s} to={DB} muted />)}
      </EdgeLayer>
    </div>
  );
}

function LoadBalancerScene({ step }: { step: number }) {
  const LB = { x: 480, y: 480 };
  const servers = [{ x: 960, y: 260 }, { x: 960, y: 480 }, { x: 960, y: 700 }];
  const DB = { x: 1340, y: 480 };
  const delays = stagger(9, 0.12);
  const userPts = grid(9, 190, 460, 3, 68);

  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 3 · Exam-Night Traffic" title="Who decides which server gets each request?" />
      <Prompt show={step === 0}>If we add 3 servers, who decides where requests go?</Prompt>

      {step >= 1 && (
        <>
          {userPts.map((u, i) => <MiniUser key={i} x={u.x} y={u.y} delay={i * 0.03} />)}
          <Node x={LB.x} y={LB.y} type="loadbalancer" label="Load Balancer" status="active" />
          {servers.map((s, i) => <Node key={i} x={s.x} y={s.y} type="server" label={`Server ${i + 1}`} status="healthy" />)}
          <Node x={DB.x} y={DB.y} type="database" label="Database" status="idle" />
          <EdgeLayer>
            {userPts.map((u, i) => <Edge key={`u${i}`} from={u} to={LB} muted />)}
            {servers.map((s, i) => <Edge key={`s${i}`} from={LB} to={s} muted />)}
            {servers.map((s, i) => <Edge key={`d${i}`} from={s} to={DB} muted />)}
          </EdgeLayer>
        </>
      )}

      {step === 2 && userPts.map((u, i) => (
        <Packet key={`p${i}`} from={u} to={LB} variant="request" small duration={0.6} delay={delays[i]} />
      ))}
      {step >= 3 && userPts.map((u, i) => (
        <span key={i}>
          <Packet from={u} to={LB} variant="request" small duration={0.01} />
          <Packet from={LB} to={servers[i % servers.length]} variant="request" small duration={0.7} delay={0.2 + delays[i] * 0.4} />
        </span>
      ))}
      {step >= 3 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.4 } }} className="absolute font-body text-[20px]" style={{ left: 500, top: 780, color: 'var(--color-teal)' }}>
          The load balancer spreads requests evenly. No single server drowns.
        </motion.p>
      )}
    </div>
  );
}

export const section2Scenes: SceneDef[] = [
  { id: 'chapter-scaling', title: 'Chapter: Exam-Night Traffic', steps: 1, Component: () => (
    <ChapterBreak part="Part 3" title="Exam-Night Traffic" hook="Scaling: what happens when everyone shows up at once." />
  ), notes: 'Pause here. Let the room reset before diving in.' },
  { id: 'exam-night-intro', title: 'Exam-night traffic', steps: 4, Component: IntroScene },
  { id: 'overload', title: 'One server floods', steps: 3, Component: OverloadScene, notes: 'Let the room shout guesses before advancing.' },
  { id: 'vertical', title: 'Vertical scaling', steps: 3, Component: VerticalScene },
  { id: 'horizontal', title: 'Horizontal scaling', steps: 2, Component: HorizontalScene },
  { id: 'load-balancer', title: 'The load balancer', steps: 4, Component: LoadBalancerScene, notes: 'Core concept, take your time.' },
];