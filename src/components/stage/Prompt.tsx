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
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="absolute left-1/2 bottom-[64px] -translate-x-1/2 z-30 flex items-center gap-3 rounded-full pl-4 pr-6 py-3"
          style={{
            background: 'var(--color-panel-2)',
            border: '1px solid var(--color-amber)',
            boxShadow: '0 0 0 1px var(--color-amber), 0 8px 32px -8px #000',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <HelpCircle size={24} color="var(--color-amber)" strokeWidth={2} />
          </motion.div>
          <span className="font-display font-semibold text-[22px]" style={{ color: 'var(--color-amber)' }}>
            {children}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
