export default function MessageBubble({ message, isOwn }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <div className={`message-row ${isOwn ? "own" : ""}`}>
      <div className="message-avatar">{getInitials(message.username)}</div>
      <div className="message-bubble">
        {!isOwn && <div className="message-author">{message.username}</div>}
        <div>{message.content}</div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}

