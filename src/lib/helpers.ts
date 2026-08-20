export interface Point { x: number; y: number }

/** arrange n points in a compact grid centered at (cx, cy) */
export function grid(n: number, cx: number, cy: number, cols: number, spacing = 70): Point[] {
  const pts: Point[] = [];
  const rows = Math.ceil(n / cols);
  const h = (rows - 1) * spacing;
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const rowCount = Math.min(cols, n - row * cols);
    const rowW = (rowCount - 1) * spacing;
    pts.push({
      x: cx - rowW / 2 + col * spacing,
      y: cy - h / 2 + row * spacing,
    });
  }
  return pts;
}

/** even stagger of delays for a flood of n items */
export function stagger(n: number, step = 0.09, base = 0): number[] {
  return Array.from({ length: n }, (_, i) => base + i * step);
}
