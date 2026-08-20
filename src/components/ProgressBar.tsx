import type { FlatScene } from '../lib/types';

export default function ProgressBar({
  scenes, sceneIdx, sectionCount,
}: { scenes: FlatScene[]; sceneIdx: number; sectionCount: number }) {
  const current = scenes[sceneIdx];
  const sectionScenes = scenes.filter((s) => s.sectionId === current.sectionId);
  const sceneInSection = sectionScenes.findIndex((s) => s.id === current.id);

  return (
    <div className="w-full h-[40px] flex items-center px-6 gap-4 shrink-0" style={{ borderBottom: '1px solid var(--color-line-soft)' }}>
      <span className="font-mono text-[11px]" style={{ color: 'var(--color-ink-600)' }}>
        {String(current.sectionIndex + 1).padStart(2, '0')} / {String(sectionCount).padStart(2, '0')}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color: current.optional ? 'var(--color-ink-600)' : 'var(--color-amber)' }}>
        {current.sectionTitle}{current.optional ? ' · optional' : ''}
      </span>
      <div className="flex-1 flex items-center gap-1.5">
        {Array.from({ length: sectionCount }).map((_, i) => (
          <div
            key={i}
            className="h-[3px] flex-1 rounded-full"
            style={{
              background: i < current.sectionIndex ? 'var(--color-ink-600)'
                : i === current.sectionIndex ? 'var(--color-amber)'
                : 'var(--color-line-soft)',
              opacity: i === current.sectionIndex ? 1 : i < current.sectionIndex ? 0.6 : 0.4,
            }}
          />
        ))}
      </div>
      <span className="font-mono text-[11px]" style={{ color: 'var(--color-ink-600)' }}>
        scene {sceneInSection + 1}/{sectionScenes.length}
      </span>
    </div>
  );
}
