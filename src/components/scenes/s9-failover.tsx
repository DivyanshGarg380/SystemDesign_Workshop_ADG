import { motion } from 'framer-motion';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, Prompt, ChapterBreak } from '../stage';
import type { SceneDef } from '../../lib/types';

const LB = { x: 480, y: 480 };
const SERVERS = [{ x: 900, y: 260 }, { x: 900, y: 480 }, { x: 900, y: 700 }];

function HealthCheckScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 10 · Something Fails" title="The load balancer keeps asking: are you okay?" sub="A regular health check to every server is necessary." />
      <Node x={LB.x} y={LB.y} type="loadbalancer" label="Load Balancer" status="active" />
      {SERVERS.map((s, i) => <Node key={i} x={s.x} y={s.y} type="server" label={`Server ${i + 1}`} status="healthy" />)}
      <EdgeLayer>{SERVERS.map((s, i) => <Edge key={i} from={LB} to={s} muted dashed />)}</EdgeLayer>
      {step >= 1 && SERVERS.map((s, i) => (
        <Packet key={i} from={LB} to={s} label="ping" variant="request" small duration={1} delay={i * 0.35} />
      ))}
      {step >= 2 && SERVERS.map((s, i) => (
        <Packet key={`p${i}`} from={s} to={LB} label="ok" variant="response" small duration={1} delay={1.2 + i * 0.35} />
      ))}
    </div>
  );
}

function FailoverScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 10 · Something Fails" title="Server 2 just died" />
      <Prompt show={step === 0}>Server 2 just died. What now?</Prompt>
      <Node x={LB.x} y={LB.y} type="loadbalancer" label="Load Balancer" status="active" />
      {SERVERS.map((s, i) => (
        <Node key={i} x={s.x} y={s.y} type="server" label={`Server ${i + 1}`} status={i === 1 && step >= 2 ? 'failed' : 'healthy'} />
      ))}
      <EdgeLayer>
        {SERVERS.map((s, i) => <Edge key={i} from={LB} to={s} muted={i === 1 && step >= 2} />)}
      </EdgeLayer>

      {step === 1 && (
        <Packet key="ping-attempt" from={LB} to={SERVERS[1]} label="ping" variant="request" duration={1.1} />
      )}
      {step >= 2 && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, times: [0, 0.15, 0.75, 1] }}
          className="absolute font-mono text-[20px]" style={{ left: 990, top: 480, color: 'var(--color-red)' }}
        >
          ...no response. timed out.
        </motion.p>
      )}
      {step >= 3 && (
        <>
          <Packet from={LB} to={SERVERS[0]} label="rerouted" variant="request" duration={1.1} />
          <Packet from={LB} to={SERVERS[2]} label="rerouted" variant="request" duration={1.1} delay={0.3} />
        </>
      )}
      {step >= 3 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.6 } }} className="absolute font-display font-semibold text-[25px]" style={{ left: 460, top: 780, color: 'var(--color-teal)' }}>
          The health check catches it. The load balancer stops sending it traffic. Students never notice.
        </motion.p>
      )}
    </div>
  );
}

function RedundancyScene() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-[900px]"
      >
        <h1
          className="font-display font-semibold text-[40px]"
          style={{ color: 'var(--color-ink-100)' }}
        >
          Redundancy, high availability and backups
        </h1>

        <p
          className="font-body text-[25px] mt-4"
          style={{ color: 'var(--color-ink-400)' }}
        >
          Multiple servers give you <i>redundancy</i>. Automatic failover turns that
          redundancy into <i>high availability</i> and neither replaces backups:
          separate, regular copies of your data that can save you when replication
          alone isn't enough.
        </p>
      </motion.div>
    </div>
  );
}

export const section9Scenes: SceneDef[] = [
  { id: 'chapter-failover', title: 'Chapter: Something Fails', steps: 1, Component: () => (
    <ChapterBreak part="Part 10" title="Something Fails" hook="Every system eventually has a bad night" />
  ), optional: true, notes: 'Pause here. Let the room reset before diving in.' },
  { id: 'health-check', title: 'Health checks', steps: 3, Component: HealthCheckScene, optional: true },
  { id: 'failover', title: 'Failover', steps: 4, Component: FailoverScene, optional: true, notes: 'Great room-participation moment even if trimmed elsewhere.' },
  { id: 'redundancy', title: 'Redundancy & backups', steps: 1, Component: RedundancyScene, optional: true },
];