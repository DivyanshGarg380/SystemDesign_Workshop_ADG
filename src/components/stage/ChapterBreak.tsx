import { motion } from 'framer-motion';

export default function ChapterBreak({
  part, title, hook,
}: { part: string; title: string; hook: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-[980px]"
      >
        <div className="font-mono text-[30px] tracking-[0.22em] uppercase mb-5" style={{ color: 'var(--color-amber)' }}>
          {part}
        </div>
        <h1 className="font-display font-semibold text-[54px] leading-tight" style={{ color: 'var(--color-ink-100)' }}>
          {title}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="font-body text-[25px] mt-6"
          style={{ color: 'var(--color-ink-400)' }}
        >
          {hook}
        </motion.p>
      </motion.div>
    </div>
  );
}