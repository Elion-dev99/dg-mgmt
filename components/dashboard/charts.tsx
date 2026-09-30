import { useId } from 'react';

const VIEW_W = 100;

function buildPaths(values: number[], height: number, padTop: number) {
  const points = values.length > 1 ? values : [values[0] ?? 0, values[0] ?? 0];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const usable = height - padTop - 2;
  const coords = points.map((v, i) => ({
    x: (i / (points.length - 1)) * VIEW_W,
    y: max === min ? height - 2 : padTop + (1 - (v - min) / span) * usable,
  }));

  let line = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const midX = prev.x + (curr.x - prev.x) / 2;
    line += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  const area = `${line} L ${VIEW_W} ${height} L 0 ${height} Z`;
  const last = coords[coords.length - 1];
  return { line, area, last: { x: last.x / VIEW_W, y: last.y / height } };
}

export function AreaChart({
  values,
  height = 40,
  color = '#8B6CFF',
  className = '',
  showDot = false,
}: {
  values: number[];
  height?: number;
  color?: string;
  className?: string;
  showDot?: boolean;
}) {
  const gradientId = useId();
  const { line, area, last } = buildPaths(values, height, 4);

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${VIEW_W} ${height}`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradientId})`} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {showDot && (
        <span
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_12px_rgba(139,108,255,0.9)]"
          style={{ left: `${last.x * 100}%`, top: `${last.y * 100}%`, backgroundColor: color }}
        />
      )}
    </div>
  );
}
