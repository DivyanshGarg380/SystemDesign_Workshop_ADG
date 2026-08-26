import { motion } from 'framer-motion';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, Prompt, ChapterBreak } from '../stage';
import type { SceneDef } from '../../lib/types';

function LatencyScene({ step }: { step: number }) {
  const NEAR = { x: 260, y: 480 };
  const FAR = { x: 260, y: 700 };
  const ORIGIN = { x: 1350, y: 590 };

  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 8 · Growing Beyond Manipal"
        title="LabXam spreads to students across the country"
        sub="Every request still travels to one origin server, no matter how far the student is."
      />

      <Node
        x={NEAR.x}
        y={NEAR.y}
        type="user"
        label="Manipal"
        status="active"
      />

      <Node
        x={FAR.x}
        y={FAR.y}
        type="user"
        label="Delhi"
        status="active"
      />

      {/* Origin starts idle */}
      <Node
        x={ORIGIN.x}
        y={ORIGIN.y}
        type="server"
        label="Origin Server"
        status="idle"
      />

      <EdgeLayer>
        <Edge from={NEAR} to={ORIGIN} muted />
        <Edge from={FAR} to={ORIGIN} muted dashed />
      </EdgeLayer>

      {/* Both users send requests at the same time */}
      {step >= 1 && (
        <Packet
          from={NEAR}
          to={ORIGIN}
          variant="request"
          duration={0.5}
          label="~20ms"
        />
      )}

      {step >= 1 && (
        <Packet
          from={FAR}
          to={ORIGIN}
          variant="request"
          duration={2}
          label="~180ms"
        />
      )}

      {/* Origin reacts when the first request actually arrives */}
      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 0.5 },
          }}
        >
          <Node
            x={ORIGIN.x}
            y={ORIGIN.y}
            type="server"
            label="Origin Server"
            status="active"
          />
        </motion.div>
      )}

      <Prompt show={step >= 2}>
        Why is distance itself a performance problem?
      </Prompt>
    </div>
  );
}

function GeoDistScene({ step }: { step: number }) {
  const USERS = [
    { x: 260, y: 350 },
    { x: 260, y: 490 },
    { x: 260, y: 630 },
  ];

  const EDGES = [
    { x: 700, y: 350, label: 'Delhi PoP' },
    { x: 700, y: 480, label: 'Manipal PoP' },
    { x: 700, y: 630, label: 'Chennai PoP' },
  ];

  const ORIGIN = { x: 1250, y: 480 };

  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 8 · Growing Beyond Manipal"
        title="Push both compute and cache closer to users."
        sub="Each region gets its own nearby point of presence."
      />

      {USERS.map((u, i) => (
        <Node
          key={i}
          x={u.x}
          y={u.y}
          type="user"
          label={['Delhi', 'Manipal', 'Chennai'][i]}
          status="active"
          size={70}
        />
      ))}

      {/* PoPs start idle */}
      {step >= 1 &&
        EDGES.map((e, i) => (
          <Node
            key={`idle-${i}`}
            x={e.x}
            y={e.y}
            type="cdn"
            label={e.label}
            status="idle"
            size={70}
          />
        ))}

      {step >= 1 && (
        <Node
          x={ORIGIN.x}
          y={ORIGIN.y}
          type="server"
          label="Origin"
          sublabel="rarely touched"
          status="muted"
        />
      )}

      <EdgeLayer>
        {step >= 1 &&
          USERS.map((u, i) => (
            <Edge
              key={`u${i}`}
              from={u}
              to={EDGES[i]}
              muted
            />
          ))}

        {step >= 1 &&
          EDGES.map((e, i) => (
            <Edge
              key={`e${i}`}
              from={e}
              to={ORIGIN}
              muted
              dashed
            />
          ))}
      </EdgeLayer>

      {/* Requests travel to their nearest PoP */}
      {step >= 1 &&
        USERS.map((u, i) => (
          <Packet
            key={`packet-${i}`}
            from={u}
            to={EDGES[i]}
            variant="request"
            small
            duration={0.5}
            delay={i * 0.15}
          />
        ))}

      {/* PoP becomes healthy only when its request arrives */}
      {step >= 1 &&
        EDGES.map((e, i) => (
          <motion.div
            key={`healthy-${i}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: 0.5 + i * 0.15,
              },
            }}
          >
            <Node
              x={e.x}
              y={e.y}
              type="cdn"
              label={e.label}
              status="healthy"
              size={70}
            />
          </motion.div>
        ))}
    </div>
  );
}

export const section7Scenes: SceneDef[] = [
  { id: 'chapter-geo', title: 'Chapter: Growing Beyond Manipal', steps: 1, Component: () => (
    <ChapterBreak part="Part 8" title="Growing Beyond Manipal" hook="What happens when LabXam's users aren't all nearby." />
  ), optional: true, notes: 'Pause here. Let the room reset before diving in.' },
  { id: 'latency', title: 'Distance costs time', steps: 3, Component: LatencyScene, optional: true },
  { id: 'geo-distribution', title: 'Regional points of presence', steps: 2, Component: GeoDistScene, optional: true },
];