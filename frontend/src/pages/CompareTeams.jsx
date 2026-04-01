import { useEffect, useMemo, useState } from "react";
import API from "../api/api";

const metricConfig = [
  { key: "position", label: "Position", better: "lower" },
  { key: "points", label: "Points", better: "higher" },
  { key: "played", label: "Played", better: "lower" },
  { key: "won", label: "Won", better: "higher" },
  { key: "draw", label: "Draw", better: "higher" },
  { key: "lost", label: "Lost", better: "lower" },
  { key: "goals_for", label: "Goals For", better: "higher" },
  { key: "goals_against", label: "Goals Against", better: "lower" },
  { key: "goal_difference", label: "Goal Difference", better: "higher" },
];

function CompareBar({ leftValue, rightValue, leftLabel, rightLabel }) {
  const maxValue = Math.max(leftValue, rightValue, 1);
  const leftWidth = Math.max(10, Math.round((leftValue / maxValue) * 100));
  const rightWidth = Math.max(10, Math.round((rightValue / maxValue) * 100));

  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
          <span>{leftLabel}</span>
          <span>{leftValue}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-400"
            style={{ width: `${leftWidth}%` }}
          />
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
          <span>{rightLabel}</span>
          <span>{rightValue}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
            style={{ width: `${rightWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function CompareTeams() {
  const [teams, setTeams] = useState([]);
  const [leftTeamId, setLeftTeamId] = useState("");
  const [rightTeamId, setRightTeamId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await API.get("/teams/");
        setTeams(res.data);
        if (res.data.length >= 2) {
          setLeftTeamId(String(res.data[0].team_id));
          setRightTeamId(String(res.data[1].team_id));
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load teams for comparison right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const leftTeam = useMemo(
    () => teams.find((team) => String(team.team_id) === leftTeamId) ?? null,
    [teams, leftTeamId]
  );
  const rightTeam = useMemo(
    () => teams.find((team) => String(team.team_id) === rightTeamId) ?? null,
    [teams, rightTeamId]
  );

  if (loading) {
    return <p className="text-slate-200">Loading comparison tools...</p>;
  }

  if (error) {
    return <p className="text-red-300">{error}</p>;
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-900 to-fuchsia-900 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-purple-200/80">
          Team Comparison
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">
          Compare two Premier League teams
        </h1>
        <p className="mt-3 max-w-3xl text-slate-200">
          Pick any two clubs and compare their table position, results, and goal
          output side by side.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <label className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-xl">
          <span className="mb-3 block text-sm uppercase tracking-[0.2em] text-pink-300">
            Team A
          </span>
          <select
            value={leftTeamId}
            onChange={(event) => setLeftTeamId(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          >
            {teams.map((team) => (
              <option key={team.team_id} value={team.team_id} className="text-black">
                {team.team_name}
              </option>
            ))}
          </select>
        </label>

        <label className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-xl">
          <span className="mb-3 block text-sm uppercase tracking-[0.2em] text-sky-300">
            Team B
          </span>
          <select
            value={rightTeamId}
            onChange={(event) => setRightTeamId(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          >
            {teams.map((team) => (
              <option key={team.team_id} value={team.team_id} className="text-black">
                {team.team_name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {leftTeam && rightTeam ? (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-pink-300">Team A</p>
              <h2 className="mt-3 text-3xl font-bold text-white">{leftTeam.team_name}</h2>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-200">
                <span className="rounded-full bg-white/10 px-4 py-2">
                  Position #{leftTeam.position}
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2">
                  {leftTeam.points} pts
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2">
                  GD {leftTeam.goal_difference}
                </span>
              </div>
            </div>

            <div className="hidden items-center justify-center xl:flex">
              <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
                VS
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Team B</p>
              <h2 className="mt-3 text-3xl font-bold text-white">{rightTeam.team_name}</h2>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-200">
                <span className="rounded-full bg-white/10 px-4 py-2">
                  Position #{rightTeam.position}
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2">
                  {rightTeam.points} pts
                </span>
                <span className="rounded-full bg-white/10 px-4 py-2">
                  GD {rightTeam.goal_difference}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white">Head-to-Head Metrics</h2>
            <div className="mt-6 space-y-5">
              {metricConfig.map((metric) => {
                const leftValue = leftTeam[metric.key];
                const rightValue = rightTeam[metric.key];

                let winner = "draw";
                if (leftValue !== rightValue) {
                  const leftBetter =
                    metric.better === "higher" ? leftValue > rightValue : leftValue < rightValue;
                  winner = leftBetter ? "left" : "right";
                }

                return (
                  <div key={metric.key} className="rounded-2xl bg-white/5 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{metric.label}</h3>
                      <span className="text-sm text-slate-300">
                        {winner === "draw"
                          ? "Even"
                          : winner === "left"
                            ? `${leftTeam.team_name} lead`
                            : `${rightTeam.team_name} lead`}
                      </span>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                      <div
                        className={`rounded-xl px-4 py-3 text-2xl font-bold ${
                          winner === "left" ? "bg-pink-500/15 text-pink-200" : "bg-white/5 text-white"
                        }`}
                      >
                        {leftValue}
                      </div>
                      <div className="text-sm uppercase tracking-[0.2em] text-slate-400">vs</div>
                      <div
                        className={`rounded-xl px-4 py-3 text-2xl font-bold ${
                          winner === "right" ? "bg-sky-500/15 text-sky-200" : "bg-white/5 text-white"
                        }`}
                      >
                        {rightValue}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white">Points Race</h2>
              <p className="mt-2 text-slate-300">
                A quick visual snapshot of the current points gap.
              </p>
              <div className="mt-6">
                <CompareBar
                  leftValue={leftTeam.points}
                  rightValue={rightTeam.points}
                  leftLabel={leftTeam.team_name}
                  rightLabel={rightTeam.team_name}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white">Attack vs Defense</h2>
              <p className="mt-2 text-slate-300">
                Comparing scoring power and defensive record side by side.
              </p>
              <div className="mt-6 space-y-6">
                <CompareBar
                  leftValue={leftTeam.goals_for}
                  rightValue={rightTeam.goals_for}
                  leftLabel={`${leftTeam.team_name} goals for`}
                  rightLabel={`${rightTeam.team_name} goals for`}
                />
                <CompareBar
                  leftValue={leftTeam.goals_against}
                  rightValue={rightTeam.goals_against}
                  leftLabel={`${leftTeam.team_name} goals against`}
                  rightLabel={`${rightTeam.team_name} goals against`}
                />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

export default CompareTeams;
