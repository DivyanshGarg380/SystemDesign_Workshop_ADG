import { useEffect, useRef, useState } from 'react';
import { STAGE_W, STAGE_H } from '../../lib/types';

export default function Stage({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setScale(Math.min(width / STAGE_W, height / STAGE_H));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="relative w-full h-full flex items-center justify-center">
      <div
        className="relative bg-blueprint"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          flexShrink: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
