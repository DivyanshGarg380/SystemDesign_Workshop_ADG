import { motion } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';
import { Node, Packet, EdgeLayer, Edge, SceneTitle } from '../stage';
import type { SceneDef } from '../../lib/types';

const USER = { x: 300, y: 500 };
const SERVER = { x: 800, y: 500 };
const DB = { x: 1300, y: 500 };

function TitleScene() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
        <div className="font-mono text-[15px] tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--color-amber)' }}>MIT Manipal &middot; System Design Workshop</div>
        <h1 className="font-display font-semibold text-[64px] leading-tight" style={{ color: 'var(--color-ink-100)' }}>
          What actually happens<br />when you tap a button?
        </h1>
        <p className="font-body text-[20px] mt-6" style={{ color: 'var(--color-ink-400)' }}>
          A live, visual story about how software grows up.
        </p>
      </motion.div>
    </div>
  );
}

function ClickScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 1 · Web Basics" title="You tap a button in an app." />
      <div className="absolute" style={{ left: 700, top: 460 }}>
        <motion.div
          animate={step >= 1 ? { scale: [1, 0.9, 1] } : {}}
          transition={{ duration: 0.4 }}
          className="w-[220px] h-[64px] rounded-xl flex items-center justify-center gap-3 font-display font-semibold text-[20px]"
          style={{ background: 'var(--color-panel-2)', border: '2px solid var(--color-amber)', color: 'var(--color-amber)' }}
        >
          <MousePointerClick size={22} /> View Questions
        </motion.div>
      </div>
      {step >= 1 && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute font-body text-[19px]" style={{ left: 700, top: 560, color: 'var(--color-ink-400)', width: 420 }}
        >
          Somewhere, a message just left your phone. Where does it go?
        </motion.p>
      )}
    </div>
  );
}

function ClientServerScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 1 · Web Basics" title="Two machines are involved." sub="Your phone is a client. Somewhere else, a server is waiting." />
      <Node x={USER.x} y={USER.y} type="user" label="You" sublabel="client" status="active" />
      {step >= 1 && (
        <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" sublabel="always on, waiting" status="idle" />
      )}
      {step >= 1 && (
        <EdgeLayer>
          <Edge from={USER} to={SERVER} muted />
        </EdgeLayer>
      )}
    </div>
  );
}

function RequestResponseScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 1 · Web Basics" title="A request leaves. A response comes back." />
      <Node x={USER.x} y={USER.y} type="user" label="You" sublabel="client" status={step === 0 ? 'active' : 'idle'} />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" status={step === 1 ? 'active' : 'idle'} />
      <EdgeLayer>
        <Edge from={USER} to={SERVER} muted />
      </EdgeLayer>
      {step === 0 && <Packet from={USER} to={SERVER} label="GET /questions" variant="request" />}
      {step >= 1 && <Packet from={USER} to={SERVER} label="GET /questions" variant="request" duration={0.01} />}
      {step === 1 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute font-body text-[18px]" style={{ left: 640, top: 640, color: 'var(--color-ink-400)' }}>
          The server reads your request and decides what to do.
        </motion.p>
      )}
      {step >= 2 && <Packet from={SERVER} to={USER} label="200 OK — data" variant="response" delay={0.1} />}
    </div>
  );
}

function DatabaseScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 1 · Web Basics" title="The server itself doesn't remember anything." sub="It asks a database." />
      <Node x={USER.x} y={USER.y} type="user" label="You" status="idle" />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" status={step >= 1 && step < 3 ? 'active' : 'idle'} />
      <Node x={DB.x} y={DB.y} type="database" label="Database" sublabel="stores every question" status={step === 1 ? 'active' : 'idle'} />
      <EdgeLayer>
        <Edge from={USER} to={SERVER} muted />
        <Edge from={SERVER} to={DB} muted />
      </EdgeLayer>
      {step >= 0 && <Packet key={`p0-${step === 0}`} from={USER} to={SERVER} label="GET /questions" variant="request" duration={step === 0 ? 0.9 : 0.01} />}
      {step >= 1 && <Packet key={`p1-${step === 1}`} from={SERVER} to={DB} label="find questions" variant="request" duration={step === 1 ? 0.9 : 0.01} />}
      {step >= 2 && <Packet key={`p2-${step === 2}`} from={DB} to={SERVER} label="rows" variant="data" duration={step === 2 ? 0.9 : 0.01} />}
      {step >= 3 && <Packet from={SERVER} to={USER} label="200 OK" variant="response" duration={0.9} />}
      {step === 3 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }} className="absolute font-display font-semibold text-[20px]" style={{ left: 620, top: 700, color: 'var(--color-teal)' }}>
          Client → Server → Database → Server → Client
        </motion.p>
      )}
    </div>
  );
}

function ApiStaticDynamicScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 1 · Web Basics"
        title={step === 0 ? 'That request has a name: an API call.' : 'Not everything comes from a database.'}
        sub={step === 0
          ? '"GET /questions" is an API — a fixed way for the client to ask the server for something.'
          : 'A logo image never changes. It\u2019s static. Your question list changes constantly. It\u2019s dynamic.'}
      />
      {step === 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute" style={{ left: 560, top: 420 }}>
          <div className="font-mono text-[26px] px-8 py-5 rounded-xl" style={{ background: 'var(--color-panel-2)', border: '1px solid var(--color-line)', color: 'var(--color-amber)' }}>
            GET&nbsp;&nbsp;<span style={{ color: 'var(--color-ink-100)' }}>/questions</span>
          </div>
          <div className="flex gap-8 mt-6 font-mono text-[15px]" style={{ color: 'var(--color-ink-400)' }}>
            <span><b style={{ color: 'var(--color-teal)' }}>method</b> — what to do</span>
            <span><b style={{ color: 'var(--color-teal)' }}>path</b> — what resource</span>
          </div>
        </motion.div>
      )}
      {step === 1 && (
        <div className="absolute inset-0">
          <Node x={520} y={520} type="server" label="Server" sublabel="static file" status="idle" />
          <Node x={520} y={520 + 0} type="server" label="" status="idle" />
          <div className="absolute font-mono text-[15px]" style={{ left: 420, top: 640, color: 'var(--color-ink-400)', width: 260 }}>logo.png — same bytes, every time</div>
          <Node x={1080} y={520} type="database" label="Database" sublabel="dynamic data" status="active" />
          <div className="absolute font-mono text-[15px]" style={{ left: 980, top: 640, color: 'var(--color-ink-400)', width: 260 }}>your questions — different every request</div>
        </div>
      )}
    </div>
  );
}

export const section0Scenes: SceneDef[] = [
  { id: 'title', title: 'Title', steps: 1, Component: TitleScene, notes: 'Welcome the room. No jargon yet.' },
  { id: 'click', title: 'You tap a button', steps: 2, Component: ClickScene },
  { id: 'client-server', title: 'Client and server', steps: 2, Component: ClientServerScene },
  { id: 'request-response', title: 'Request and response', steps: 3, Component: RequestResponseScene, notes: 'This packet motif returns for the rest of the workshop.' },
  { id: 'database', title: 'The database', steps: 4, Component: DatabaseScene },
  { id: 'api-static-dynamic', title: 'APIs, static vs dynamic', steps: 2, Component: ApiStaticDynamicScene },
];
