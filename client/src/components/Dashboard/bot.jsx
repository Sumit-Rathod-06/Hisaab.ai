import React, { useState } from "react";
import {
  Send,
  X,
  MessageCircle,
  Paperclip,
  Mic,
} from "lucide-react";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      { text: message, sender: "user" },
    ]);

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!open && (
        <button style={styles.fab} onClick={() => setOpen(true)}>
          <MessageCircle size={28} color="#fff" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <span style={styles.statusDot}></span>
              <span style={styles.headerText}>AI Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} style={styles.closeBtn}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={styles.body}>
            {messages.length === 0 && (
              <p style={styles.placeholderText}>
                What would you like to explore today? Ask anything, share ideas,
                or request assistance...
              </p>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageBubble,
                  ...(msg.sender === "user"
                    ? styles.userMessage
                    : styles.botMessage),
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div style={styles.inputArea}>
            <div style={styles.iconRow}>
              <Paperclip size={18} />
              <Mic size={18} />
            </div>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              style={styles.input}
            />

            <button style={styles.sendBtn} onClick={handleSend}>
              <Send size={18} />
            </button>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <span>Press Shift + Enter for new line</span>
            <span style={styles.systemStatus}>
              <span style={styles.statusDot}></span> All systems operational
            </span>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  fab: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    zIndex: 1000,
  },

  chatWindow: {
    position: "fixed",
    bottom: "90px",
    right: "24px",
    width: "360px",
    height: "460px",
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(16px)",
    borderRadius: "18px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    zIndex: 1000,
  },

  header: {
    padding: "14px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  headerText: {
    fontSize: "14px",
    fontWeight: 500,
  },

  closeBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },

  statusDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#22c55e",
    borderRadius: "50%",
  },

  body: {
    flex: 1,
    padding: "16px",
    fontSize: "14px",
    color: "#cbd5f5",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  placeholderText: {
    opacity: 0.6,
    lineHeight: "1.6",
  },

  messageBubble: {
    maxWidth: "80%",
    padding: "10px 12px",
    borderRadius: "12px",
    fontSize: "13px",
    lineHeight: "1.4",
  },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#2563eb",
    color: "#fff",
  },

  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  inputArea: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },

  iconRow: {
    display: "flex",
    gap: "8px",
    opacity: 0.7,
  },

  input: {
    flex: 1,
    background: "rgba(255,255,255,0.08)",
    border: "none",
    borderRadius: "10px",
    padding: "10px",
    color: "#fff",
    outline: "none",
  },

  sendBtn: {
    background: "#ef4444",
    border: "none",
    borderRadius: "10px",
    padding: "8px",
    cursor: "pointer",
    color: "#fff",
  },

  footer: {
    padding: "8px 12px",
    fontSize: "11px",
    opacity: 0.6,
    display: "flex",
    justifyContent: "space-between",
  },

  systemStatus: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
};

export default Chatbot;
