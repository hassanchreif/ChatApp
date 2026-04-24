import { useState } from "react";
import api from "../api/axios";
import "../styles/Auth.css";

export default function Register({ onShowLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", { username, email, password });
      setSuccess("Account created! You can now sign in.");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />

      <div className="card auth-card card-glass">
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #22c55e, #0ea5e9)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.5rem",
              marginBottom: "16px",
              boxShadow: "0 8px 24px rgba(34, 197, 94, 0.3)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Get started with ChatApp today</p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "0.875rem",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "0.875rem",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {success}
          </div>
        )}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="with-icon"
              required
            />
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#94a3b8" }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="with-icon"
              required
            />
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#94a3b8" }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="with-icon"
              required
            />
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#94a3b8" }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "4px" }}>
            {loading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <span className="link" onClick={onShowLogin}>
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}

