import { motion } from 'framer-motion';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, Prompt, ChapterBreak } from '../stage';
import { stagger } from '../../lib/helpers';
import type { SceneDef } from '../../lib/types';

const SERVER = { x: 500, y: 480 };
const DB = { x: 950, y: 480 };

function DbStrainScene({ step }: { step: number }) {
  const delays = stagger(9, 0.1);

  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 9 · Database Under Strain"
        title="Caching helped. The database is still one machine"
        sub="Every read and every write still lands on the same box."
      />

      <Node
        x={SERVER.x}
        y={SERVER.y}
        type="server"
        label="Servers"
        status="active"
      />

      {/* Database starts idle */}
      <Node
        x={DB.x}
        y={DB.y}
        type="database"
        label="Database"
        status="idle"
      />

      <EdgeLayer>
        <Edge from={SERVER} to={DB} muted />
      </EdgeLayer>

      {/* Requests start flooding the database */}
      {step >= 1 &&
        Array.from({ length: 9 }).map((_, i) => (
          <Packet
            key={i}
            from={SERVER}
            to={DB}
            label={i % 3 === 0 ? 'write' : 'read'}
            variant={i % 3 === 0 ? 'job' : 'request'}
            small
            duration={0.6}
            delay={delays[i]}
          />
        ))}

      {/* DB turns overloaded after the first request arrives */}
      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 1 },
          }}
        >
          <Node
            x={DB.x}
            y={DB.y}
            type="database"
            label="Database"
            status="overloaded"
          />
        </motion.div>
      )}

      <Prompt show={step >= 2}>
        Reads vastly outnumber writes here. Does every read need to hit the same
        machine as every write?
      </Prompt>
    </div>
  );
}

function ReadReplicasScene({ step }: { step: number }) {
  const PRIMARY = { x: 900, y: 480 };
  const REPLICAS = [
    { x: 1250, y: 280 },
    { x: 1250, y: 480 },
    { x: 1250, y: 680 },
  ];

  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 9 · Database Under Strain"
        title="Read replicas take the read load off the primary"
        sub="Writes go to the primary. It replicates to the replicas, which handle reads."
      />

      <Node
        x={SERVER.x}
        y={SERVER.y}
        type="server"
        label="Servers"
        status="idle"
      />

      <Node
        x={PRIMARY.x}
        y={PRIMARY.y}
        type="database"
        label="Primary DB"
        sublabel="writes"
        status="active"
      />

      {/* Replicas start idle */}
      {step >= 1 &&
        REPLICAS.map((r, i) => (
          <Node
            key={`idle-${i}`}
            x={r.x}
            y={r.y}
            type="replica"
            label={`Replica ${i + 1}`}
            sublabel="reads"
            status="idle"
            size={80}
          />
        ))}

      <EdgeLayer>
        <Edge from={SERVER} to={PRIMARY} muted />

        {step >= 1 &&
          REPLICAS.map((r, i) => (
            <Edge
              key={i}
              from={PRIMARY}
              to={r}
              dashed
              muted
            />
          ))}
      </EdgeLayer>

      {/* Primary replicates data */}
      {step >= 1 &&
        REPLICAS.map((r, i) => (
          <Packet
            key={`replicate-${i}`}
            from={PRIMARY}
            to={r}
            label="replicate"
            variant="data"
            small
            duration={0.7}
            delay={i * 0.15}
          />
        ))}

      {/* Replica becomes healthy only after replication arrives */}
      {step >= 1 &&
        REPLICAS.map((r, i) => (
          <motion.div
            key={`healthy-${i}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: 0.7 + i * 0.15,
              },
            }}
          >
            <Node
              x={r.x}
              y={r.y}
              type="replica"
              label={`Replica ${i + 1}`}
              sublabel="reads"
              status="healthy"
              size={80}
            />
          </motion.div>
        ))}

      {/* Step 2: one write still goes to the primary */}
      {step >= 2 && (
        <Packet
          from={SERVER}
          to={PRIMARY}
          label="write"
          variant="job"
          duration={1}
        />
      )}

      {/* Reads get distributed to replicas */}
      {step >= 2 &&
        REPLICAS.map((r, i) => (
          <Packet
            key={`read-${i}`}
            from={SERVER}
            to={r}
            label="read"
            variant="request"
            small
            duration={1.3}
            delay={0.1 + i * 0.1}
          />
        ))}
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
      <SceneTitle
        eyebrow="Part 9 · Database Under Strain"
        title="Eventually, even one primary isn't enough to hold all the data"
        sub="Sharding: split the data itself across multiple databases, by some key."
      />

      <Node
        x={SERVER.x}
        y={SERVER.y}
        type="server"
        label="Servers"
        status="idle"
      />

      {/* All shards start idle */}
      {SHARDS.map((s, i) => (
        <Node
          key={`idle-${i}`}
          x={s.x}
          y={s.y}
          type="database"
          label={s.label}
          sublabel={s.sub}
          status="idle"
          size={80}
        />
      ))}

      <EdgeLayer>
        {SHARDS.map((s, i) => (
          <Edge key={i} from={SERVER} to={s} muted />
        ))}
      </EdgeLayer>

      {/* Request is routed specifically to Shard B */}
      {step >= 1 && (
        <Packet
          from={SERVER}
          to={SHARDS[0]}
          label="user 'Bob' → shard A"
          variant="request"
          duration={1.8}
        />
      )}

      {/* Only Shard A activates when the request reaches it */}
      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 2},
          }}
        >
          <Node
            x={SHARDS[0].x}
            y={SHARDS[0].y}
            type="database"
            label={SHARDS[0].label}
            sublabel={SHARDS[0].sub}
            status="active"
            size={80}
          />
        </motion.div>
      )}
    </div>
  );
}

export const section8Scenes: SceneDef[] = [
  { id: 'chapter-dbscaling', title: 'Chapter: Database Under Strain', steps: 1, Component: () => (
    <ChapterBreak part="Part 9" title="Database Under Strain" hook="Caching bought time. The database still has limits." />
  ), optional: true, notes: 'Pause here. Let the room reset before diving in.' },
  { id: 'db-strain', title: 'One database, real strain', steps: 3, Component: DbStrainScene, optional: true },
  { id: 'read-replicas', title: 'Read replicas', steps: 3, Component: ReadReplicasScene, optional: true },
  { id: 'sharding', title: 'Sharding, briefly', steps: 2, Component: ShardingScene, optional: true },
];