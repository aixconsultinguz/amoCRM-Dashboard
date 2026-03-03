interface Point {
  label: string;
  value: number;
}

interface Props {
  title: string;
  points: Point[];
}

export function LineChart({ title, points }: Props) {
  const max = Math.max(...points.map(p => p.value), 1);
  return (
    <div className="bg-bgElevated border border-borderSoft rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-[0.2em] text-textMuted">
          {title}
        </div>
      </div>
      <div className="flex items-end gap-2 h-40">
        {points.map(p => {
          const h = (p.value / max) * 100;
          return (
            <div
              key={p.label}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className="w-full rounded-full bg-gradient-to-t from-accent via-purple-500 to-fuchsia-500 shadow-glow"
                style={{ height: `${h}%` }}
              />
              <div className="text-[10px] text-textMuted">{p.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

