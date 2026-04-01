function formatSwedenTime(value) {
  return new Intl.DateTimeFormat("en-SE", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Stockholm",
  }).format(new Date(value));
}

function SnapshotBar({ value, maxValue, label }) {
  const width = maxValue > 0 ? Math.max(10, Math.round((value / maxValue) * 100)) : 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
        <span>{label}</span>
        <span>{value} pts</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function SnapshotHistory({ favorite, onSaveSnapshot, onDeleteSnapshot, savingSnapshot }) {
  const snapshots = favorite.snapshots || [];
  const latestFour = [...snapshots]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .slice(-4);
  const maxPoints = Math.max(...latestFour.map((snapshot) => snapshot.points), 0);

  return (
    <div
      className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-white">History Snapshots</h4>
          <p className="text-sm text-slate-400">
            Save the current team record and compare it over time.
          </p>
        </div>

        <button
          type="button"
          disabled={savingSnapshot}
          onClick={() => onSaveSnapshot(favorite)}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingSnapshot ? "Saving..." : "Save Snapshot"}
        </button>
      </div>

      {latestFour.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <h5 className="text-sm uppercase tracking-[0.2em] text-slate-300">
              Points Trend
            </h5>
            <div className="space-y-3">
              {latestFour.map((snapshot, index) => (
                <SnapshotBar
                  key={snapshot.id}
                  value={snapshot.points}
                  maxValue={maxPoints}
                  label={`Snapshot ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm uppercase tracking-[0.2em] text-slate-300">
              Saved Records
            </h5>
            {snapshots.map((snapshot) => (
              <div key={snapshot.id} className="rounded-xl bg-white/5 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm text-slate-100">
                    <p>{formatSwedenTime(snapshot.created_at)} (Sweden time)</p>
                    <p className="mt-1 text-slate-300">
                      {snapshot.points} pts | {snapshot.won}W {snapshot.draw}D {snapshot.lost}L
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteSnapshot(snapshot.id)}
                    className="text-xs text-red-300 transition hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-400">
          No snapshots saved yet. Save one to begin tracking this team over time.
        </p>
      )}
    </div>
  );
}

export default SnapshotHistory;
