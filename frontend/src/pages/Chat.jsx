import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { createConnection } from "../services/signalr";
import MessageBubble from "../components/ChatBox";
import "../styles/Chat.css";

export default function Chat({ room, user }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [connection, setConnection] = useState(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!room) return;

    api.get(`/messages/room/${room.id}`).then((res) => {
      setMessages(res.data);
    });

    const conn = createConnection();

    conn
      .start()
      .then(() => {
        conn.invoke("JoinRoom", room.id);
        setConnected(true);
      })
      .catch(() => setConnected(false));

    conn.on("ReceiveMessage", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: msg.content,
          username: msg.username,
          timestamp: msg.timestamp,
        },
      ]);
    });

    setConnection(conn);

    return () => {
      conn.stop();
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!content.trim() || !connection) return;

    try {
      await api.post("/messages", {
        content: content.trim(),
        roomId: room.id,
      });
      setContent("");
    } catch {
      // handle error
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "20px" }}>
      <div className="chat-page">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-header-avatar">{getInitials(room?.name)}</div>
            <div>
              <div className="chat-header-title">{room?.name}</div>
              <div className="chat-header-subtitle">
                {connected ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "#22c55e",
                        display: "inline-block",
                        boxShadow: "0 0 0 2px #dcfce7",
                      }}
                    />
                    Online
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "#94a3b8",
                        display: "inline-block",
                      }}
                    />
                    Connecting...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <p>No messages yet. Say hello!</p>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <MessageBubble
                  key={m.id ?? i}
                  message={m}
                  isOwn={m.username === user?.username}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="chat-input-bar">
          <input
            type="text"
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="btn btn-success btn-send"
            onClick={sendMessage}
            disabled={!content.trim()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

