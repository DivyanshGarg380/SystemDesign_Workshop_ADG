import { motion } from 'framer-motion';
import { FileText, Search, Users } from 'lucide-react';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, MiniUser } from '../stage';
import { grid } from '../../lib/helpers';
import type { SceneDef } from '../../lib/types';

const SERVER = { x: 800, y: 480 };
const DB = { x: 1250, y: 480 };

function SimpleAppScene({ step }: { step: number }) {
  const users = grid(6, 320, 460, 2, 90);
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 2 · What is System Design?" title="A small app: one server, one database." sub="For a handful of users, this is perfectly fine." />
      {users.map((u, i) => <MiniUser key={i} x={u.x} y={u.y} delay={i * 0.05} />)}
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" status="healthy" />
      <Node x={DB.x} y={DB.y} type="database" label="Database" status="healthy" />
      <EdgeLayer>
        <Edge from={{ x: 400, y: 460 }} to={SERVER} muted />
        <Edge from={SERVER} to={DB} muted />
      </EdgeLayer>
      {step >= 1 && users.map((u, i) => (
        <Packet key={i} from={u} to={SERVER} variant="request" small duration={0.7} delay={i * 0.08} />
      ))}
      {step >= 1 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.9 } }} className="absolute font-body text-[18px]" style={{ left: 700, top: 700, color: 'var(--color-teal)' }}>
          Every request, handled comfortably. No problem yet.
        </motion.p>
      )}
    </div>
  );
}

function PrincipleScene() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-[1100px]">
        <div className="font-mono text-[15px] tracking-[0.14em] uppercase mb-5" style={{ color: 'var(--color-amber)' }}>The one idea behind everything today</div>
        <h1 className="font-display font-semibold text-[46px] leading-tight" style={{ color: 'var(--color-ink-100)' }}>
          Start simple.<br />Add complexity only when a <span style={{ color: 'var(--color-amber)' }}>real problem</span> demands it.
        </h1>
        <p className="font-body text-[19px] mt-6" style={{ color: 'var(--color-ink-400)' }}>
          System Design isn't about memorising architecture diagrams.<br />It's about understanding why each piece exists.
        </p>
      </motion.div>
    </div>
  );
}

function TransitionScene() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="text-center">
        <h1 className="font-display font-semibold text-[52px]" style={{ color: 'var(--color-ink-100)' }}>
          Let's build something closer to home.
        </h1>
        <p className="font-mono text-[20px] mt-6 tracking-wide" style={{ color: 'var(--color-teal)' }}>
          LabXam: lab exam questions and PYQs, MIT Manipal
        </p>
        <p className="font-body text-[15px] mt-8 max-w-[640px] mx-auto" style={{ color: 'var(--color-ink-600)' }}>
          What follows is a hypothetical exercise: how a platform like LabXam
          <i> could </i> evolve if usage kept growing far past where it is today.
          It is not a description of LabXam's real production system.
        </p>
      </motion.div>
    </div>
  );
}

const RECAP_SERVER = { x: 1280, y: 460 };
const RECAP_DB = { x: 1500, y: 460 };

/** Bridges "meet LabXam by name" into "here's what it actually does" before the
 * story starts stress-testing it, so the exam-night scaling problem doesn't
 * land on an audience that never saw the product itself. */
function MeetLabXamScene({ step }: { step: number }) {
  const features = [
    { Icon: FileText, t: 'Past lab exam papers', d: 'Organised by subject and by year' },
    { Icon: Search, t: 'Search across the archive', d: 'Find every past paper that touched a topic' },
    { Icon: Users, t: 'Built for MIT Manipal students', d: 'Busiest the night before every lab exam' },
  ];
  const shown = Math.min(step + 1, features.length);
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 2 · Enter LabXam" title="Here's what LabXam actually does." />
      <div className="absolute flex flex-col gap-6" style={{ left: 120, top: 260, width: 720 }}>
        {features.slice(0, shown).map(({ Icon, t, d }) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-5"
          >
            <div className="w-[56px] h-[56px] rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-panel)', border: '1.5px solid var(--color-line)' }}>
              <Icon size={26} color="var(--color-amber)" strokeWidth={1.75} />
            </div>
            <div>
              <div className="font-display font-semibold text-[21px]" style={{ color: 'var(--color-ink-100)' }}>{t}</div>
              <div className="font-body text-[15.5px] mt-0.5" style={{ color: 'var(--color-ink-400)' }}>{d}</div>
            </div>
          </motion.div>
        ))}
      </div>
      {step >= 3 && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute font-mono text-[13px] uppercase tracking-wide" style={{ left: 1230, top: 300, color: 'var(--color-ink-600)' }}>
            today, behind the scenes
          </motion.div>
          <Node x={RECAP_SERVER.x} y={RECAP_SERVER.y} type="server" label="Server" status="healthy" size={78} />
          <Node x={RECAP_DB.x} y={RECAP_DB.y} type="database" label="Database" status="healthy" size={78} />
          <EdgeLayer><Edge from={RECAP_SERVER} to={RECAP_DB} muted /></EdgeLayer>
        </>
      )}
    </div>
  );
}

export const section1Scenes: SceneDef[] = [
  { id: 'simple-app', title: 'One server, one database', steps: 2, Component: SimpleAppScene },
  { id: 'principle', title: 'The core principle', steps: 1, Component: PrincipleScene, notes: 'Let this land. Slow down here.' },
  { id: 'transition', title: 'Enter LabXam', steps: 1, Component: TransitionScene, notes: 'Be explicit: this is a teaching fiction, not real LabXam architecture.' },
  { id: 'meet-labxam', title: 'What LabXam actually does', steps: 4, Component: MeetLabXamScene, notes: 'This is the bridge into exam-night traffic. Do not skip it.' },
];