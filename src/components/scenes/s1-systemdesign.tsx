import { motion } from 'framer-motion';
import { Search, Sparkles, Star } from 'lucide-react';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, MiniUser, ChapterBreak } from '../stage';
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
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.9 } }} className="absolute font-body text-[20px]" style={{ left: 700, top: 700, color: 'var(--color-teal)' }}>
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
        <div className="font-mono text-[20px] tracking-[0.14em] uppercase mb-5" style={{ color: 'var(--color-amber)' }}>The one idea behind everything today</div>
        <h1 className="font-display font-semibold text-[46px] leading-tight" style={{ color: 'var(--color-ink-100)' }}>
          Start simple.<br />Add complexity only when a <span style={{ color: 'var(--color-amber)' }}>real problem</span> demands it.
        </h1>
        <p className="font-body text-[20px] mt-6" style={{ color: 'var(--color-ink-400)' }}>
          System Design isn't about memorising architecture diagrams.<br />It's about understanding why each piece exists.
        </p>
      </motion.div>
    </div>
  );
}

function TransitionScene() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        {/* Setup */}
        <p
          className="font-display font-semibold text-[42px] mb-1"
          style={{ color: 'var(--color-ink-100)' }}
        >
          Let's build something closer to home.
        </p>

        {/* Hero */}
        <h1
          className="font-display font-semibold text-[88px] leading-none tracking-tight mt-5"
          style={{ color: 'var(--color-teal)' }}
        >
          LabXam
        </h1>

        <p
          className="font-body text-[22px] mt-5"
          style={{ color: 'var(--color-ink-400)' }}
        >
          A simple platform for lab exam questions and PYQs of MIT Manipal
        </p>

        <p
          className="font-body text-[20px] leading-relaxed mt-10 max-w-[580px] mx-auto"
          style={{ color: 'var(--color-ink-600)' }}
        >
          We'll use LabXam as our starting point and follow the problems that
          appear as more and more people start using it.
        </p>
      </motion.div>
    </div>
  );
}

const RECAP_SERVER = { x: 1280, y: 460 };
const RECAP_DB = { x: 1500, y: 460 };

function MeetLabXamScene({ step }: { step: number }) {
  const features = [
    { Icon: Search, t: 'Browse by semester, subject, year, evaluation', d: 'No more digging through WhatsApp groups and shared drives' },
    {
      Icon: Sparkles,
      t: 'AI-generated solutions',
      d: 'Generate solutions without leaving LabXam',
    },
    { Icon: Star, t: 'Actually used, actually rated', d: '4.5/5, 7K+ visits and 23K+ page views during peak exam periods' },
  ];
  const shown = Math.min(step + 1, features.length);
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 2 · Enter LabXam" title="Here's what LabXam actually does." />
      <div className="absolute flex flex-col gap-6" style={{ left: 120, top: 260, width: 760 }}>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute font-mono text-[15px] uppercase tracking-wide max-w-[280px]" style={{ left: 1220, top: 280, color: 'var(--color-ink-600)' }}>
            for tonight's story, let's picture the simplest possible version
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
  { id: 'chapter-sysdesign', title: 'Chapter: What Is System Design?', steps: 1, Component: () => (
    <ChapterBreak part="Part 2" title="What Is System Design?" hook="Not a fixed blueprint. A series of decisions made as problems show up." />
  ), notes: 'Pause here. Let the room reset before diving in.' },
  { id: 'simple-app', title: 'One server, one database', steps: 2, Component: SimpleAppScene },
  { id: 'principle', title: 'The core principle', steps: 1, Component: PrincipleScene, notes: 'Let this land. Slow down here.' },
  { id: 'transition', title: 'Enter LabXam', steps: 1, Component: TransitionScene, notes: 'Be explicit: this is a teaching fiction, not real LabXam architecture.' },
  { id: 'meet-labxam', title: 'What LabXam actually does', steps: 4, Component: MeetLabXamScene, notes: 'This is the bridge into exam-night traffic. Do not skip it.' },
];