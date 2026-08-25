import { motion } from 'framer-motion';
import { MousePointerClick, Lock } from 'lucide-react';
import { Node, Packet, EdgeLayer, Edge, SceneTitle } from '../stage';
import type { SceneDef } from '../../lib/types';

const USER = { x: 300, y: 500 };
const SERVER = { x: 800, y: 500 };
const DB = { x: 1300, y: 500 };

function TitleScene() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
        <div className="font-mono text-[20px] tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--color-amber)' }}>System Design Workshop</div>
        <h1 className="font-display font-semibold text-[64px] leading-tight" style={{ color: 'var(--color-ink-100)' }}>
          What actually happens<br />when you use an app?
        </h1>
        <p
          className="font-body text-[20px] mt-6"
          style={{ color: 'var(--color-ink-400)' }}
        >
          A live, visual story of how an app grows from one user to millions.
        </p>
      </motion.div>
    </div>
  );
}

/** Presenter cue card. Big enough to read from the podium, friendly enough that
 * it also works as a genuine welcome slide for the room. */
function SpeakerCueScene({ step }: { step: number }) {
  const lines = [
    {
      h: "I'm Divyansh.",
      s: "I lead Web Development at ADG Manipal.",
    },

    {
      h: "Tonight, we're following one app.",
      s: "It starts simple. Then users show up. Problems follow.",
    },

    {
      h: "This isn't a lecture.",
      s: "I'll ask. You guess. We'll figure out what happens next.",
    },

    {
      h: "You don't need to know System Design.",
      s: "Just know how to use an app. That's enough to start.",
    },
  ];
  const shown = Math.min(step + 1, lines.length);
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-[120px]">
      <div className="font-mono text-[20px] tracking-[0.2em] uppercase mb-8" style={{ color: 'var(--color-amber)' }}>
        Welcome
      </div>
      <div className="flex flex-col gap-7">
        {lines.slice(0, shown).map((l, i) => (
          <motion.div
            key={l.h}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-5"
          >
            <span className="font-mono text-[16px] mt-2" style={{ color: i === shown - 1 ? 'var(--color-amber)' : 'var(--color-ink-600)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <div className="font-display font-semibold text-[40px]" style={{ color: 'var(--color-ink-100)' }}>{l.h}</div>
              <div className="font-body text-[20px] mt-1" style={{ color: 'var(--color-ink-400)' }}>{l.s}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Second cue slide: the agenda, so the presenter (and the room) always knows
 * roughly where things are headed and what's optional if time runs short. */
function AgendaScene({ step }: { step: number }) {
  const items = [
    'Web basics: what a click or a URL actually triggers',
    'What "System Design" even means',
    'Exam-night traffic: scaling and load balancing',
    'Caching, large files and CDNs',
    'Async work: queues and background workers',
    'AI requests and rate limiting',
    'Extras if time allows: geo-distribution, replicas, failover, search, observability',
  ];
  const shown = Math.min(step + 1, items.length);
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-[120px]">
      <div className="font-mono text-[20px] tracking-[0.2em] uppercase mb-6" style={{ color: 'var(--color-amber)' }}>
        Tonight's route
      </div>
      <h1 className="font-display font-semibold text-[40px] mb-8" style={{ color: 'var(--color-ink-100)' }}>
        We'll build one system, one problem at a time.
      </h1>
      <div className="flex flex-col gap-3.5">
        {items.slice(0, shown).map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4 font-body text-[20px]"
            style={{ color: i === items.length - 1 ? 'var(--color-ink-600)' : 'var(--color-ink-300)' }}
          >
            <span className="font-mono text-[20px] w-6" style={{ color: 'var(--color-teal)' }}>{String(i + 1).padStart(2, '0')}</span>
            {t}
          </motion.div>
        ))}
      </div>
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
          transition={{ duration: 0.5 }}
          className="w-[220px] h-[64px] rounded-xl flex items-center justify-center gap-3 font-display font-semibold text-[20px]"
          style={{ background: 'var(--color-panel-2)', border: '2px solid var(--color-amber)', color: 'var(--color-amber)' }}
        >
          <MousePointerClick size={22} /> View Questions
        </motion.div>
      </div>
      {step >= 1 && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}
          className="absolute font-body text-[20px]" style={{ left: 700, top: 560, color: 'var(--color-ink-400)', width: 420 }}
        >
          Somewhere, a message just left your phone. Where does it go?
        </motion.p>
      )}
    </div>
  );
}

const BROWSER = { x: 620, y: 470 };
const DNS = { x: 1020, y: 300 };
const URL_SERVER = { x: 1360, y: 470 };

function BrowserCard() {
  return (
    <div className="absolute" style={{ left: BROWSER.x - 210, top: BROWSER.y - 80 }}>
      <div className="w-[420px] rounded-2xl overflow-hidden" style={{ border: '1.5px solid var(--color-line)', background: 'var(--color-panel)', boxShadow: '0 6px 20px -8px rgba(20,24,29,0.15)' }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--color-line-soft)', background: 'var(--color-panel-2)' }}>
          <span className="w-3 h-3 rounded-full" style={{ background: '#e0645a' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#e8b34a' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#59b568' }} />
        </div>
        <div className="flex items-center gap-2.5 px-5 py-4 font-mono text-[16.5px]" style={{ color: 'var(--color-ink-100)' }}>
          <Lock size={15} color="var(--color-teal)" />
          labxam.vercel.app
        </div>
      </div>
    </div>
  );
}

const BROWSER_ANCHOR = { x: BROWSER.x + 100, y: BROWSER.y - 20 };

/** The URL / DNS scene: the second, equally common way a request begins. */
function URLScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 1 · Web Basics"
        title="Or maybe you typed a web address instead."
        sub="Before your browser can talk to any server, it first has to find out where that address actually lives."
      />
      <BrowserCard />
      {step >= 1 && <Node x={DNS.x} y={DNS.y} type="dns" label="DNS" sublabel="the internet's phone book" status="active" />}
      {step >= 1 && <EdgeLayer><Edge from={BROWSER_ANCHOR} to={DNS} muted /></EdgeLayer>}
      {step === 1 && <Packet from={BROWSER_ANCHOR} to={DNS} label="labxam.vercel.app, what's your address?" variant="request" duration={1.2} />}
      {step >= 2 && <Packet key={`dns-reply-${step === 2}`} from={DNS} to={BROWSER_ANCHOR} label="104.21.5.12" variant="response" duration={step === 2 ? 1.2 : 0.01} />}
      {step >= 3 && (
        <>
          <Node x={URL_SERVER.x} y={URL_SERVER.y} type="server" label="Server" sublabel="104.21.5.12" status="active" />
          <EdgeLayer><Edge from={BROWSER_ANCHOR} to={URL_SERVER} muted /></EdgeLayer>
          <Packet key={`dns-connect-${step === 3}`} from={BROWSER_ANCHOR} to={URL_SERVER} label="connect to 104.21.5.12" variant="request" duration={step === 3 ? 1.3 : 0.01} />
        </>
      )}
      {step === 3 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.3 } }} className="absolute font-body text-[20px] max-w-[420px]" style={{ left: 620, top: 700, color: 'var(--color-ink-400)' }}>
          An IP address is just a machine's actual address on the network. DNS usually only runs once, then gets remembered for a while.
        </motion.p>
      )}
    </div>
  );
}

function ClientServerScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 1 · Web Basics" title="Either way, two machines are involved." sub="Your phone or laptop is a client. Somewhere else, a server is waiting." />
      <Node x={USER.x} y={USER.y} type="user" label="You" sublabel="client" status="active" />
      {step >= 1 && (
        <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" sublabel="always on waiting" status="idle" />
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
      {/* {step >= 1 && <Packet from={USER} to={SERVER} label="GET /questions" variant="request" duration={0.01} />} */}
      {step === 1 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }} className="absolute font-body text-[20px]" style={{ left: 640, top: 640, color: 'var(--color-ink-400)' }}>
          The server reads your request and decides what to do.
        </motion.p>
      )}
      {step >= 2 && <Packet from={SERVER} to={USER} label="200 OK, here's your data" variant="response" delay={0.20} />}
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
      {step >= 0 && <Packet key={`p0-${step === 0}`} from={USER} to={SERVER} label="GET /questions" variant="request" duration={step === 0 ? 1 : 0.01} />}
      {step >= 1 && <Packet key={`p1-${step === 1}`} from={SERVER} to={DB} label="find questions" variant="request" duration={step === 1 ? 1 : 0.01} />}
      {step >= 2 && <Packet key={`p2-${step === 2}`} from={DB} to={SERVER} label="rows" variant="data" duration={step === 2 ? 1 : 0.01} />}
      {step >= 3 && <Packet from={SERVER} to={USER} label="200 OK" variant="response" duration={1} />}
      {step === 3 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.8 } }} className="absolute font-display font-semibold text-[25px]" style={{ left: 620, top: 700, color: 'var(--color-teal)' }}>
          Client to server, server to database, database to server, server to client.
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
          ? '"GET /questions" is an API: a fixed way for the client to ask the server for something.'
          : 'A logo image never changes. It\u2019s static. Your question list changes constantly. It\u2019s dynamic.'}
      />
      {step === 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="absolute" style={{ left: 560, top: 420 }}>
          <div className="font-mono text-[26px] px-8 py-5 rounded-xl" style={{ background: 'var(--color-panel-2)', border: '1px solid var(--color-line)', color: 'var(--color-amber)' }}>
            GET&nbsp;&nbsp;<span style={{ color: 'var(--color-ink-100)' }}>/questions</span>
          </div>
          <div className="flex gap-8 mt-6 font-mono text-[20px]" style={{ color: 'var(--color-ink-400)' }}>
            <span><b style={{ color: 'var(--color-teal)' }}>method</b>: what to do</span>
            <span><b style={{ color: 'var(--color-teal)' }}>path</b>: what resource</span>
          </div>
        </motion.div>
      )}
      {step === 1 && (
        <div className="absolute inset-0">
          <Node x={520} y={520} type="server" label="Server" sublabel="static file" status="idle" />
          <div className="absolute font-mono text-[18px]" style={{ left: 400, top: 660, color: 'var(--color-ink-400)', width: 280 }}>favicon.png: same bytes, every time</div>
          <Node x={1080} y={520} type="database" label="Database" sublabel="dynamic data" status="active" />
          <div className="absolute font-mono text-[18px]" style={{ left: 960, top: 660, color: 'var(--color-ink-400)', width: 280 }}>your questions: different every request</div>
        </div>
      )}
    </div>
  );
}

export const section0Scenes: SceneDef[] = [
  { id: 'title', title: 'Title', steps: 1, Component: TitleScene, notes: 'Welcome the room. No jargon yet.' },
  { id: 'speaker-cue', title: 'Welcome & introduction', steps: 4, Component: SpeakerCueScene, notes: 'Your cue card. Read it straight off the screen if you go blank.' },
  { id: 'agenda', title: "Tonight's route", steps: 7, Component: AgendaScene, notes: 'Sets expectations. Mention the optional sections can be trimmed live.' },
  { id: 'click', title: 'You tap a button', steps: 2, Component: ClickScene },
  { id: 'url-dns', title: 'Or you type a URL: DNS', steps: 4, Component: URLScene, notes: 'The bit that was missing before: DNS resolution.' },
  { id: 'client-server', title: 'Client and server', steps: 2, Component: ClientServerScene },
  { id: 'request-response', title: 'Request and response', steps: 3, Component: RequestResponseScene, notes: 'This packet motif returns for the rest of the workshop.' },
  { id: 'database', title: 'The database', steps: 4, Component: DatabaseScene },
  { id: 'api-static-dynamic', title: 'APIs, static vs dynamic', steps: 2, Component: ApiStaticDynamicScene },
];