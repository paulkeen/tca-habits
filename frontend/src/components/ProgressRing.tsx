interface ProgressRingProps {
  ratio: number; // 0..1
  size?: number;
  stroke?: number;
  color: string;
  trackColor?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  ratio,
  size = 44,
  stroke = 4,
  color,
  trackColor = 'rgba(128,128,128,0.18)',
  children,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, ratio));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = clamped * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}
