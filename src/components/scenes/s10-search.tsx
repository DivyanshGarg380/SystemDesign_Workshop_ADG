import { motion } from 'framer-motion';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, Prompt, ChapterBreak } from '../stage';
import type { SceneDef } from '../../lib/types';

const USER = { x: 260, y: 480 };
const SERVER = { x: 700, y: 480 };
const DB = { x: 1150, y: 480 };

function ScanProblemScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 11 · Optional, Large-Scale Search" title='"Search all lab exams for \u2018pointer arithmetic\u2019."' sub="LabXam now holds hundreds of thousands of questions." />
      <Node x={USER.x} y={USER.y} type="user" label="Student" status="active" />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" status={step >= 1 ? 'active' : 'idle'} />
      <Node x={DB.x} y={DB.y} type="database" label="Database" sublabel="700k rows" status={step >= 1 ? 'overloaded' : 'idle'} />
      <EdgeLayer><Edge from={SERVER} to={DB} muted /></EdgeLayer>
      {step >= 1 && <Packet from={USER} to={SERVER} label="search: pointer arithmetic" variant="request" duration={1.2} />}
      {step >= 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.4 } }} className="absolute font-mono text-[14px]" style={{ left: 970, top: 590, color: 'var(--color-red)', width: 280 }}>
          scanning every row, checking every word…
        </motion.div>
      )}
      <Prompt show={step >= 2}>A plain query checks rows one by one. What happens as the table keeps growing?</Prompt>
    </div>
  );
}

function SearchIndexScene({ step }: { step: number }) {
  const INDEX = { x: 950, y: 480 };
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 11 · Optional" title="A search index, built ahead of time." sub="Tools like Elasticsearch or OpenSearch keep a structure made for searching text, kept in sync with the database." />
      <Node x={USER.x} y={USER.y} type="user" label="Student" status="idle" />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="Server" status="idle" />
      <Node x={DB.x} y={DB.y} type="database" label="Database" sublabel="source of truth" status="idle" size={80} />
      <Node x={INDEX.x} y={340} type="search" label="Search Index" sublabel="built for text lookup" status={step >= 1 ? 'active' : 'idle'} />
      <EdgeLayer>
        <Edge from={SERVER} to={DB} muted />
        <Edge from={DB} to={{ x: INDEX.x, y: 340 }} muted dashed />
        <Edge from={SERVER} to={{ x: INDEX.x, y: 340 }} muted />
      </EdgeLayer>
      {step >= 1 && <Packet from={DB} to={{ x: INDEX.x, y: 340 }} label="keep in sync" variant="data" duration={1.2} />}
      {step >= 2 && <Packet from={USER} to={SERVER} label="search: pointer arithmetic" variant="request" duration={1.1} />}
      {step >= 2 && <Packet from={SERVER} to={{ x: INDEX.x, y: 340 }} label="search" variant="request" duration={1.1} delay={0.4} />}
      {step >= 3 && <Packet from={{ x: INDEX.x, y: 340 }} to={USER} label="47 matches, instantly" variant="response" duration={1.3} />}
    </div>
  );
}

export const section10Scenes: SceneDef[] = [
  { id: 'chapter-search', title: 'Chapter: Large-Scale Search', steps: 1, Component: () => (
    <ChapterBreak part="Part 11 · Optional" title="Large-Scale Search" hook="Finding one paper in a hundred thousand." />
  ), optional: true, notes: 'Pause here. Let the room reset before diving in.' },
  { id: 'scan-problem', title: 'A plain query doesn\u2019t scale for search', steps: 3, Component: ScanProblemScene, optional: true },
  { id: 'search-index', title: 'The search index', steps: 4, Component: SearchIndexScene, optional: true },
];