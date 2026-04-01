import { useEffect, useState } from "react";
import API from "../api/api";
import { DualMetricChart, HorizontalBarChart } from "../components/StasChart";

function MetricCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm">
      <p className="text-sm uppercase tracking-[0.2em] text-purple-200/80">
        {title}
      </p>
      <h3 className="mt-3 text-3xl font-bold text-white">{value}</h3>
      {subtitle ? <p className="mt-2 text-sm text-slate-300">{subtitle}</p> : null}
    </div>
  );
}

function formatSnapshotTime(value) {
  return new Intl.DateTimeFormat("en-SE", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Stockholm",
  }).format(new Date(value));
}

function TrendPanel({ favorite }) {
  const snapshots = [...(favorite.snapshots || [])].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  const maxPoints = Math.max(...snapshots.map((snapshot) => snapshot.points), 0);

  if (snapshots.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-5">
        <h3 className="text-xl font-semibold text-white">{favorite.team_name}</h3>
        <p className="mt-2 text-sm text-slate-400">
          No snapshot history yet. Save snapshots from Favorites to start tracking this team.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">{favorite.team_name}</h3>
          <p className="mt-1 text-sm text-slate-300">
            {snapshots.length} saved snapshot{snapshots.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
          Current: {favorite.points} pts
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {snapshots.map((snapshot, index) => {
          const width = maxPoints > 0 ? Math.max(10, Math.round((snapshot.points / maxPoints) * 100)) : 0;
          const previous = index > 0 ? snapshots[index - 1].points : null;
          const delta = previous === null ? null : snapshot.points - previous;

          return (
            <div key={snapshot.id} className="rounded-xl bg-white/5 p-4">
              <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-300">
                <span>{formatSnapshotTime(snapshot.created_at)} (Sweden time)</span>
                <span>
                  {delta === null
                    ? "Starting point"
                    : delta === 0
                      ? "No change"
                      : `${delta > 0 ? "+" : ""}${delta} pts`}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-sky-400"
                  style={{ width: `${width}%` }}
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-200 md:grid-cols-4">
                <div className="rounded-lg bg-slate-950/60 px-3 py-2">Points: {snapshot.points}</div>
                <div className="rounded-lg bg-slate-950/60 px-3 py-2">Played: {snapshot.played}</div>
                <div className="rounded-lg bg-slate-950/60 px-3 py-2">Wins: {snapshot.won}</div>
                <div className="rounded-lg bg-slate-950/60 px-3 py-2">Draws: {snapshot.draw}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Analytics() {
  const [summary, setSummary] = useState(null);
  const [topTeams, setTopTeams] = useState([]);
  const [form, setForm] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [summaryRes, topRes, formRes, favoritesRes] = await Promise.all([
          API.get("/analytics/summary"),
          API.get("/analytics/top"),
          API.get("/analytics/form"),
          API.get("/favorites"),
        ]);

        setSummary(summaryRes.data);
        setTopTeams(topRes.data);
        setForm(formRes.data);
        setFavorites(favoritesRes.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Unable to load analytics right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <p className="text-slate-200">Loading league analytics...</p>;
  }

  if (error) {
    return <p className="text-red-300">{error}</p>;
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-violet-900 to-slate-900 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-purple-200/80">
          Analytics Hub
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">
          Premier League overview at a glance
        </h1>
        <p className="mt-3 max-w-3xl text-slate-200">
          Track the title pace, the strongest attacks, and the teams setting the
          standard across the table.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Teams"
          value={summary?.total_teams ?? 0}
          subtitle="Teams currently included in the standings feed"
        />
        <MetricCard
          title="Top Team"
          value={summary?.top_team?.team_name ?? "N/A"}
          subtitle={`${
            summary?.top_team?.points ?? 0
          } points at the top of the league`}
        />
        <MetricCard
          title="Bottom Team"
          value={summary?.bottom_team?.team_name ?? "N/A"}
          subtitle={`${summary?.bottom_team?.points ?? 0} points so far`}
        />
        <MetricCard
          title="Average Points"
          value={summary?.average_points ?? 0}
          subtitle="Mean points total across the competition"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <HorizontalBarChart
          title="Top 5 Teams by Points"
          subtitle="A quick visual of the current points race."
          items={topTeams}
          valueKey="points"
          colorClass="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-400"
          valueLabel="pts"
        />

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white">Performance Leaders</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-emerald-500/10 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
                Best Attack
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                {form?.best_attack?.team_name ?? "N/A"}
              </h3>
              <p className="mt-1 text-slate-300">
                {form?.best_attack?.goals_for ?? 0} goals scored
              </p>
            </div>

            <div className="rounded-2xl bg-sky-500/10 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-sky-300">
                Best Defense
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                {form?.best_defense?.team_name ?? "N/A"}
              </h3>
              <p className="mt-1 text-slate-300">
                {form?.best_defense?.goals_against ?? 0} goals conceded
              </p>
            </div>

            <div className="rounded-2xl bg-amber-500/10 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-amber-300">
                Best Goal Difference
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                {form?.best_goal_difference?.team_name ?? "N/A"}
              </h3>
              <p className="mt-1 text-slate-300">
                GD {form?.best_goal_difference?.goal_difference ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DualMetricChart
        title="Goals For vs Goals Against"
        subtitle="Comparing attack and defensive output for the current top five."
        items={topTeams}
      />

      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-cyan-950 to-indigo-950 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
          Historical Analytics
        </p>
        <h2 className="mt-3 text-3xl font-black text-white">
          Follow your favorite teams over time
        </h2>
        <p className="mt-3 max-w-3xl text-slate-200">
          These trend panels use your saved snapshots so you can see how points
          and form changed across different collection times.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold text-white">No favorites yet</h3>
          <p className="mt-2 text-slate-400">
            Add a favorite team and save snapshots from the Favorites page to unlock
            historical analysis here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {favorites.map((favorite) => (
            <TrendPanel key={favorite.id} favorite={favorite} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Analytics;
