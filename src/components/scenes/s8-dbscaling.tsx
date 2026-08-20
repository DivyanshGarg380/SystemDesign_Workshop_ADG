import { motion } from 'framer-motion';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, Prompt } from '../stage';
import { stagger } from '../../lib/helpers';
import type { SceneDef } from '../../lib/types';

const SERVER = { x: 500, y: 480 };
const DB = { x: 950, y: 480 };

function DbStrainScene({ step }: { step: number }) {
  const delays = stagger(9, 0.1);
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 9 · Optional — Database Under Strain" title="Caching helped. The database is still one machine." sub="Every read and every write still lands on the same box." />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Servers" status="active" />
      <Node x={DB.x} y={DB.y} type="database" label="Database" status={step >= 1 ? 'overloaded' : 'idle'} />
      <EdgeLayer><Edge from={SERVER} to={DB} muted /></EdgeLayer>
      {step >= 1 && Array.from({ length: 9 }).map((_, i) => (
        <Packet key={i} from={SERVER} to={DB} label={i % 3 === 0 ? 'write' : 'read'} variant={i % 3 === 0 ? 'job' : 'request'} small duration={0.5} delay={delays[i]} />
      ))}
      <Prompt show={step >= 2}>Reads vastly outnumber writes here. Does every read need to hit the same machine as every write?</Prompt>
    </div>
  );
}

function ReadReplicasScene({ step }: { step: number }) {
  const PRIMARY = { x: 900, y: 480 };
  const REPLICAS = [{ x: 1250, y: 340 }, { x: 1250, y: 480 }, { x: 1250, y: 620 }];
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 9 · Optional" title="Read replicas take the read load off the primary." sub="Writes go to the primary. It replicates to the replicas, which handle reads." />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Servers" status="idle" />
      <Node x={PRIMARY.x} y={PRIMARY.y} type="database" label="Primary DB" sublabel="writes" status="active" />
      {step >= 1 && REPLICAS.map((r, i) => <Node key={i} x={r.x} y={r.y} type="replica" label={`Replica ${i + 1}`} sublabel="reads" status="healthy" size={80} />)}
      <EdgeLayer>
        <Edge from={SERVER} to={PRIMARY} muted />
        {step >= 1 && REPLICAS.map((r, i) => <Edge key={i} from={PRIMARY} to={r} dashed muted />)}
      </EdgeLayer>
      {step >= 1 && REPLICAS.map((r, i) => <Packet key={i} from={PRIMARY} to={r} label="replicate" variant="data" small duration={0.7} delay={i * 0.15} />)}
      {step >= 2 && <Packet from={SERVER} to={PRIMARY} label="write" variant="job" duration={0.6} />}
      {step >= 2 && REPLICAS.map((r, i) => <Packet key={`rd${i}`} from={SERVER} to={r} label="read" variant="request" small duration={0.6} delay={0.1 + i * 0.1} />)}
    </div>
  );
}

function ShardingScene({ step }: { step: number }) {
  const SHARDS = [
    { x: 900, y: 340, label: 'Shard A', sub: 'users A–I' },
    { x: 1150, y: 480, label: 'Shard B', sub: 'users J–R' },
    { x: 900, y: 620, label: 'Shard C', sub: 'users S–Z' },
  ];
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 9 · Optional" title="Eventually, even one primary isn't enough to hold all the data." sub="Sharding: split the data itself across multiple databases, by some key." />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Servers" status="idle" />
      {SHARDS.map((s, i) => (
        <Node key={i} x={s.x} y={s.y} type="database" label={s.label} sublabel={s.sub} status={step >= 1 ? 'active' : 'idle'} size={80} />
      ))}
      <EdgeLayer>{SHARDS.map((s, i) => <Edge key={i} from={SERVER} to={s} muted />)}</EdgeLayer>
      {step >= 1 && (
        <Packet from={SERVER} to={SHARDS[1]} label="user 'Priya' → shard B" variant="request" duration={0.8} />
      )}
      {step === 1 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1 } }} className="absolute font-body text-[17px] max-w-[520px]" style={{ left: 900, top: 760, color: 'var(--color-ink-400)' }}>
          High-level only — sharding brings real complexity (cross-shard queries, rebalancing) worth its own future session.
        </motion.p>
      )}
    </div>
  );
}

export const section8Scenes: SceneDef[] = [
  { id: 'db-strain', title: 'One database, real strain', steps: 3, Component: DbStrainScene, optional: true },
  { id: 'read-replicas', title: 'Read replicas', steps: 3, Component: ReadReplicasScene, optional: true },
  { id: 'sharding', title: 'Sharding, briefly', steps: 2, Component: ShardingScene, optional: true },
];
