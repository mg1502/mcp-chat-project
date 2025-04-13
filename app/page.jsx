"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Show a welcome message on page load
  useEffect(() => {
    const welcome = { role: "assistant", content: "Hello! How can I help you today?" };
    setMessages([welcome]);
  }, []);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const thinkingMessage = { role: "assistant", content: "🤔 Thinking..." };

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let robotMessage = { role: "assistant", content: "" };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      robotMessage.content += decoder.decode(value);
      // Replace "Thinking..." with partial or final text
      setMessages((prev) => [...prev.slice(0, -1), robotMessage]);
    }
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h1 style={styles.header}>Welcome to MCP Chat 🌤️</h1>

        <div style={styles.chatBox}>
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            const bubbleStyle = isUser ? styles.userBubble : styles.botBubble;

            return (
              <div key={idx} style={styles.messageRow}>
                {/* "Avatar" or role label */}
                <div style={styles.roleLabel}>
                  {isUser ? "You" : "Robot"}
                </div>

                {/* Chat bubble */}
                <div style={bubbleStyle}>
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={sendMessage} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit" style={styles.sendButton}>Send</button>
        </form>
      </div>
    </div>
  );
}

/* Inline Styles */
const styles = {
  // 1) Full page wrapper with gentle gradient
  pageWrapper: {
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to bottom right, #f0f7ff, #ffffff)"  // <== LIGHT GRADIENT
  },

  // 2) Main chat container (card)
  container: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  // 3) Header
  header: {
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "1.5rem",
  },

  // 4) Chat area
  chatBox: {
    height: "400px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "20px",
    backgroundColor: "#fafafa"
  },

  messageRow: {
    marginBottom: "15px"
  },

  roleLabel: {
    fontSize: "0.8rem",
    marginBottom: "4px",
    color: "#666"
  },

  // 5) Bubbles
  userBubble: {
    backgroundColor: "#ddf1fa",
    color: "#333",
    padding: "10px 15px",
    borderRadius: "15px",
    maxWidth: "80%",
    display: "inline-block"
  },
  botBubble: {
    backgroundColor: "#f1f1f1",
    color: "#333",
    padding: "10px 15px",
    borderRadius: "15px",
    maxWidth: "80%",
    display: "inline-block"
  },

  // 6) Input form
  form: {
    display: "flex",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px"
  },
  sendButton: {
    padding: "10px 20px",
    backgroundColor: "#2D8CFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};
