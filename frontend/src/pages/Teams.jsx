
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api"; 

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

/*   useEffect(() => {
    API.get("/teams")
      .then(res => setTeams(res.data))
      .catch(err => console.error(err));
  }, []); */

  useEffect(() => {
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await API.get("/teams/");
      setTeams(res.data);
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Unable to load teams right now." });
    } finally {
      setLoading(false);
    }
  };

  fetchTeams(); // first load

  const interval = setInterval(fetchTeams, 86400000); // refresh every 60 seconds

  return () => clearInterval(interval); // cleanup
}, []);

  const addFavorite = async (team) => {
    try {
      await API.post("/favorites/", {
        team_id: team.team_id,
        team_name: team.team_name,
        points: team.points || 0,
        played: team.played || 0,
        won: team.won || 0,
        draw: team.draw || 0,
        lost: team.lost || 0,
      });
      setFeedback({
        type: "success",
        message: `${team.team_name} added to favorites.`,
      });
    } catch (err) {
      console.error(err.response?.data || err);
      setFeedback({
        type: "error",
        message: err.response?.data?.detail || "Failed to add favorite",
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Premier League Teams</h1>
      {feedback ? (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "bg-emerald-500/15 text-emerald-200"
              : "bg-red-500/15 text-red-200"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}
      {loading ? (
        <p>Loading teams...</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-black">Team</th>
              <th className="border px-4 py-2 text-black">Points</th>
              <th className="border px-4 py-2 text-black">Played</th>
              <th className="border px-4 py-2 text-black">Won</th>
              <th className="border px-4 py-2 text-black">Draw</th>
              <th className="border px-4 py-2 text-black">Lost</th>
              <th className="border px-4 py-2 text-black">Favorite</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team.team_id}>
                <td className="border px-4 py-2">
                  <Link
                    to={`/teams/${team.team_id}`}
                    className="font-medium text-purple-300 hover:text-purple-200"
                  >
                    {team.team_name}
                  </Link>
                </td>
                <td className="border px-4 py-2">{team.points}</td>
                <td className="border px-4 py-2">{team.played}</td>
                <td className="border px-4 py-2">{team.won}</td>
                <td className="border px-4 py-2">{team.draw}</td>
                <td className="border px-4 py-2">{team.lost}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => addFavorite(team)}
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Teams; 
