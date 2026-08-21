import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { FlatScene } from '../lib/types';

export default function SceneOverview({
  scenes, currentSceneId, open, onJump, onClose,
}: {
  scenes: FlatScene[];
  currentSceneId: string;
  open: boolean;
  onJump: (index: number) => void;
  onClose: () => void;
}) {
  const sections: { id: string; title: string; eyebrow: string; optional?: boolean; items: { scene: FlatScene; index: number }[] }[] = [];
  scenes.forEach((scene, index) => {
    let bucket = sections.find((s) => s.id === scene.sectionId);
    if (!bucket) {
      bucket = { id: scene.sectionId, title: scene.sectionTitle, eyebrow: scene.sectionEyebrow, optional: scene.optional, items: [] };
      sections.push(bucket);
    }
    bucket.items.push({ scene, index });
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ background: 'rgba(20,24,29,0.45)', backdropFilter: 'blur(3px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[1180px] max-h-[85vh] rounded-[28px] overflow-hidden flex flex-col"
            style={{ background: 'var(--color-panel)', border: '1px solid var(--color-line-soft)', boxShadow: '0 30px 80px -20px rgba(20,24,29,0.35)' }}
          >
            <div className="flex items-center justify-between px-8 py-6 shrink-0" style={{ borderBottom: '1px solid var(--color-line-soft)' }}>
              <div>
                <div className="font-mono text-[13px] tracking-[0.14em] uppercase" style={{ color: 'var(--color-amber)' }}>All Scenes</div>
                <h2 className="font-display font-semibold text-[26px] mt-0.5" style={{ color: 'var(--color-ink-100)' }}>Jump to any part of the deck</h2>
              </div>
              <button
                onClick={onClose}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'var(--color-panel-2)', border: '1px solid var(--color-line-soft)' }}
              >
                <X size={20} color="var(--color-ink-400)" />
              </button>
            </div>

            <div className="overflow-y-auto px-8 py-6 flex flex-col gap-7">
              {sections.map((section, si) => (
                <div key={section.id}>
                  <div className="flex items-baseline gap-2.5 mb-3">
                    <span className="font-mono text-[12.5px]" style={{ color: 'var(--color-ink-600)' }}>{String(si + 1).padStart(2, '0')}</span>
                    <h3 className="font-display font-semibold text-[18px]" style={{ color: 'var(--color-ink-100)' }}>{section.title}</h3>
                    {section.optional && (
                      <span className="font-mono text-[10.5px] uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ color: 'var(--color-ink-600)', border: '1px solid var(--color-line)' }}>
                        optional
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {section.items.map(({ scene, index }) => {
                      const active = scene.id === currentSceneId;
                      return (
                        <button
                          key={scene.id}
                          onClick={() => onJump(index)}
                          className="text-left px-4 py-2.5 rounded-xl transition-transform"
                          style={{
                            background: active ? 'var(--color-amber-soft)' : 'var(--color-panel-2)',
                            border: `1.5px solid ${active ? 'var(--color-amber)' : 'var(--color-line-soft)'}`,
                            minWidth: 160,
                          }}
                        >
                          <div className="font-mono text-[11px]" style={{ color: active ? 'var(--color-amber)' : 'var(--color-ink-600)' }}>
                            scene {index + 1}
                          </div>
                          <div className="font-body text-[14px] font-medium mt-0.5" style={{ color: 'var(--color-ink-100)' }}>
                            {scene.title}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}