import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { flatScenes, sectionCount } from './data/scenes';
import Stage from './components/stage/Stage';
import ProgressBar from './components/ProgressBar';
import Footer from './components/Footer';
import SceneOverview from './components/Sceneoverview';
interface Pos { sceneIdx: number; step: number }

export default function App() {
  // sceneIdx and step are updated together, atomically, from a single source of truth
  // (flatScenes, looked up fresh inside the updater). This is what prevents the
  // "next" skip/stick bug that stale closures over two separate useState calls caused.
  const [pos, setPos] = useState<Pos>({ sceneIdx: 0, step: 0 });
  const [showNotes, setShowNotes] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);

  const scene = flatScenes[pos.sceneIdx];

  const next = useCallback(() => {
    setPos((p) => {
      const current = flatScenes[p.sceneIdx];
      if (p.step < current.steps - 1) return { sceneIdx: p.sceneIdx, step: p.step + 1 };
      const nextIdx = Math.min(p.sceneIdx + 1, flatScenes.length - 1);
      return { sceneIdx: nextIdx, step: 0 };
    });
  }, []);

  const prev = useCallback(() => {
    setPos((p) => {
      if (p.step > 0) return { sceneIdx: p.sceneIdx, step: p.step - 1 };
      const prevIdx = Math.max(p.sceneIdx - 1, 0);
      return { sceneIdx: prevIdx, step: Math.max(flatScenes[prevIdx].steps - 1, 0) };
    });
  }, []);

  const skipSection = useCallback(() => {
    setPos((p) => {
      const currentSection = flatScenes[p.sceneIdx].sectionId;
      let nextIdx = p.sceneIdx;
      while (nextIdx < flatScenes.length - 1 && flatScenes[nextIdx].sectionId === currentSection) nextIdx++;
      return { sceneIdx: nextIdx, step: 0 };
    });
  }, []);

  const jumpTo = useCallback((index: number) => {
    setPos({ sceneIdx: index, step: 0 });
    setOverviewOpen(false);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { if (overviewOpen) { e.preventDefault(); setOverviewOpen(false); } return; }
      if (e.key.toLowerCase() === 'o') { e.preventDefault(); setOverviewOpen((v) => !v); return; }
      if (overviewOpen) return;
      if (['ArrowRight', ' ', 'Spacebar'].includes(e.key)) { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'Home') { e.preventDefault(); setPos({ sceneIdx: 0, step: 0 }); }
      else if (e.key === 'End') { e.preventDefault(); setPos({ sceneIdx: flatScenes.length - 1, step: 0 }); }
      else if (e.key.toLowerCase() === 's') { skipSection(); }
      else if (e.key.toLowerCase() === 'n') { setShowNotes((v) => !v); }
      else if (e.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
        else document.exitFullscreen().catch(() => {});
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, skipSection, overviewOpen]);

  const SceneComponent = scene.Component;

  return (
    <div className="flex flex-col w-screen h-screen" style={{ background: 'var(--color-void)' }}>
      <ProgressBar scenes={flatScenes} sceneIdx={pos.sceneIdx} sectionCount={sectionCount} onOpenOverview={() => setOverviewOpen(true)} />
      <div className="relative flex-1 min-h-0">
        <Stage>
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <SceneComponent step={pos.step} />
            </motion.div>
          </AnimatePresence>
        </Stage>
      </div>
      <Footer notes={scene.notes} showNotes={showNotes} />
      <SceneOverview
        scenes={flatScenes}
        currentSceneId={scene.id}
        open={overviewOpen}
        onJump={jumpTo}
        onClose={() => setOverviewOpen(false)}
      />
    </div>
  );
}