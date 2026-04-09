import { useState, useRef, useEffect, useCallback } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

const SUGGESTIONS = ["Who is Ivan?", "What are his skills?", "Show projects"];

const BUBBLE_PHRASES = [
  "hey, it's Lantern",
  "ask me about Ivan",
  "go ahead, ask away",
];

const ICON_SIZE = 52;

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! I'm Lantern — Ask me about his skills, projects, or experience." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [dragged, setDragged] = useState<{ left: number; top: number } | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Bubble loop — keyed on `open`. Stops immediately when open=true.
  useEffect(() => {
    if (open) {
      // Kill bubble right away when chat opens
      setBubbleVisible(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      // Small initial delay before first phrase
      await sleep(900);
      while (!cancelled) {
        setBubbleVisible(true);
        await sleep(2600);
        if (cancelled) break;
        setBubbleVisible(false);
        await sleep(600);
        if (cancelled) break;
        setPhraseIndex((i) => (i + 1) % BUBBLE_PHRASES.length);
        await sleep(350);
      }
      // Ensure hidden if loop was cancelled mid-visible
      setBubbleVisible(false);
    };

    run();
    return () => {
      cancelled = true;
      setBubbleVisible(false);
    };
  }, [open]); // re-runs when open flips

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!anchorRef.current) return;
    isDragging.current = true;
    hasMoved.current = false;
    const rect = anchorRef.current.getBoundingClientRect();
    dragStart.current = { x: e.clientX, y: e.clientY, left: rect.left, top: rect.top };
    e.preventDefault();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved.current = true;
      setDragged({
        left: Math.max(8, Math.min(dragStart.current.left + dx, window.innerWidth - ICON_SIZE - 8)),
        top: Math.max(8, Math.min(dragStart.current.top + dy, window.innerHeight - ICON_SIZE - 8)),
      });
    };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const handleIconClick = () => {
    if (hasMoved.current) { hasMoved.current = false; return; }
    setOpen((o) => !o);
  };

  const sendMessage = async (text?: string) => {
    const query = text ?? input;
    if (!query.trim()) return;
    const userMsg: Message = { role: "user", text: query };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();
      setMessages([...next, { role: "bot", text: data.reply }]);
    } catch {
      setMessages([...next, { role: "bot", text: "Error connecting to AI." }]);
    }
    setLoading(false);
  };

  const anchorStyle: React.CSSProperties = dragged
    ? { position: "fixed", left: dragged.left, top: dragged.top, right: "auto", bottom: "auto" }
    : { position: "fixed", right: 24, bottom: 24, left: "auto", top: "auto" };

  const getPanelPos = (): React.CSSProperties => {
    const PANEL_W = Math.min(292, window.innerWidth - 24);
    const PANEL_H = 322;
    if (dragged) {
      const pl = Math.max(8, Math.min(dragged.left + ICON_SIZE - PANEL_W, window.innerWidth - PANEL_W - 8));
      const pt = Math.max(8, dragged.top - PANEL_H - 10);
      return { position: "fixed", left: pl, top: pt, width: PANEL_W };
    }
    return { position: "fixed", right: 24, bottom: 24 + ICON_SIZE + 10, left: "auto", top: "auto", width: PANEL_W };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
        .ln-root { font-family: 'DM Mono', monospace; }

        .ln-anchor {
          z-index: 9999;
          display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
          cursor: grab; user-select: none;
        }
        .ln-anchor:active { cursor: grabbing; }

        /* Bubble */
        .ln-bubble {
          border-radius: 11px 11px 3px 11px;
          padding: 8px 13px;
          font-size: 11.5px;
          line-height: 1.5;
          max-width: 168px;
          white-space: nowrap;
          transform-origin: bottom right;
          pointer-events: none;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .ln-bubble.vis  { opacity: 1; transform: translateY(0) scale(1); }
        .ln-bubble.hide { opacity: 0; transform: translateY(5px) scale(0.95); }

        @media (prefers-color-scheme: light) {
          .ln-bubble { background:#fff; border:1px solid #e0e0e0; color:#111; box-shadow:0 2px 16px rgba(0,0,0,.09); }
          .ln-lbl { color:#c0c0c0; }
        }
        @media (prefers-color-scheme: dark) {
          .ln-bubble { background:#1c1c1f; border:1px solid #2e2e34; color:#eee; box-shadow:0 2px 16px rgba(0,0,0,.45); }
          .ln-lbl { color:#55555a; }
        }
        .ln-lbl { display:block; font-size:9px; margin-bottom:2px; letter-spacing:.08em; text-transform:uppercase; }

        /* Icon */
        .ln-icon {
          width:${ICON_SIZE}px; height:${ICON_SIZE}px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; transition:transform .18s, box-shadow .2s;
        }
        .ln-icon:hover { transform:scale(1.1); }
        @media (prefers-color-scheme: light) {
          .ln-icon { background:#fff; border:1.5px solid #e0e0e0; color:#111; box-shadow:0 3px 18px rgba(0,0,0,.12); }
          .ln-icon:hover { box-shadow:0 6px 26px rgba(0,0,0,.18); }
        }
        @media (prefers-color-scheme: dark) {
          .ln-icon { background:#1c1c1f; border:1.5px solid #2e2e34; color:#eee; box-shadow:0 3px 18px rgba(0,0,0,.5); }
          .ln-icon:hover { box-shadow:0 6px 26px rgba(0,0,0,.65); }
        }

        /* Panel */
        .ln-panel { z-index:9998; border-radius:15px; overflow:hidden; animation:lnSlide .25s cubic-bezier(0.22,1,0.36,1) both; }
        @media (prefers-color-scheme: light) { .ln-panel { background:#fff; border:1px solid #e2e2e2; box-shadow:0 8px 38px rgba(0,0,0,.11); } }
        @media (prefers-color-scheme: dark)  { .ln-panel { background:#111114; border:1px solid #252529; box-shadow:0 8px 38px rgba(0,0,0,.55); } }

        .ln-hdr { padding:10px 14px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid; }
        @media (prefers-color-scheme: light) { .ln-hdr { background:#f6f6f6; border-color:#ebebeb; } }
        @media (prefers-color-scheme: dark)  { .ln-hdr { background:#18181c; border-color:#252529; } }
        .ln-hdrl { display:flex; align-items:center; gap:8px; }
        .ln-dot-g { width:7px; height:7px; border-radius:50%; background:#4ade80; }
        .ln-htit { font-size:10.5px; font-weight:500; letter-spacing:.12em; text-transform:uppercase; }
        @media (prefers-color-scheme: light) { .ln-htit { color:#111; } }
        @media (prefers-color-scheme: dark)  { .ln-htit { color:#eee; } }
        .ln-xbtn { background:none; border:none; cursor:pointer; font-size:17px; line-height:1; padding:0; opacity:.4; transition:opacity .15s; }
        .ln-xbtn:hover { opacity:1; }
        @media (prefers-color-scheme: light) { .ln-xbtn { color:#111; } }
        @media (prefers-color-scheme: dark)  { .ln-xbtn { color:#eee; } }

        .ln-msgs { height:180px; overflow-y:auto; padding:10px; display:flex; flex-direction:column; gap:7px; scrollbar-width:thin; }
        @media (prefers-color-scheme: light) { .ln-msgs { scrollbar-color:#ddd transparent; } }
        @media (prefers-color-scheme: dark)  { .ln-msgs { scrollbar-color:#333 transparent; } }
        .ln-msg { padding:7px 11px; border-radius:10px; font-size:11.5px; line-height:1.55; max-width:80%; animation:lnPop .2s ease both; }
        @media (prefers-color-scheme: light) {
          .ln-msg.user { align-self:flex-end; background:#111; color:#f5f5f5; border-bottom-right-radius:3px; }
          .ln-msg.bot  { align-self:flex-start; background:#f1f1f1; color:#111; border-bottom-left-radius:3px; }
        }
        @media (prefers-color-scheme: dark) {
          .ln-msg.user { align-self:flex-end; background:#e8e8e8; color:#111; border-bottom-right-radius:3px; }
          .ln-msg.bot  { align-self:flex-start; background:#222227; color:#e8e8e8; border-bottom-left-radius:3px; }
        }

        .ln-typing { align-self:flex-start; display:flex; align-items:center; gap:4px; padding:7px 11px; border-radius:10px 10px 10px 3px; }
        @media (prefers-color-scheme: light) { .ln-typing { background:#f1f1f1; } }
        @media (prefers-color-scheme: dark)  { .ln-typing { background:#222227; } }
        .ln-tdot { width:5px; height:5px; border-radius:50%; animation:lnBounce 1.2s ease-in-out infinite; }
        @media (prefers-color-scheme: light) { .ln-tdot { background:#aaa; } }
        @media (prefers-color-scheme: dark)  { .ln-tdot { background:#666; } }
        .ln-tdot:nth-child(2){animation-delay:.2s;} .ln-tdot:nth-child(3){animation-delay:.4s;}

        .ln-chips { display:flex; flex-wrap:wrap; gap:5px; padding:7px 10px; border-top:1px solid; }
        @media (prefers-color-scheme: light) { .ln-chips { border-color:#ebebeb; } }
        @media (prefers-color-scheme: dark)  { .ln-chips { border-color:#252529; } }
        .ln-chip { font-family:'DM Mono',monospace; font-size:10px; padding:3px 9px; border-radius:9999px; border:1px solid; cursor:pointer; background:transparent; transition:background .15s,color .15s,border-color .15s; }
        @media (prefers-color-scheme: light) { .ln-chip{color:#555;border-color:#d0d0d0;} .ln-chip:hover{background:#111;color:#f5f5f5;border-color:#111;} }
        @media (prefers-color-scheme: dark)  { .ln-chip{color:#888;border-color:#333;} .ln-chip:hover{background:#e8e8e8;color:#111;border-color:#e8e8e8;} }

        .ln-irow { display:flex; align-items:center; border-top:1px solid; padding:7px 9px; gap:7px; }
        @media (prefers-color-scheme: light) { .ln-irow { border-color:#ebebeb; background:#fafafa; } }
        @media (prefers-color-scheme: dark)  { .ln-irow { border-color:#252529; background:#0d0d10; } }
        .ln-inp { flex:1; background:none; border:none; outline:none; font-family:'DM Mono',monospace; font-size:11.5px; }
        @media (prefers-color-scheme: light) { .ln-inp{color:#111;} .ln-inp::placeholder{color:#bbb;} }
        @media (prefers-color-scheme: dark)  { .ln-inp{color:#e0e0e0;} .ln-inp::placeholder{color:#555;} }
        .ln-snd { width:28px; height:28px; border-radius:50%; border:1px solid; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:transform .15s; }
        .ln-snd:hover { transform:scale(1.12); }
        @media (prefers-color-scheme: light) { .ln-snd{background:#111;border-color:#111;color:#f5f5f5;} }
        @media (prefers-color-scheme: dark)  { .ln-snd{background:#e8e8e8;border-color:#e8e8e8;color:#111;} }

        @keyframes lnPop   { from{opacity:0;transform:scale(0.84) translateY(8px);} to{opacity:1;transform:scale(1) translateY(0);} }
        @keyframes lnSlide { from{opacity:0;transform:translateY(10px) scale(0.97);} to{opacity:1;transform:translateY(0) scale(1);} }
        @keyframes lnBounce{ 0%,80%,100%{transform:translateY(0);opacity:.4;} 40%{transform:translateY(-5px);opacity:1;} }
      `}</style>

      <div className="ln-root">

        {/* Draggable anchor */}
        <div
          ref={anchorRef}
          className="ln-anchor"
          style={anchorStyle}
          onMouseDown={onMouseDown}
        >
          {/* Bubble — only rendered when chat is closed */}
          {!open && (
            <div className={`ln-bubble ${bubbleVisible ? "vis" : "hide"}`}>
              <span className="ln-lbl">lantern</span>
              {BUBBLE_PHRASES[phraseIndex]}
            </div>
          )}

          {/* Icon */}
          <div
            className="ln-icon"
            onClick={handleIconClick}
            role="button"
            aria-label="Open Lantern chat"
          >
            <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
              <rect x="7" y="2" width="8" height="2" rx="1" fill="currentColor" opacity="0.85"/>
              <rect x="9" y="1" width="4" height="2" rx="1" fill="currentColor" opacity="0.5"/>
              <rect x="4" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none"/>
              <path d="M8 11 L11 8 L14 11 L11 16Z" fill="currentColor" opacity="0.8"/>
              <rect x="9" y="18" width="4" height="3" rx="1" fill="currentColor" opacity="0.5"/>
            </svg>
          </div>
        </div>

        {/* Chat panel */}
        {open && (
          <div className="ln-panel" style={getPanelPos()} role="dialog" aria-label="Lantern AI Chat">
            <div className="ln-hdr">
              <div className="ln-hdrl">
                <div className="ln-dot-g" />
                <span className="ln-htit">Lantern</span>
              </div>
              <button className="ln-xbtn" onClick={() => setOpen(false)} aria-label="Close">×</button>
            </div>

            <div className="ln-msgs">
              {messages.map((msg, i) => (
                <div key={i} className={`ln-msg ${msg.role}`}>{msg.text}</div>
              ))}
              {loading && (
                <div className="ln-typing">
                  <span className="ln-tdot"/><span className="ln-tdot"/><span className="ln-tdot"/>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="ln-chips">
              {SUGGESTIONS.map((q, i) => (
                <button key={i} className="ln-chip" onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>

            <div className="ln-irow">
              <input
                className="ln-inp"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                aria-label="Chat input"
              />
              <button className="ln-snd" onClick={() => sendMessage()} aria-label="Send">
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
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