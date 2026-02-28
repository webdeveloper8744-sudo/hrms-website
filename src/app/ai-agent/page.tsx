"use client";

import { useState } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";

interface Msg {
  role: "user" | "bot";
  text: string;
}

export default function AIAgentPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi 👋 I’m HRSync AI Assistant. I can help you with pricing, payroll, attendance and features.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-[#0b1225] rounded-xl shadow-lg flex flex-col">

        {/* HEADER */}
        <div className="p-4 border-b border-white/10 flex items-center gap-2 text-blue-400 font-semibold">
          <FaRobot /> HRSync AI Assistant
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-sm text-gray-400">HRSync AI is typing...</div>
          )}
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-white/10 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about pricing, payroll, attendance..."
            className="flex-1 bg-[#020817] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 px-4 rounded-lg text-white flex items-center"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}
