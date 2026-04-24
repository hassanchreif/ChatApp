import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rooms from "./pages/Rooms";
import Chat from "./pages/Chat";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    return token && username ? { token, username, email } : null;
  });
  const [room, setRoom] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("token", user.token);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setRoom(null);
  };

  const handleBack = () => {
    if (room) setRoom(null);
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-dot" />
          <span>ChatApp</span>
        </div>

        {user && (
          <div className="header-actions">
            {room && (
              <button className="btn-icon" onClick={handleBack} title="Back">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0ea5e9, #22c55e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                }}
              >
                {getInitials(user.username)}
              </div>
              <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{user.username}</span>
            </div>
            <button className="btn btn-sm btn-ghost" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      {!user ? (
        showRegister ? (
          <Register onShowLogin={() => setShowRegister(false)} />
        ) : (
          <Login setUser={setUser} onShowRegister={() => setShowRegister(true)} />
        )
      ) : !room ? (
        <Rooms setRoom={setRoom} />
      ) : (
        <Chat room={room} user={user} />
      )}
    </>
  );
}

export default App;

