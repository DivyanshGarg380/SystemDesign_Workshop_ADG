import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export default function Prompt({ children, show = true }: { children: React.ReactNode; show?: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="absolute left-1/2 bottom-[64px] -translate-x-1/2 z-30 flex items-center gap-3 rounded-full pl-5 pr-7 py-3.5"
          style={{
            background: 'var(--color-panel)',
            border: '1.5px solid var(--color-amber)',
            boxShadow: '0 0 0 1px var(--color-amber), 0 10px 34px -8px rgba(20,24,29,0.25)',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.14, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          >
            <HelpCircle size={27} color="var(--color-amber)" strokeWidth={2} />
          </motion.div>
          <span className="font-display font-semibold text-[24px]" style={{ color: 'var(--color-amber)' }}>
            {children}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}