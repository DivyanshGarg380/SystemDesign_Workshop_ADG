import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Node, Packet, EdgeLayer, Edge, SceneTitle, Prompt, ChapterBreak } from '../stage';
import type { SceneDef } from '../../lib/types';

const USER = { x: 260, y: 500 };
const SERVER = { x: 750, y: 500 };
const DB = { x: 750, y: 760 };

function LargeFileProblemScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 5 · Large Files" title="PDFs and scanned answer sheets are heavy." sub="Every download currently goes through the same application server." />
      <Node x={USER.x} y={USER.y} type="user" label="Student" status="active" />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="App Server" status={step >= 1 ? 'overloaded' : 'idle'} />
      <Node x={DB.x} y={DB.y} type="database" label="Database" status="idle" />
      <EdgeLayer><Edge from={SERVER} to={DB} muted /></EdgeLayer>
      {step >= 1 && (
        <>
          <Packet from={USER} to={SERVER} label="GET exam-2023.pdf" variant="request" duration={0.8} />
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="absolute flex items-center gap-2 font-mono text-[15px]"
            style={{ left: 900, top: 470, color: 'var(--color-red)' }}
          >
            <FileText size={20} /> 40 MB, streamed straight from the app server
          </motion.div>
        </>
      )}
      <Prompt show={step >= 2}>Should a request-handling server also be in the business of streaming 40MB files?</Prompt>
    </div>
  );
}

function ObjectStorageScene({ step }: { step: number }) {
  const STORAGE = { x: 1200, y: 500 };
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 5 · Large Files" title="Move large files off the app server entirely." sub="Object storage is built for exactly this: cheap, durable, byte-in byte-out." />
      <Node x={USER.x} y={USER.y} type="user" label="Student" status="idle" />
      <Node x={SERVER.x} y={SERVER.y} type="server" label="App Server" sublabel="only handles logic now" status="healthy" />
      <Node x={DB.x} y={DB.y} type="database" label="Database" status="idle" />
      <Node x={STORAGE.x} y={STORAGE.y} type="origin" label="Object Storage" sublabel="PDFs, images" status={step >= 1 ? 'active' : 'idle'} />
      <EdgeLayer>
        <Edge from={SERVER} to={DB} muted />
        <Edge from={SERVER} to={STORAGE} muted />
      </EdgeLayer>
      {step >= 1 && <Packet from={USER} to={SERVER} label="GET exam-2023.pdf" variant="request" duration={0.7} />}
      {step >= 2 && <Packet from={SERVER} to={STORAGE} label="here's the file's address" variant="request" duration={0.01} />}
      {step >= 2 && <Packet from={STORAGE} to={USER} label="the actual PDF" variant="data" duration={1} />}
    </div>
  );
}

function DistantOriginScene({ step }: { step: number }) {
  const ORIGIN = { x: 1420, y: 500 };
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 5 · CDN" title="But that storage lives in one place." sub="A student far from that data center still waits a while." />
      <Node x={USER.x} y={USER.y} type="user" label="Student, off-campus" status="active" />
      <Node x={ORIGIN.x} y={ORIGIN.y} type="origin" label="Origin Storage" sublabel="one physical region" status={step >= 1 ? 'active' : 'idle'} />
      <EdgeLayer><Edge from={USER} to={ORIGIN} muted dashed /></EdgeLayer>
      {step >= 1 && <Packet from={USER} to={ORIGIN} label="GET exam-2023.pdf" variant="request" duration={1.6} />}
      {step >= 2 && <Packet from={ORIGIN} to={USER} label="40 MB ·  slow" variant="data" duration={2.1} />}
    </div>
  );
}

function CdnEdgeScene({ step }: { step: number }) {
  const ORIGIN = { x: 1500, y: 260 };
  const EDGE = { x: 620, y: 500 };
  return (
    <div className="absolute inset-0">
      <SceneTitle eyebrow="Part 5 · CDN" title="A CDN keeps copies close to the reader." sub="First request warms a nearby edge location. Every request after that is short." />
      <Node x={USER.x} y={USER.y} type="user" label="Student" status="active" />
      <Node x={EDGE.x} y={EDGE.y} type="cdn" label="Nearby Edge" sublabel={step >= 2 ? 'cached' : 'checking…'} status={step >= 2 ? 'healthy' : 'active'} />
      <Node x={ORIGIN.x} y={ORIGIN.y} type="origin" label="Origin" sublabel="far away" status="muted" size={76} />
      <EdgeLayer>
        <Edge from={USER} to={EDGE} muted />
        <Edge from={EDGE} to={ORIGIN} muted dashed />
      </EdgeLayer>
      {step >= 1 && <Packet from={USER} to={EDGE} label="GET exam-2023.pdf" variant="request" duration={0.5} />}
      {step === 1 && <Packet from={EDGE} to={ORIGIN} label="not cached, fetching once" variant="request" duration={1.3} delay={0.5} />}
      {step >= 2 && <Packet from={EDGE} to={USER} label="40 MB · fast" variant="data" duration={0.5} />}
      {step === 2 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.7 } }} className="absolute font-display font-semibold text-[20px]" style={{ left: 660, top: 700, color: 'var(--color-teal)' }}>
          Same file. A fraction of the distance.
        </motion.p>
      )}
    </div>
  );
}

export const section4Scenes: SceneDef[] = [
  { id: 'chapter-cdn', title: 'Chapter: Large Files & CDN', steps: 1, Component: () => (
    <ChapterBreak part="Part 5" title="Large Files & CDN" hook="Not everything should live on the same server." />
  ), notes: 'Pause here. Let the room reset before diving in.' },
  { id: 'large-file-problem', title: 'Large files strain the app server', steps: 3, Component: LargeFileProblemScene },
  { id: 'object-storage', title: 'Object storage', steps: 3, Component: ObjectStorageScene },
  { id: 'distant-origin', title: 'A distant origin is still slow', steps: 3, Component: DistantOriginScene },
  { id: 'cdn-edge', title: 'CDN: cache near the reader', steps: 3, Component: CdnEdgeScene, notes: 'Core concept, emphasize distance, not magic.' },
];