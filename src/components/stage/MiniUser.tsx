import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function MiniUser({ x, y, delay = 0, blocked = false }: { x: number; y: number; delay?: number; blocked?: boolean }) {
  const dly = delay * 1.4;
  return (
    <motion.div
      className="absolute rounded-full flex items-center justify-center"
      style={{
        left: 0, top: 0, width: 42, height: 42,
        background: 'var(--color-panel)',
        border: `1.5px solid ${blocked ? 'var(--color-red)' : 'var(--color-line)'}`,
        boxShadow: '0 1px 3px rgba(20,24,29,0.08)',
      }}
      initial={{ x: x - 21, y: y - 21, opacity: 0, scale: 0.5 }}
      animate={{ x: x - 21, y: y - 21, opacity: 1, scale: 1 }}
      transition={{ delay: dly, duration: 0.5, type: 'spring', stiffness: 140, damping: 17 }}
    >
      <User size={20} color={blocked ? 'var(--color-red)' : 'var(--color-ink-400)'} strokeWidth={2} />
    </motion.div>
  );
}