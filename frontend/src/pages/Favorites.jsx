
import { useEffect, useState } from "react";
import API from "../api/api";
import NoteEditor from "../components/NoteEditor";
import SnapshotHistory from "../components/SnapshotHistory";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [savingSnapshotId, setSavingSnapshotId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();

    const interval = setInterval(() => {
      fetchFavorites();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await API.get("/favorites");
      setFavorites(res.data);
    } finally {
      setLoading(false);
    }
  };

  const deleteFavorite = async (id) => {
    await API.delete(`/favorites/${id}`);
    fetchFavorites();
  };

  const addNote = async (favoriteId, content) => {
    await API.post(`/notes/${favoriteId}`, { content });
    fetchFavorites();
  };

  const deleteNote = async (noteId) => {
    await API.delete(`/notes/${noteId}`);
    fetchFavorites();
  };

  const updateNote = async (noteId, content) => {
    await API.put(`/notes/${noteId}`, { content });
    fetchFavorites();
  };

  const saveSnapshot = async (favorite) => {
    try {
      setSavingSnapshotId(favorite.id);
      const liveTeamRes = await API.get(`/teams/${favorite.team_id}`);
      const liveTeam = liveTeamRes.data;

      await API.post(`/snapshots/${favorite.id}`, {
        team_name: liveTeam.team_name,
        points: liveTeam.points,
        played: liveTeam.played,
        won: liveTeam.won,
        draw: liveTeam.draw,
        lost: liveTeam.lost,
      });

      fetchFavorites();
    } finally {
      setSavingSnapshotId(null);
    }
  };

  const deleteSnapshot = async (snapshotId) => {
    await API.delete(`/snapshots/${snapshotId}`);
    fetchFavorites();
  };

  const toggleDetails = (id) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Favorite Teams</h1>

      {loading && favorites.length === 0 ? (
        <p className="text-slate-300">Loading favorites...</p>
      ) : null}

      {!loading && favorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-slate-300">
          No favorite teams yet. Add one from the Teams page to start tracking notes and history.
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="rounded-xl bg-slate-900/80 p-6 shadow cursor-pointer"
            onClick={() => toggleDetails(fav.id)}
          >
            <h3 className="mb-2 text-xl font-semibold text-white">
              {fav.team_name}
            </h3>

            {selectedId === fav.id && (
              <div className="mb-4 space-y-1 text-slate-200">
                <p>Points: {fav.points}</p>
                <p>Played: {fav.played}</p>
                <p>Won: {fav.won}</p>
                <p>Draw: {fav.draw}</p>
                <p>Lost: {fav.lost}</p>

                <NoteEditor
                  favoriteId={fav.id}
                  notes={fav.notes || []}
                  onAddNote={addNote}
                  onUpdateNote={updateNote}
                  onDeleteNote={deleteNote}
                />

                <SnapshotHistory
                  favorite={fav}
                  onSaveSnapshot={saveSnapshot}
                  onDeleteSnapshot={deleteSnapshot}
                  savingSnapshot={savingSnapshotId === fav.id}
                />
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteFavorite(fav.id);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
