import { motion } from 'framer-motion';
import type { SceneDef } from '../../lib/types';

const TAKEAWAYS = [
  'How a web request actually travels through an application',
  'Why servers and databases are kept separate',
  'Why one server eventually stops being enough and what a load balancer does',
  'Why caching reduces load, and the difference between a hit and a miss',
  'Why large static files are served differently from dynamic data',
  'Why slow work gets handed to a queue instead of blocking the user',
  'Why rate limiting protects expensive resources',
  'Why distance affects speed and how a CDN helps',
  'Why growing systems need replication and eventually, sharding',
  'Why systems need health checks, redundancy and failover',
  'Why search at scale needs more than a database query',
  'Why teams rely on logs, metrics and tracing to know what is broken',
];

function RecapScene({ step }: { step: number }) {
  const shown = Math.min(step + 1, TAKEAWAYS.length);

  return (
    <div className="absolute inset-0 px-[100px] py-[70px]">
      <div
        className="font-mono text-[20px] tracking-[0.16em] uppercase mb-4"
        style={{ color: 'var(--color-amber)' }}
      >
        Recap
      </div>

      <h1
        className="font-display font-semibold text-[46px] mb-11"
        style={{ color: 'var(--color-ink-100)' }}
      >
        What you can now explain
      </h1>

      <div className="grid grid-cols-2 gap-x-20 gap-y-7">
        {TAKEAWAYS.slice(0, shown).map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-4 font-body text-[21px] leading-snug"
            style={{ color: 'var(--color-ink-300)' }}
          >
            <span
              className="font-mono text-[15px] mt-1 shrink-0"
              style={{ color: 'var(--color-teal)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            {t}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ClosingScene() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-[1000px]">
        <h1 className="font-display font-semibold text-[46px] leading-tight" style={{ color: 'var(--color-ink-100)' }}>
          System Design isn't about memorising diagrams.
        </h1>
        <p className="font-display font-semibold text-[46px] mt-2" style={{ color: 'var(--color-amber)' }}>
          It's about knowing why every piece exists.
        </p>
        <p className="font-body text-[20px] mt-8" style={{ color: 'var(--color-ink-400)' }}>
          Every component you saw tonight showed up to solve one specific problem. Nothing more.
        </p>
      </motion.div>
    </div>
  );
}

function ExploreLabXamScene() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-[1000px]">
        <div className="font-mono text-[20px] tracking-[0.16em] uppercase mb-5" style={{ color: 'var(--color-amber)' }}>
          Go see it live
        </div>
        <h1 className="font-display font-semibold text-[46px] leading-tight" style={{ color: 'var(--color-ink-100)' }}>
          Everything we talked about tonight is running right now at
        </h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="inline-block mt-7 rounded-2xl px-10 py-5"
          style={{ background: 'var(--color-panel)', border: '2px solid var(--color-teal)', boxShadow: '0 10px 30px -10px var(--color-teal)' }}
        >
          <span className="font-mono text-[38px] font-semibold" style={{ color: 'var(--color-teal)' }}>
            labxam.vercel.app
          </span>
        </motion.div>
        <p className="font-body text-[25px] mt-9 max-w-[760px] mx-auto" style={{ color: 'var(--color-ink-400)' }}>
          Explore it for yourself and connect what you saw tonight to what's actually running in production.
          Then take it further: study how similar apps you use every day are built and start building your own —
          that's how these concepts actually stick.
        </p>
      </motion.div>
    </div>
  );
}

function CreditsScene() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center"
      >
        <div className="font-mono text-[20px] tracking-[0.18em] uppercase mb-6" style={{ color: 'var(--color-ink-400)' }}>
          Presented by
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[40px] p-14 flex items-center justify-center"
          style={{ background: '#0b0b0d', boxShadow: '0 30px 70px -20px rgba(20,24,29,0.35), 0 0 0 1px var(--color-line-soft)' }}
        >
          <img src="/adg-logo.png" alt="Apple Developers Group, Manipal" style={{ width: 650, height: 'auto', display: 'block' }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center mt-9"
        >
          <div className="font-display font-semibold text-[30px]" style={{ color: 'var(--color-ink-100)' }}>
            ADG Manipal
          </div>
          <div className="font-body text-[20px] mt-1.5" style={{ color: 'var(--color-ink-400)' }}>
            Apple Developers Group &middot; MIT Manipal
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export const section12Scenes: SceneDef[] = [
  { id: 'recap', title: 'Recap', steps: 12, Component: RecapScene },
  { id: 'closing', title: 'Closing message', steps: 1, Component: ClosingScene, notes: 'End here. Thank the room.' },
  { id: 'explore-labxam', title: 'Explore LabXam', steps: 1, Component: ExploreLabXamScene, notes: 'Point them to the URL. Encourage them to build their own projects too.' },
  { id: 'credits', title: 'Credits', steps: 1, Component: CreditsScene, notes: 'Hold here for applause / questions.' },
];