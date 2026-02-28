'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaSpinner,
} from 'react-icons/fa';

interface Msg {
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function PremiumChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'bot',
      text: "Hey there! I'm your AI Assistant. Ask me about pricing, payroll, attendance tracking, or any HR features.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    
    const userMsg: Msg = { 
      role: 'user', 
      text: userText, 
      timestamp: new Date() 
    };
    setMessages((prev) => [...prev, userMsg]);
    
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          conversationHistory: messages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      
      const botMsg: Msg = { 
        role: 'bot', 
        text: data.reply || 'Sorry, could you try again?', 
        timestamp: new Date() 
      };
      
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: Msg = {
        role: 'bot',
        text: 'Something went wrong. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-3 rounded-full flex items-center gap-2 font-semibold transition-all duration-200 transform active:scale-95"
          >
            <FaRobot className="text-lg" /> 
            AI Chat
          </button>
        </div>
      )}

      {/* Chat Widget */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[90vh] max-h-[600px] rounded-2xl flex flex-col border border-blue-500/20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaRobot className="text-white text-lg" />
              <div>
                <h3 className="text-white font-bold">HRSync Assistant</h3>
                <p className="text-blue-100 text-xs">Online</p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-white p-2 rounded-lg transition-colors duration-200"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Messages Container */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-800/50"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-700 text-slate-50 rounded-bl-none border border-slate-600/30'
                  }`}
                >
                  <div className="break-words">{msg.text}</div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 border border-slate-600/30 px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                  <FaSpinner className="text-blue-400 animate-spin text-sm" />
                  <span className="text-slate-300 text-sm">Typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-900 border-t border-slate-700/30 space-y-2">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-slate-500 transition-all duration-200"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-blue-600 px-3 py-2 rounded-lg text-white flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <FaSpinner className="animate-spin text-sm" />
                ) : (
                  <FaPaperPlane className="text-sm" />
                )}
              </button>
            </div>

            {/* Quick suggestions */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setInput('What are your pricing plans?')}
                className="text-xs bg-slate-700 text-slate-300 px-2 py-1.5 rounded transition-colors duration-200"
              >
                Pricing
              </button>
              <button
                onClick={() => setInput('Tell me about payroll features')}
                className="text-xs bg-slate-700 text-slate-300 px-2 py-1.5 rounded transition-colors duration-200"
              >
                Payroll
              </button>
              <button
                onClick={() => setInput('How does attendance tracking work?')}
                className="text-xs bg-slate-700 text-slate-300 px-2 py-1.5 rounded transition-colors duration-200"
              >
                Attendance
              </button>
              <button
                onClick={() => setInput('What about compliance management?')}
                className="text-xs bg-slate-700 text-slate-300 px-2 py-1.5 rounded transition-colors duration-200"
              >
                Compliance
              </button>
            </div>

            <div className="text-xs text-slate-400 text-center">
              24/7 Support - Instant Responses
            </div>
          </div>
        </div>
      )}
    </>
  );
}