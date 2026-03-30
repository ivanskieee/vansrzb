import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

const SUGGESTIONS = ["Who is Ivan?", "What are his skills?", "Show projects"];

export default function Chatbot() {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! I'm Lantern — Ask me about his skills, projects, or experience.",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const query = text ?? input;
    if (!query.trim()) return;

    const userMessage: Message = { role: "user", text: query };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "bot", text: data.reply }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "bot", text: "Error connecting to AI." },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        .lantern-root {
          font-family: 'DM Mono', monospace;
        }

        /* ── toggle button ── */
        .lantern-toggle {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.25rem;
          border-radius: 9999px;
          border: 1.5px solid;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
        }

        /* light */
        @media (prefers-color-scheme: light) {
          .lantern-toggle {
            background: #0a0a0a;
            color: #f5f5f5;
            border-color: #0a0a0a;
          }
          .lantern-toggle:hover {
            background: #222;
            transform: scale(1.04);
            box-shadow: 0 6px 28px rgba(0,0,0,0.28);
          }
        }
        /* dark */
        @media (prefers-color-scheme: dark) {
          .lantern-toggle {
            background: #f5f5f5;
            color: #0a0a0a;
            border-color: #f5f5f5;
          }
          .lantern-toggle:hover {
            background: #e0e0e0;
            transform: scale(1.04);
            box-shadow: 0 6px 28px rgba(255,255,255,0.15);
          }
        }

        .lantern-toggle-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.5;
        }
        .lantern-toggle.active .lantern-toggle-dot {
          opacity: 1;
          background: #ff4d4d;
        }

        /* ── chat window ── */
        .lantern-window {
          position: fixed;
          bottom: 5.5rem;
          right: 1.5rem;
          z-index: 9998;
          width: 22rem;
          display: flex;
          flex-direction: column;
          border-radius: 1.25rem;
          overflow: hidden;
          border: 1.5px solid;
          animation: lanternSlideUp 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
          box-shadow: 0 24px 60px rgba(0,0,0,0.22);
        }

        @keyframes lanternSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }

        /* light */
        @media (prefers-color-scheme: light) {
          .lantern-window {
            background: #ffffff;
            border-color: #e0e0e0;
          }
        }
        /* dark */
        @media (prefers-color-scheme: dark) {
          .lantern-window {
            background: #111111;
            border-color: #2a2a2a;
          }
        }

        /* ── header ── */
        .lantern-header {
          padding: 0.9rem 1.1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1.5px solid;
        }
        @media (prefers-color-scheme: light) {
          .lantern-header { background: #0a0a0a; border-color: #0a0a0a; }
        }
        @media (prefers-color-scheme: dark) {
          .lantern-header { background: #f5f5f5; border-color: #f5f5f5; }
        }

        .lantern-header-left {
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }
        .lantern-logo {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }
        .lantern-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 0.88rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .lantern-status {
          font-size: 0.62rem;
          letter-spacing: 0.06em;
          opacity: 0.55;
          margin-top: 1px;
        }
        @media (prefers-color-scheme: light) {
          .lantern-title, .lantern-status { color: #f5f5f5; }
        }
        @media (prefers-color-scheme: dark) {
          .lantern-title, .lantern-status { color: #0a0a0a; }
        }

        .lantern-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.15s;
          padding: 2px;
          line-height: 1;
        }
        .lantern-close-btn:hover { opacity: 1; }
        @media (prefers-color-scheme: light) {
          .lantern-close-btn { color: #f5f5f5; }
        }
        @media (prefers-color-scheme: dark) {
          .lantern-close-btn { color: #0a0a0a; }
        }

        /* ── messages ── */
        .lantern-messages {
          height: 18rem;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          scrollbar-width: thin;
        }
        @media (prefers-color-scheme: light) {
          .lantern-messages { scrollbar-color: #d0d0d0 transparent; }
        }
        @media (prefers-color-scheme: dark) {
          .lantern-messages { scrollbar-color: #333 transparent; }
        }

        .lantern-row {
          display: flex;
          animation: lanternFadeIn 0.22s ease both;
        }
        @keyframes lanternFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);  }
        }
        .lantern-row.user { justify-content: flex-end; }
        .lantern-row.bot  { justify-content: flex-start; }

        .lantern-bubble {
          padding: 0.6rem 0.85rem;
          border-radius: 1rem;
          font-size: 0.78rem;
          line-height: 1.55;
          max-width: 78%;
          border: 1px solid;
        }

        /* light bubbles */
        @media (prefers-color-scheme: light) {
          .lantern-bubble.user {
            background: #0a0a0a;
            color: #f5f5f5;
            border-color: #0a0a0a;
            border-bottom-right-radius: 3px;
          }
          .lantern-bubble.bot {
            background: #f5f5f5;
            color: #0a0a0a;
            border-color: #e0e0e0;
            border-bottom-left-radius: 3px;
          }
        }
        /* dark bubbles */
        @media (prefers-color-scheme: dark) {
          .lantern-bubble.user {
            background: #f0f0f0;
            color: #111;
            border-color: #f0f0f0;
            border-bottom-right-radius: 3px;
          }
          .lantern-bubble.bot {
            background: #1e1e1e;
            color: #e8e8e8;
            border-color: #2e2e2e;
            border-bottom-left-radius: 3px;
          }
        }

        /* typing indicator */
        .lantern-typing {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0.55rem 0.85rem;
          border-radius: 1rem;
          border: 1px solid;
          width: fit-content;
        }
        @media (prefers-color-scheme: light) {
          .lantern-typing { background: #f5f5f5; border-color: #e0e0e0; }
        }
        @media (prefers-color-scheme: dark) {
          .lantern-typing { background: #1e1e1e; border-color: #2e2e2e; }
        }
        .lantern-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          animation: lanternBounce 1.2s ease-in-out infinite;
        }
        @media (prefers-color-scheme: light) { .lantern-dot { background: #999; } }
        @media (prefers-color-scheme: dark)  { .lantern-dot { background: #666; } }
        .lantern-dot:nth-child(2) { animation-delay: 0.2s; }
        .lantern-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes lanternBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }

        /* ── suggestions ── */
        .lantern-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding: 0.6rem 1rem;
          border-top: 1px solid;
        }
        @media (prefers-color-scheme: light) { .lantern-suggestions { border-color: #efefef; } }
        @media (prefers-color-scheme: dark)  { .lantern-suggestions { border-color: #222; } }

        .lantern-chip {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          padding: 0.28rem 0.65rem;
          border-radius: 9999px;
          border: 1px solid;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: background 0.15s, color 0.15s;
        }
        @media (prefers-color-scheme: light) {
          .lantern-chip {
            color: #333;
            border-color: #d0d0d0;
            background: transparent;
          }
          .lantern-chip:hover { background: #0a0a0a; color: #f5f5f5; border-color: #0a0a0a; }
        }
        @media (prefers-color-scheme: dark) {
          .lantern-chip {
            color: #aaa;
            border-color: #333;
            background: transparent;
          }
          .lantern-chip:hover { background: #f0f0f0; color: #111; border-color: #f0f0f0; }
        }

        /* ── input row ── */
        .lantern-input-row {
          display: flex;
          align-items: center;
          border-top: 1.5px solid;
          padding: 0.5rem 0.75rem;
          gap: 0.5rem;
        }
        @media (prefers-color-scheme: light) { .lantern-input-row { border-color: #e0e0e0; background: #fafafa; } }
        @media (prefers-color-scheme: dark)  { .lantern-input-row { border-color: #222; background: #0d0d0d; } }

        .lantern-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-family: 'DM Mono', monospace;
          font-size: 0.78rem;
          caret-color: currentColor;
        }
        @media (prefers-color-scheme: light) { .lantern-input { color: #111; } .lantern-input::placeholder { color: #aaa; } }
        @media (prefers-color-scheme: dark)  { .lantern-input { color: #e0e0e0; } .lantern-input::placeholder { color: #555; } }

        .lantern-send {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1.5px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.15s, background 0.15s;
        }
        .lantern-send:hover { transform: scale(1.1); }
        @media (prefers-color-scheme: light) {
          .lantern-send { background: #0a0a0a; border-color: #0a0a0a; color: #f5f5f5; }
          .lantern-send:hover { background: #333; }
        }
        @media (prefers-color-scheme: dark) {
          .lantern-send { background: #f0f0f0; border-color: #f0f0f0; color: #111; }
          .lantern-send:hover { background: #ccc; }
        }
      `}</style>

      <div className="lantern-root">
        {/* Toggle button */}
        <button
          className={`lantern-toggle ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle Lantern chat"
        >
          <span className="lantern-toggle-dot" />
          {open ? "Close" : "Ask Lantern"}
        </button>

        {/* Chat window */}
        {open && (
          <div className="lantern-window" role="dialog" aria-label="Lantern AI Chat">

            {/* Header */}
            <div className="lantern-header">
              <div className="lantern-header-left">
                {/* Lantern SVG logo */}
                <svg className="lantern-logo" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="7" y="2" width="8" height="2" rx="1" fill="currentColor" opacity="0.9"/>
                  <rect x="9" y="1" width="4" height="2" rx="1" fill="currentColor" opacity="0.6"/>
                  <rect x="4" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M8 11 L11 8 L14 11 L11 16Z" fill="currentColor" opacity="0.85"/>
                  <rect x="9" y="18" width="4" height="3" rx="1" fill="currentColor" opacity="0.6"/>
                </svg>
                <div>
                  <div className="lantern-title">Lantern</div>
                  <div className="lantern-status">● online</div>
                </div>
              </div>
              <button
                className="lantern-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="lantern-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`lantern-row ${msg.role}`}>
                  <div className={`lantern-bubble ${msg.role}`}>{msg.text}</div>
                </div>
              ))}

              {loading && (
                <div className="lantern-row bot">
                  <div className="lantern-typing">
                    <span className="lantern-dot" />
                    <span className="lantern-dot" />
                    <span className="lantern-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            <div className="lantern-suggestions">
              {SUGGESTIONS.map((q, i) => (
                <button
                  key={i}
                  className="lantern-chip"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="lantern-input-row">
              <input
                className="lantern-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                aria-label="Chat input"
              />
              <button
                className="lantern-send"
                onClick={() => sendMessage()}
                aria-label="Send message"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

          </div>
        )}
      </div>
    </>
  );
}