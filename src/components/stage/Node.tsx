import { motion } from 'framer-motion';
import {
  User, Server, Database, Zap, ListOrdered, Cpu, Globe2, Search,
  Shuffle, HardDrive, Radio, ScrollText, Gauge, Waypoints, XCircle,
  type LucideIcon,
} from 'lucide-react';

export type NodeType =
  | 'user' | 'server' | 'database' | 'cache' | 'queue' | 'worker'
  | 'cdn' | 'search' | 'loadbalancer' | 'origin' | 'gate' | 'log'
  | 'metric' | 'trace' | 'replica';

export type NodeStatus = 'idle' | 'active' | 'overloaded' | 'failed' | 'healthy' | 'muted';

const ICONS: Record<NodeType, LucideIcon> = {
  user: User,
  server: Server,
  database: Database,
  cache: Zap,
  queue: ListOrdered,
  worker: Cpu,
  cdn: Globe2,
  search: Search,
  loadbalancer: Shuffle,
  origin: HardDrive,
  gate: Waypoints,
  log: ScrollText,
  metric: Gauge,
  trace: Radio,
  replica: Database,
};

const STATUS_STYLES: Record<NodeStatus, { border: string; glow: string; icon: string; bg: string }> = {
  idle: { border: 'var(--color-line)', glow: 'none', icon: 'var(--color-ink-400)', bg: 'var(--color-panel)' },
  active: { border: 'var(--color-amber)', glow: '0 0 0 1px var(--color-amber), 0 10px 24px -10px var(--color-amber)', icon: 'var(--color-amber)', bg: 'var(--color-panel)' },
  overloaded: { border: 'var(--color-red)', glow: '0 0 0 1px var(--color-red), 0 10px 26px -8px var(--color-red)', icon: 'var(--color-red)', bg: 'var(--color-panel)' },
  failed: { border: 'var(--color-red)', glow: 'none', icon: 'var(--color-red)', bg: 'var(--color-panel-2)' },
  healthy: { border: 'var(--color-teal)', glow: '0 0 0 1px var(--color-teal), 0 8px 20px -10px var(--color-teal)', icon: 'var(--color-teal)', bg: 'var(--color-panel)' },
  muted: { border: 'var(--color-line-soft)', glow: 'none', icon: 'var(--color-ink-600)', bg: 'transparent' },
};

export interface NodeProps {
  id?: string;
  x: number;
  y: number;
  type: NodeType;
  label: string;
  sublabel?: string;
  status?: NodeStatus;
  size?: number;
  /** shows a small numeric badge, e.g. queue depth */
  badge?: number | string;
  delay?: number;
}

export default function Node({ x, y, type, label, sublabel, status = 'idle', size = 96, badge, delay = 0 }: NodeProps) {
  const Icon = ICONS[type];
  const style = STATUS_STYLES[status];
  const failed = status === 'failed';

  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{ left: 0, top: 0, width: size }}
      animate={{ x: x - size / 2, y: y - size / 2 - 22 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18, delay }}
    >
      <motion.div
        className="relative flex items-center justify-center rounded-2xl"
        style={{ width: size, height: size, background: style.bg, border: `2px solid ${style.border}`, boxShadow: '0 1px 3px rgba(20,24,29,0.08)' }}
        animate={{
          boxShadow: style.glow === 'none' ? '0 1px 3px rgba(20,24,29,0.08)' : `${style.glow}, 0 1px 3px rgba(20,24,29,0.08)`,
          opacity: failed ? 0.45 : 1,
          filter: failed ? 'grayscale(0.6)' : 'grayscale(0)',
          scale: status === 'overloaded' ? [1, 1.03, 1] : 1,
        }}
        transition={status === 'overloaded'
          ? { scale: { repeat: Infinity, duration: 0.9, ease: 'easeInOut' }, default: { duration: 0.4 } }
          : { duration: 0.4 }}
      >
        <Icon size={size * 0.42} color={style.icon} strokeWidth={1.75} />
        {failed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-2.5 -right-2.5 rounded-full bg-[var(--color-void)]"
          >
            <XCircle size={22} color="var(--color-red)" strokeWidth={2} />
          </motion.div>
        )}
        {badge !== undefined && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-3 -right-3 min-w-[26px] h-[26px] px-1.5 rounded-full flex items-center justify-center font-mono text-[13px] font-semibold"
            style={{ background: 'var(--color-amber)', color: 'var(--color-chip-ink)' }}
          >
            {badge}
          </motion.div>
        )}
      </motion.div>
      <div className="mt-2.5 text-center leading-tight">
        <div className="font-display font-semibold text-[16px]" style={{ color: failed ? 'var(--color-ink-600)' : 'var(--color-ink-100)' }}>
          {label}
        </div>
        {sublabel && (
          <div className="font-mono text-[12px] mt-0.5" style={{ color: 'var(--color-ink-400)' }}>
            {sublabel}
          </div>
        )}
      </div>
    </motion.div>
  );
}
