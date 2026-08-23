import { motion } from 'framer-motion';
import {
  User, Server, Database, Zap, ListOrdered, Cpu, Globe2, Search,
  Shuffle, HardDrive, Radio, ScrollText, Gauge, Waypoints, XCircle, Compass,
  type LucideIcon,
} from 'lucide-react';

export type NodeType =
  | 'user' | 'server' | 'database' | 'cache' | 'queue' | 'worker'
  | 'cdn' | 'search' | 'loadbalancer' | 'origin' | 'gate' | 'log'
  | 'metric' | 'trace' | 'replica' | 'dns';

export type NodeStatus = 'idle' | 'active' | 'overloaded' | 'failed' | 'healthy' | 'muted';

/** presentation-scale multiplier: bigger components read better from the back of a room */
const SIZE_SCALE = 1.22;

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
  dns: Compass,
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
  const scaledSize = size * SIZE_SCALE;

  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{ left: 0, top: 0, width: scaledSize }}
      animate={{ x: x - scaledSize / 2, y: y - scaledSize / 2 - 24 }}
      transition={{ type: 'tween', duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
    >
      <motion.div
        key={failed ? 'failed' : 'ok'}
        className="relative flex items-center justify-center rounded-2xl"
        style={{ width: scaledSize, height: scaledSize, background: style.bg, border: `2.5px solid ${style.border}`, boxShadow: '0 1px 3px rgba(20,24,29,0.08)' }}
        initial={failed ? {
          opacity: 1, x: 0, filter: 'grayscale(0)',
          boxShadow: '0 0 0 1px var(--color-teal), 0 8px 20px -10px var(--color-teal), 0 1px 3px rgba(20,24,29,0.08)',
        } : false}
        animate={failed ? {
          x: [0, -10, 10, -8, 8, -4, 4, 0],
          boxShadow: [
            '0 0 0 1.5px var(--color-red), 0 0 34px -2px var(--color-red), 0 1px 3px rgba(20,24,29,0.08)',
            '0 0 0 1.5px var(--color-red), 0 0 34px -2px var(--color-red), 0 1px 3px rgba(20,24,29,0.08)',
            '0 1px 3px rgba(20,24,29,0.08)',
          ],
          opacity: [1, 1, 0.45],
          filter: ['grayscale(0)', 'grayscale(0.25)', 'grayscale(0.6)'],
        } : {
          boxShadow: style.glow === 'none' ? '0 1px 3px rgba(20,24,29,0.08)' : `${style.glow}, 0 1px 3px rgba(20,24,29,0.08)`,
          opacity: 1,
          filter: 'grayscale(0)',
          scale: status === 'overloaded' ? [1, 1.035, 1] : 1,
        }}
        transition={failed ? {
          x: { duration: 0.65, ease: 'easeInOut' },
          boxShadow: { duration: 1.3, times: [0, 0.5, 1], ease: 'easeInOut' },
          opacity: { duration: 1.3, times: [0, 0.5, 1], ease: 'easeInOut' },
          filter: { duration: 1.3, times: [0, 0.5, 1], ease: 'easeInOut' },
        } : status === 'overloaded'
          ? { scale: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }, default: { duration: 0.6 } }
          : { duration: 0.6 }}
      >
        <Icon size={scaledSize * 0.42} color={style.icon} strokeWidth={1.75} />
        {failed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.75 }}
            className="absolute -top-3 -right-3 rounded-full bg-[var(--color-void)]"
          >
            <XCircle size={26} color="var(--color-red)" strokeWidth={2} />
          </motion.div>
        )}
        {badge !== undefined && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute -top-3.5 -right-3.5 min-w-[32px] h-[32px] px-2 rounded-full flex items-center justify-center font-mono text-[15px] font-semibold"
            style={{ background: 'var(--color-amber)', color: 'var(--color-chip-ink)' }}
          >
            {badge}
          </motion.div>
        )}
      </motion.div>
      <div className="mt-3 text-center leading-tight">
        <div className="font-display font-semibold text-[19px]" style={{ color: failed ? 'var(--color-ink-600)' : 'var(--color-ink-100)' }}>
          {label}
        </div>
        {sublabel && (
          <div className="font-mono text-[13.5px] mt-1" style={{ color: 'var(--color-ink-400)' }}>
            {sublabel}
          </div>
        )}
      </div>
    </motion.div>
  );
}