import { motion } from 'framer-motion';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, Prompt, ChapterBreak } from '../stage';
import type { SceneDef } from '../../lib/types';

const LB = { x: 480, y: 480 };
const SERVERS = [{ x: 900, y: 260 }, { x: 900, y: 480 }, { x: 900, y: 700 }];

function HealthCheckScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 10 · Optional, Something Fails" title="The load balancer keeps asking: are you okay?" sub="A regular health check, to every server, all the time." />
      <Node x={LB.x} y={LB.y} type="loadbalancer" label="Load Balancer" status="active" />
      {SERVERS.map((s, i) => <Node key={i} x={s.x} y={s.y} type="server" label={`Server ${i + 1}`} status="healthy" />)}
      <EdgeLayer>{SERVERS.map((s, i) => <Edge key={i} from={LB} to={s} muted dashed />)}</EdgeLayer>
      {step >= 1 && SERVERS.map((s, i) => (
        <Packet key={i} from={LB} to={s} label="ping" variant="request" small duration={0.5} delay={i * 0.15} />
      ))}
      {step >= 2 && SERVERS.map((s, i) => (
        <Packet key={`p${i}`} from={s} to={LB} label="ok" variant="response" small duration={0.5} delay={0.6 + i * 0.15} />
      ))}
    </div>
  );
}

function FailoverScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 10 · Optional" title="Server 2 just died." />
      <Prompt show={step === 0}>Server 2 just died. What now?</Prompt>
      <Node x={LB.x} y={LB.y} type="loadbalancer" label="Load Balancer" status="active" />
      {SERVERS.map((s, i) => (
        <Node key={i} x={s.x} y={s.y} type="server" label={`Server ${i + 1}`} status={i === 1 && step >= 1 ? 'failed' : 'healthy'} />
      ))}
      <EdgeLayer>
        {SERVERS.map((s, i) => <Edge key={i} from={LB} to={s} muted={i === 1 && step >= 1} />)}
      </EdgeLayer>
      {step >= 2 && (
        <>
          <Packet from={LB} to={SERVERS[0]} label="rerouted" variant="request" duration={0.6} />
          <Packet from={LB} to={SERVERS[2]} label="rerouted" variant="request" duration={0.6} delay={0.15} />
        </>
      )}
      {step >= 2 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.9 } }} className="absolute font-display font-semibold text-[19px]" style={{ left: 460, top: 760, color: 'var(--color-teal)' }}>
          The health check catches it. The load balancer stops sending it traffic. Students never notice.
        </motion.p>
      )}
    </div>
  );
}

function RedundancyScene() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-[900px]">
        <h1 className="font-display font-semibold text-[38px]" style={{ color: 'var(--color-ink-100)' }}>
          Redundancy, high availability, and backups
        </h1>
        <p className="font-body text-[18px] mt-4" style={{ color: 'var(--color-ink-400)' }}>
          Multiple servers is redundancy. Automatic failover is what makes a system <i>highly available</i>.
          And none of this replaces backups: a separate, regular copy of your data, for the day
          replication itself isn't enough.
        </p>
      </motion.div>
    </div>
  );
}

export const section9Scenes: SceneDef[] = [
  { id: 'chapter-failover', title: 'Chapter: Something Fails', steps: 1, Component: () => (
    <ChapterBreak part="Part 10 · Optional" title="Something Fails" hook="Every system eventually has a bad night." />
  ), optional: true, notes: 'Pause here. Let the room reset before diving in.' },
  { id: 'health-check', title: 'Health checks', steps: 3, Component: HealthCheckScene, optional: true },
  { id: 'failover', title: 'Failover', steps: 3, Component: FailoverScene, optional: true, notes: 'Great room-participation moment even if trimmed elsewhere.' },
  { id: 'redundancy', title: 'Redundancy & backups', steps: 1, Component: RedundancyScene, optional: true },
];