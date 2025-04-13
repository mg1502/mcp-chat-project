"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const welcome = { role: "assistant", content: "👋 Hello! How can I help you today?" };
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
      setMessages((prev) => [...prev.slice(0, -1), robotMessage]);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to MCP Chat 🎯</h1>

      <div style={{ border: "1px solid #ccc", padding: "10px", height: "400px", overflowY: "scroll", marginBottom: "10px", backgroundColor: "#f9f9f9" }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ marginBottom: "8px" }}>
            <strong>{m.role === "user" ? "You" : "Robot"}:</strong> {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flexGrow: 1, padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px" }}>
          Send
        </button>
      </form>
    </div>
  );
}
