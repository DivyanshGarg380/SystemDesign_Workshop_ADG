import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Node, EdgeLayer, Edge, SceneTitle, Prompt } from '../stage';
import type { SceneDef } from '../../lib/types';

function LearnToDrawIntroScene() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-[1000px]"
      >
        <div
          className="font-mono text-[40px] tracking-[0.16em] uppercase mb-5"
          style={{ color: 'var(--color-amber)' }}
        >
          Before we go further
        </div>

        <h1
          className="font-display font-semibold text-[46px] leading-tight"
          style={{ color: 'var(--color-ink-100)' }}
        >
          Let's learn to draw an architecture diagram
        </h1>

        <p
          className="font-body text-[20px] mt-8"
          style={{ color: 'var(--color-ink-400)' }}
        >
          A skill you'll use for the rest of tonight, and for every system you
          design after this.
        </p>
      </motion.div>
    </div>
  );
}

const RULES = [
  'Start with the user — that is always the first box.',
  'One box per responsibility, not per file or class.',
  'Arrows show direction: who calls whom.',
  'Label what a box does, not what it happens to be built with.',
  'If a box needs a paragraph to explain, split it or cut it.',
];

function HowToDrawScene({ step }: { step: number }) {
  const shown = Math.min(step + 1, RULES.length);

  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 2 · Before We Sketch"
        title="How to draw an architecture diagram"
        sub="Let's keep it simple. This is not a UML class diagram."
      />

      <div
        className="absolute flex flex-col gap-8"
        style={{ left: 100, top: 280, width: 1050 }}
      >
        {RULES.slice(0, shown).map((rule, index) => (
          <motion.div
            key={rule}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start gap-5"
          >
            <span
              className="font-mono text-[17px] mt-0.5 shrink-0"
              style={{ color: 'var(--color-teal)' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>

            <span
              className="font-body text-[23px] leading-snug"
              style={{ color: 'var(--color-ink-100)' }}
            >
              {rule}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const AR_STUDENT = { x: 180, y: 400 };
const AR_WEBAPP = { x: 650, y: 400 };
const AR_SUBMISSIONS = { x: 1180, y: 220 };
const AR_DB = { x: 1180, y: 520 };
const AR_ADMIN = { x: 180, y: 760 };
const AR_AUTH = { x: 420, y: 760 };
const AR_AI_HINT = { x: 1450, y: 680 };

function LabXamNodes({ step }: { step: number }) {
  return (
    <>
      {/* Main architecture */}

      <Node
        x={AR_STUDENT.x}
        y={AR_STUDENT.y}
        type="user"
        label="Student"
        status="healthy"
      />

      {step >= 1 && (
        <Node
          x={AR_WEBAPP.x}
          y={AR_WEBAPP.y}
          type="server"
          label="LabXam"
          sublabel="React & TypeScript"
          status="healthy"
        />
      )}

      {/* Submission / review flow — intentionally above database */}

      {step >= 3 && (
        <Node
          x={AR_SUBMISSIONS.x}
          y={AR_SUBMISSIONS.y}
          type="queue"
          label="Review Queue"
          sublabel="New submissions & reports"
          status="healthy"
        />
      )}

      {/* Live database */}

      {step >= 2 && (
        <Node
          x={AR_DB.x}
          y={AR_DB.y}
          type="database"
          label="Question Database"
          sublabel="Supabase Postgres"
          status="healthy"
        />
      )}

      {/* Protected admin flow */}

      {step >= 4 && (
        <Node
          x={AR_ADMIN.x}
          y={AR_ADMIN.y}
          type="user"
          label="Admin"
          status="healthy"
        />
      )}

      {step >= 5 && (
        <Node
          x={AR_AUTH.x}
          y={AR_AUTH.y}
          type="gate"
          label="Admin Auth"
          sublabel="Only admins pass"
          status="healthy"
          size={84}
        />
      )}

      <EdgeLayer>
        {/* Student uses LabXam */}
        {step >= 1 && <Edge from={AR_STUDENT} to={AR_WEBAPP} />}

        {/* LabXam reads from the live question database */}
        {step >= 2 && <Edge from={AR_WEBAPP} to={AR_DB} />}

        {/* Public submissions enter the review queue */}
        {step >= 3 && (
          <Edge from={AR_WEBAPP} to={AR_SUBMISSIONS} />
        )}

        {/* Protected admin path */}
        {step >= 5 && <Edge from={AR_ADMIN} to={AR_AUTH} />}
        {step >= 5 && <Edge from={AR_AUTH} to={AR_WEBAPP} />}

        {/* Approved submissions eventually reach the live database */}
        {step >= 5 && (
          <Edge from={AR_SUBMISSIONS} to={AR_DB} dashed />
        )}
      </EdgeLayer>
    </>
  );
}

function AIHint() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute flex flex-col items-center"
      style={{
        left: AR_AI_HINT.x - 47,
        top: AR_AI_HINT.y - 47,
      }}
    >
      <div
        className="rounded-2xl flex items-center justify-center"
        style={{
          width: 94,
          height: 94,
          border: '2.5px dashed var(--color-amber)',
          background: 'transparent',
        }}
      >
        <Sparkles
          size={38}
          color="var(--color-amber)"
          strokeWidth={1.75}
        />
      </div>

      <div className="mt-3 text-center leading-tight">
        <div
          className="font-display font-semibold text-[19px]"
          style={{ color: 'var(--color-amber)' }}
        >
          AI Solutions?
        </div>

        <div
          className="font-mono text-[13.5px] mt-1"
          style={{ color: 'var(--color-ink-400)' }}
        >
          yours to draw next
        </div>
      </div>
    </motion.div>
  );
}

function LabXamArchitectureScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 2 · LabXam's Architecture"
        title="Let's build it, one box at a time"
        sub="Public reading and submission. Protected approval."
      />

      <LabXamNodes step={step} />

      {step >= 6 && <AIHint />}
    </div>
  );
}

function AIExerciseScene({ step }: { step: number }) {
  return (
    <div className="absolute inset-0">
      <SceneTitle
        eyebrow="Part 2 · Your Turn"
        title="Sketch the missing piece"
        sub="Where does the AI-generated solution fit into this picture?"
      />

      {/* Existing architecture is visible but faded */}
      <div style={{ opacity: 0.42 }}>
        <LabXamNodes step={5} />
      </div>

      {/* The missing piece */}
      <AIHint />

      <Prompt show={step >= 1}>
        Grab a piece of paper and start drawing.
      </Prompt>
    </div>
  );
}

export const architectureScenes: SceneDef[] = [
  {
    id: 'learn-to-draw-intro',
    title: "Let's learn to draw an architecture diagram",
    steps: 1,
    Component: LearnToDrawIntroScene,
    notes:
      'Short beat. Let it land before moving into the how-to rules.',
  },
  {
    id: 'how-to-draw',
    title: 'How to draw an architecture diagram',
    steps: 5,
    Component: HowToDrawScene,
    notes:
      'Teach this live. Keep each rule short — the room should be able to repeat it back.',
  },
  {
    id: 'labxam-architecture-build',
    title: "LabXam's architecture, built piece by piece",
    steps: 7,
    Component: LabXamArchitectureScene,
    notes:
      'Build the main path first: Student → LabXam → Question Database. Then add the review queue above the database, followed by the admin and authentication gate. Land the key point: reading and submitting are public, but only an authenticated admin can approve content into the live database.',
  },
  {
    id: 'ai-solution-exercise',
    title: 'Exercise: sketch the AI solution',
    steps: 2,
    Component: AIExerciseScene,
    notes:
      'Let them actually draw on paper before moving on. Do not reveal the real architecture yet — that comes later in the deep dive.',
  },
];