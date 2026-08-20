import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function MiniUser({ x, y, delay = 0, blocked = false }: { x: number; y: number; delay?: number; blocked?: boolean }) {
  return (
    <motion.div
      className="absolute rounded-full flex items-center justify-center"
      style={{
        left: 0, top: 0, width: 34, height: 34,
        background: 'var(--color-panel-2)',
        border: `1.5px solid ${blocked ? 'var(--color-red)' : 'var(--color-line)'}`,
      }}
      initial={{ x: x - 17, y: y - 17, opacity: 0, scale: 0.5 }}
      animate={{ x: x - 17, y: y - 17, opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.35, type: 'spring', stiffness: 200, damping: 16 }}
    >
      <User size={17} color={blocked ? 'var(--color-red)' : 'var(--color-ink-400)'} strokeWidth={2} />
    </motion.div>
  );
}
