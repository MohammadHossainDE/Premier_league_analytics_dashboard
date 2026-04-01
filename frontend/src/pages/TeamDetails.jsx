import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";

function StatTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function TeamDetails() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/teams/${teamId}`);
        setTeam(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Unable to load this team right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  if (loading) {
    return <p className="text-slate-200">Loading team details...</p>;
  }

  if (error || !team) {
    return (
      <div className="space-y-4">
        <p className="text-red-300">{error || "Team not found."}</p>
        <Link to="/teams" className="text-purple-300 hover:text-purple-200">
          Back to teams
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-900 to-violet-900 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-purple-200/80">
          Team Profile
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">{team.team_name}</h1>
        <p className="mt-3 max-w-3xl text-slate-200">
          A closer look at this club&apos;s league position, results, and goal output.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-white/10 px-4 py-2 text-slate-100">
            Position #{team.position}
          </span>
          <span className="rounded-full bg-white/10 px-4 py-2 text-slate-100">
            {team.points} points
          </span>
          <span className="rounded-full bg-white/10 px-4 py-2 text-slate-100">
            {team.played} matches played
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        <StatTile label="Won" value={team.won} />
        <StatTile label="Draw" value={team.draw} />
        <StatTile label="Lost" value={team.lost} />
        <StatTile label="Goal Diff" value={team.goal_difference} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white">Match Summary</h2>
          <div className="mt-5 space-y-3 text-slate-200">
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span>Played</span>
              <span>{team.played}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span>Wins</span>
              <span>{team.won}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span>Draws</span>
              <span>{team.draw}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span>Losses</span>
              <span>{team.lost}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white">Goal Record</h2>
          <div className="mt-5 space-y-3 text-slate-200">
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span>Goals For</span>
              <span>{team.goals_for}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span>Goals Against</span>
              <span>{team.goals_against}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span>Goal Difference</span>
              <span>{team.goal_difference}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span>Points</span>
              <span>{team.points}</span>
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/teams"
        className="inline-flex rounded-full bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-500"
      >
        Back to teams
      </Link>
    </section>
  );
}

export default TeamDetails;
