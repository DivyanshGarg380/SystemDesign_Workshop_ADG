import { motion } from 'framer-motion';

export type PacketVariant = 'request' | 'response' | 'data' | 'blocked' | 'job';

const VARIANT_STYLES: Record<PacketVariant, { bg: string; fg: string; border: string }> = {
  request: { bg: 'var(--color-amber)', fg: 'var(--color-chip-ink)', border: 'var(--color-amber)' },
  response: { bg: 'var(--color-teal)', fg: 'var(--color-chip-ink)', border: 'var(--color-teal)' },
  data: { bg: 'var(--color-panel)', fg: 'var(--color-teal)', border: 'var(--color-teal)' },
  blocked: { bg: 'var(--color-red)', fg: '#fff', border: 'var(--color-red)' },
  job: { bg: 'var(--color-panel)', fg: 'var(--color-amber)', border: 'var(--color-amber)' },
};

/** presentation-scale + slow-motion multipliers — bigger, slower motion reads better live */
const SIZE_SCALE = 1.3;
const SPEED_SCALE = 1.55;

export interface PacketProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  label?: string;
  variant?: PacketVariant;
  duration?: number;
  delay?: number;
  /** stop partway (0-1) instead of completing the trip, e.g. a blocked request */
  stopAt?: number;
  small?: boolean;
}

export default function Packet({
  from, to, label, variant = 'request', duration = 0.9, delay = 0, stopAt = 1, small = false,
}: PacketProps) {
  const style = VARIANT_STYLES[variant];
  const endX = from.x + (to.x - from.x) * stopAt;
  const endY = from.y + (to.y - from.y) * stopAt;
  const h = (small ? 30 : 40) * SIZE_SCALE;
  const dur = duration * SPEED_SCALE;
  const dly = delay * SPEED_SCALE;

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{ left: 0, top: 0 }}
      initial={{ x: from.x, y: from.y, opacity: 0 }}
      animate={{ x: endX, y: endY, opacity: [0, 1, 1, 0] }}
      transition={{
        default: { duration: dur, delay: dly, ease: variant === 'blocked' ? 'easeOut' : 'easeInOut' },
        opacity: { duration: dur + 0.7, delay: dly, times: [0, 0.28, 0.7, 1], ease: 'easeInOut' },
      }}
    >
      <motion.div
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ delay: dly, duration: 0.35 }}
        className="flex items-center justify-center rounded-full font-mono whitespace-nowrap"
        style={{
          height: h, transform: 'translate(-50%, -50%)',
          paddingLeft: label ? 16 : 0, paddingRight: label ? 16 : 0,
          width: label ? 'auto' : h,
          background: style.bg, color: style.fg,
          border: `1.5px solid ${style.border}`,
          fontSize: (small ? 13 : 15) * SIZE_SCALE,
          fontWeight: 600,
          boxShadow: `0 3px 14px -2px ${style.border}77`,
        }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}