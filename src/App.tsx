import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { flatScenes, sectionCount } from './data/scenes';
import Stage from './components/stage/Stage';
import ProgressBar from './components/ProgressBar';
import Footer from './components/Footer';

export default function App() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  const scene = flatScenes[sceneIdx];

  const next = useCallback(() => {
    setStep((s) => {
      if (s < scene.steps - 1) return s + 1;
      setSceneIdx((idx) => Math.min(idx + 1, flatScenes.length - 1));
      return 0;
    });
  }, [scene.steps]);

  const prev = useCallback(() => {
    setStep((s) => {
      if (s > 0) return s - 1;
      setSceneIdx((idx) => {
        const newIdx = Math.max(idx - 1, 0);
        setStep(flatScenes[newIdx].steps - 1);
        return newIdx;
      });
      return s;
    });
  }, []);

  const skipSection = useCallback(() => {
    setSceneIdx((idx) => {
      const currentSection = flatScenes[idx].sectionId;
      let nextIdx = idx;
      while (nextIdx < flatScenes.length - 1 && flatScenes[nextIdx].sectionId === currentSection) nextIdx++;
      return nextIdx;
    });
    setStep(0);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (['ArrowRight', ' ', 'Spacebar'].includes(e.key)) { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'Home') { e.preventDefault(); setSceneIdx(0); setStep(0); }
      else if (e.key === 'End') { e.preventDefault(); setSceneIdx(flatScenes.length - 1); setStep(0); }
      else if (e.key.toLowerCase() === 's') { skipSection(); }
      else if (e.key.toLowerCase() === 'n') { setShowNotes((v) => !v); }
      else if (e.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
        else document.exitFullscreen().catch(() => {});
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, skipSection]);

  const SceneComponent = scene.Component;

  return (
    <div className="flex flex-col w-screen h-screen" style={{ background: 'var(--color-void)' }}>
      <ProgressBar scenes={flatScenes} sceneIdx={sceneIdx} sectionCount={sectionCount} />
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
              <SceneComponent step={step} />
            </motion.div>
          </AnimatePresence>
        </Stage>
      </div>
      <Footer notes={scene.notes} showNotes={showNotes} />
    </div>
  );
}
