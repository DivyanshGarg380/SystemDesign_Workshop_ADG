import { motion } from 'framer-motion';

export default function SceneTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute left-[72px] top-[52px] max-w-[900px]"
    >
      {eyebrow && (
        <div className="font-mono text-[25px] tracking-[0.14em] uppercase mb-2" style={{ color: 'var(--color-amber)' }}>
          {eyebrow}
        </div>
      )}
      <h1 className="font-display font-semibold text-[46px] leading-[1.08]" style={{ color: 'var(--color-ink-100)' }}>
        {title}
      </h1>
      {sub && (
        <p className="font-body text-[21px] mt-2.5" style={{ color: 'var(--color-ink-400)' }}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}