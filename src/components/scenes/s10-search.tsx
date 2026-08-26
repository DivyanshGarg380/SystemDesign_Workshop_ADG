import { motion } from 'framer-motion';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, Prompt, ChapterBreak } from '../stage';
import type { SceneDef } from '../../lib/types';

const USER = { x: 260, y: 480 };
const SERVER = { x: 700, y: 480 };
const DB = { x: 1150, y: 480 };

function ScanProblemScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 11 · Large-Scale Search"
        title='"Search all exam questions for u/2024"'
        sub="LabXam now holds hundreds of thousands of questions."
      />

      <Node
        x={USER.x}
        y={USER.y}
        type="user"
        label="Student"
        status="active"
      />

      <Node
        x={SERVER.x}
        y={SERVER.y}
        type="server"
        label="Server"
        status="idle"
      />

      {/* DB starts idle */}
      <Node
        x={DB.x}
        y={DB.y}
        type="database"
        label="Database"
        sublabel="700k rows"
        status="idle"
      />

      <EdgeLayer>
        <Edge from={USER} to={SERVER} muted />
        <Edge from={SERVER} to={DB} muted />
      </EdgeLayer>

      {/* Student sends search request */}
      {step >= 1 && (
        <Packet
          from={USER}
          to={SERVER}
          label="search: DBMS"
          variant="request"
          duration={1.2}
        />
      )}

      {/* Server forwards search to DB after receiving it */}
      {step >= 1 && (
        <Packet
          from={SERVER}
          to={DB}
          label="search query"
          variant="request"
          duration={1}
          delay={1}
        />
      )}

      {/* DB starts struggling only after query reaches it */}
      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 3.5},
          }}
        >
          <Node
            x={DB.x}
            y={DB.y}
            type="database"
            label="Database"
            sublabel="700k rows"
            status="overloaded"
          />
        </motion.div>
      )}

      {/* Scan message appears after DB receives the query */}
      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 1.9 },
          }}
          className="absolute font-mono text-[14px]"
          style={{
            left: 970,
            top: 590,
            color: 'var(--color-red)',
            width: 280,
          }}
        >
          scanning every row, checking every word…
        </motion.div>
      )}

      <Prompt show={step >= 2}>
        A plain query checks rows one by one. What happens as the table keeps growing?
      </Prompt>
    </div>
  );
}

function SearchIndexScene({ step }: { step: number }) {
  const INDEX = { x: 950, y: 340 };

  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 11 · Large-Scale Search"
        title="A search index, built ahead of time"
        sub="Tools like Elasticsearch or OpenSearch keep a structure made for searching text, kept in sync with the database."
      />

      <Node
        x={USER.x}
        y={USER.y}
        type="user"
        label="Student"
        status="idle"
      />

      <Node
        x={SERVER.x}
        y={SERVER.y}
        type="server"
        label="Server"
        status="idle"
      />

      <Node
        x={DB.x}
        y={DB.y}
        type="database"
        label="Database"
        sublabel="source of truth"
        status="idle"
        size={80}
      />

      {/* Search Index starts idle */}
      <Node
        x={INDEX.x}
        y={INDEX.y}
        type="search"
        label="Search Index"
        sublabel="built for text lookup"
        status="idle"
      />

      <EdgeLayer>
        <Edge from={SERVER} to={DB} muted />
        <Edge from={DB} to={INDEX} muted dashed />
        <Edge from={SERVER} to={INDEX} muted />
      </EdgeLayer>

      {/* Step 1: DB syncs data to the index */}
      {step >= 1 && (
        <Packet
          from={DB}
          to={INDEX}
          label="keep in sync"
          variant="data"
          duration={1.2}
        />
      )}

      {/* Index becomes active only after sync arrives */}
      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 1.2 },
          }}
        >
          <Node
            x={INDEX.x}
            y={INDEX.y}
            type="search"
            label="Search Index"
            sublabel="built for text lookup"
            status="active"
          />
        </motion.div>
      )}

      {/* Step 2: Student sends search request */}
      {step >= 2 && (
        <Packet
          from={USER}
          to={SERVER}
          label="search: DBMS"
          variant="request"
          duration={1.1}
        />
      )}

      {/* Server searches only AFTER receiving the request */}
      {step >= 2 && (
        <Packet
          from={SERVER}
          to={INDEX}
          label="search"
          variant="request"
          duration={1.1}
          delay={1.1}
        />
      )}

      {/* Step 3: Search result returns */}
      {step >= 3 && (
        <Packet
          from={INDEX}
          to={USER}
          label="47 matches, instantly"
          variant="response"
          duration={1.3}
        />
      )}
    </div>
  );
}

export const section10Scenes: SceneDef[] = [
  { id: 'chapter-search', title: 'Chapter: Large-Scale Search', steps: 1, Component: () => (
    <ChapterBreak part="Part 11" title="Large-Scale Search" hook="Finding one paper in a hundred thousand." />
  ), optional: true, notes: 'Pause here. Let the room reset before diving in.' },
  { id: 'scan-problem', title: 'A plain query doesn\u2019t scale for search', steps: 3, Component: ScanProblemScene, optional: true },
  { id: 'search-index', title: 'The search index', steps: 4, Component: SearchIndexScene, optional: true },
];