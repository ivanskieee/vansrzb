import { useState } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! I’m Ivan’s AI assistant. Ask me about his skills, projects, or experience 👋",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
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
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition"
      >
        {open ? "Close" : "Ask AI"}
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 bg-white border shadow-2xl rounded-2xl flex flex-col animate-fadeIn">
          {/* Header */}
          <div className="bg-black text-white p-3 rounded-t-2xl text-sm font-semibold">
            Ivan AI Assistant
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-3 space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl max-w-[75%] ${
                    msg.role === "user"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && <div className="text-gray-400 text-xs">Typing...</div>}
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 pb-2 flex flex-wrap gap-2">
            {["Who is Ivan?", "What are his skills?", "Show projects"].map(
              (q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="text-xs border px-2 py-1 rounded-full hover:bg-gray-100"
                >
                  {q}
                </button>
              ),
            )}
          </div>

          {/* Input */}
          <div className="flex border-t">
            <input
              className="flex-1 p-2 text-sm outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="px-4 text-sm font-medium">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
