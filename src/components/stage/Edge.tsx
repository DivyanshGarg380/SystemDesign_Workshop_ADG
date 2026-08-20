import { motion } from 'framer-motion';

export interface EdgeProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  active?: boolean;
  dashed?: boolean;
  muted?: boolean;
  color?: string;
}

export function Edge({ from, to, active = false, dashed = false, muted = false, color }: EdgeProps) {
  const stroke = color ?? (active ? 'var(--color-amber)' : muted ? 'var(--color-line-soft)' : 'var(--color-line)');
  return (
    <motion.line
      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
      stroke={stroke}
      strokeWidth={active ? 2.5 : 2}
      strokeDasharray={dashed ? '6 6' : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: muted ? 0.3 : 1 }}
      transition={{ duration: 0.4 }}
    />
  );
}

export function EdgeLayer({ children }: { children: React.ReactNode }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1600 900" style={{ overflow: 'visible' }}>
      {children}
    </svg>
  );
}
