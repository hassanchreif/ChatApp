import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Rooms.css";

export default function Rooms({ setRoom }) {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.get("/rooms")
      .then((res) => setRooms(res.data))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  const createRoom = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      await api.post("/rooms", { name: name.trim() });
      const res = await api.get("/rooms");
      setRooms(res.data);
      setName("");
    } catch {
      // handle error silently
    } finally {
      setCreating(false);
    }
  };

  const getRoomEmoji = (id) => {
    const emojis = ["💬", "🚀", "🌿", "🔥", "💡", "🎯", "🎮", "📚", "🎵", "🏆"];
    return emojis[id % emojis.length];
  };

  const getRoomColor = (id) => {
    const colors = [
      "linear-gradient(135deg, #e0f2fe, #f0fdf4)",
      "linear-gradient(135deg, #dcfce7, #e0f2fe)",
      "linear-gradient(135deg, #ecfdf5, #f0f9ff)",
      "linear-gradient(135deg, #f0f9ff, #ecfdf5)",
    ];
    return colors[id % colors.length];
  };

  return (
    <div className="rooms-page">
      <div className="rooms-header">
        <div>
          <h1>Chat Rooms</h1>
          <p>Join a room or create your own</p>
        </div>
      </div>

      <div className="create-room-bar">
        <input
          type="text"
          placeholder="Create a new room..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createRoom()}
        />
        <button className="btn btn-primary" onClick={createRoom} disabled={creating || !name.trim()}>
          {creating ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          <div style={{ animation: "pulse 1.5s ease-in-out infinite", fontSize: "2rem" }}>⏳</div>
          <p>Loading rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏠</div>
          <p>No rooms yet. Create the first one!</p>
        </div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((r) => (
            <div key={r.id} className="room-card" onClick={() => setRoom(r)}>
              <div className="room-icon" style={{ background: getRoomColor(r.id) }}>
                {getRoomEmoji(r.id)}
              </div>
              <div className="room-name">{r.name}</div>
              <div className="room-meta">Click to join</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

