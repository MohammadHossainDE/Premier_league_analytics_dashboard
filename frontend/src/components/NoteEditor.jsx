import { useState } from "react";

function formatSwedenTime(value) {
  return new Intl.DateTimeFormat("en-SE", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Stockholm",
  }).format(new Date(value));
}

function NoteEditor({
  favoriteId,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) {
      setError("Please write a note before saving.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onAddNote(favoriteId, trimmed);
      setContent("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to save note.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (note) => {
    setEditingId(note.id);
    setEditingContent(note.content);
    setEditError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingContent("");
    setEditError("");
  };

  const handleUpdate = async (noteId) => {
    const trimmed = editingContent.trim();
    if (!trimmed) {
      setEditError("Please write a note before saving.");
      return;
    }

    setSavingEdit(true);
    setEditError("");

    try {
      await onUpdateNote(noteId, trimmed);
      cancelEditing();
    } catch (err) {
      console.error(err);
      setEditError(err.response?.data?.detail || "Failed to update note.");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div
      className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4"
      onClick={(event) => event.stopPropagation()}
    >
      <h4 className="text-base font-semibold text-white">My Notes</h4>

      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400"
          placeholder="Write your thoughts about this team..."
        />

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Add Note"}
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-slate-400">No notes yet for this team.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="rounded-xl bg-white/5 p-3">
              {editingId === note.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editingContent}
                    onChange={(event) => setEditingContent(event.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400"
                    placeholder="Update your note..."
                  />

                  {editError ? (
                    <p className="text-sm text-red-300">{editError}</p>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(note.id)}
                      disabled={savingEdit}
                      className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingEdit ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={savingEdit}
                      className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-100">{note.content}</p>
              )}

              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>{formatSwedenTime(note.created_at)} (Sweden time)</span>
                <div className="flex items-center gap-3">
                  {editingId === note.id ? null : (
                    <button
                      type="button"
                      onClick={() => startEditing(note)}
                      className="text-amber-300 transition hover:text-amber-200"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDeleteNote(note.id)}
                    className="text-red-300 transition hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NoteEditor;
