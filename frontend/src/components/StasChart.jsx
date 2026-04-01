function clampWidth(value, maxValue) {
  if (!maxValue || maxValue <= 0) {
    return 0;
  }

  return Math.max(8, Math.round((value / maxValue) * 100));
}

export function HorizontalBarChart({
  title,
  subtitle,
  items,
  valueKey,
  colorClass,
  valueLabel,
}) {
  const maxValue = Math.max(...items.map((item) => item[valueKey] ?? 0), 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-slate-300">{subtitle}</p>

      <div className="mt-6 space-y-5">
        {items.map((item, index) => (
          <div key={item.team_id ?? item.team_name}>
            <div className="mb-2 flex items-center justify-between gap-4 text-sm">
              <p className="font-medium text-slate-100">
                {index + 1}. {item.team_name}
              </p>
              <p className="text-slate-300">
                {item[valueKey]} {valueLabel}
              </p>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${colorClass}`}
                style={{ width: `${clampWidth(item[valueKey], maxValue)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DualMetricChart({ title, subtitle, items }) {
  const maxValue = Math.max(
    ...items.flatMap((item) => [item.goals_for ?? 0, item.goals_against ?? 0]),
    0
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-slate-300">{subtitle}</p>
        </div>

        <div className="flex gap-4 text-xs uppercase tracking-[0.2em] text-slate-300">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            Goals For
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            Goals Against
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div key={item.team_id ?? item.team_name}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <p className="font-medium text-slate-100">{item.team_name}</p>
              <p className="text-sm text-slate-300">
                GF {item.goals_for} / GA {item.goals_against}
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{ width: `${clampWidth(item.goals_for, maxValue)}%` }}
                />
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-rose-400"
                  style={{ width: `${clampWidth(item.goals_against, maxValue)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
