"use client";

import { useState, useRef, useEffect } from "react";

const MODES: Record<string, { title: string; tag: string; icon: string; placeholder: string }> = {
  homework: { title: "Uy vazifasi yordamchisi", tag: "Homework", icon: "🏫", placeholder: "Masalan: Fotosintez nima? Ikkinchi jahon urushi qachon boshlangan?" },
  math:     { title: "Math Solver",             tag: "Math",     icon: "🔢", placeholder: "Masalan: x²+5x+6=0 ni yeching. Integral hisoblash..." },
  quiz:     { title: "Quiz Generator",          tag: "Quiz",     icon: "✅", placeholder: "Masalan: Biologiya bo'yicha 5 ta test savol yarat..." },
  grammar:  { title: "Grammar Checker",         tag: "Grammar",  icon: "📝", placeholder: "Tekshirmoqchi bo'lgan matnni yozing..." },
  summary:  { title: "Smart Summary",           tag: "Summary",  icon: "📄", placeholder: "Qisqartirmoqchi bo'lgan matnni yozing..." },
  essay:    { title: "Essay Helper",            tag: "Essay",    icon: "✍️", placeholder: "Insho mavzusini yozing. Masalan: Ekologiya muammolari..." },
};

type Message = {
  role: "user" | "ai";
  content: string;
};

const QUICK: Record<string, string[]> = {
  homework: ["Fotosintez nima?", "Ohm qonuni", "DNA tuzilishi", "Ikkinchi jahon urushi"],
  math:     ["x²+5x+6=0 yech", "Trigonometriya", "Integral", "Matritsa"],
  quiz:     ["Biologiya quizi", "Fizika testi", "Tarix savollari", "Kimyo testi"],
  grammar:  ["Check my grammar", "Correct this text", "Fix my essay", "Proofread"],
  summary:  ["Bu matnni qisqartir", "Asosiy fikrlar", "Kalit so'zlar", "Xulosa ber"],
  essay:    ["Ekologiya insho", "Yoshlik mavzusi", "Texnologiya insho", "Kirish yoz"],
};

export default function ChatPage() {
  const [mode, setMode] = useState("homework");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function autoResize() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, mode }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.reply || "Xatolik yuz berdi." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "⚠️ Server bilan ulanishda xatolik. Qayta urinib ko'ring." },
      ]);
    }

    setLoading(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function changeMode(newMode: string) {
    setMode(newMode);
    setMessages([]);
    setInput("");
  }

  return (
    <div style={{
      display: "flex", height: "100vh",
      background: "#0a0a0f", color: "#f0ede8",
      fontFamily: "system-ui, sans-serif",
    }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 220, background: "#13131a",
        borderRight: "1px solid #2a2a38",
        padding: "1rem", display: "flex",
        flexDirection: "column", gap: 4, overflowY: "auto",
      }}>
        <a href="/" style={{
          color: "#f0ede8", textDecoration: "none",
          fontWeight: 700, fontSize: "1.15rem",
          padding: "0.4rem 0", marginBottom: "0.5rem", display: "block",
        }}>
          <span style={{ color: "#f0c040" }}>S</span>ubject·GPT
        </a>

        <div style={{ fontSize: 11, color: "#7a7a8c", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.5rem 0 0.3rem", marginTop: 8 }}>
          Rejimlar
        </div>

        {Object.entries(MODES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => changeMode(key)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "0.55rem 0.75rem", borderRadius: 8,
              border: mode === key ? "1px solid rgba(240,192,64,0.3)" : "1px solid transparent",
              background: mode === key ? "rgba(240,192,64,0.1)" : "transparent",
              color: mode === key ? "#f0c040" : "#7a7a8c",
              cursor: "pointer", fontSize: 13,
              textAlign: "left", width: "100%",
              transition: "all 0.15s",
            }}
          >
            <span>{val.icon}</span> {val.tag}
          </button>
        ))}

        <div style={{ fontSize: 11, color: "#7a7a8c", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.5rem 0 0.3rem", marginTop: 8 }}>
          Sessiya
        </div>
        <button
          onClick={() => setMessages([])}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "0.55rem 0.75rem", borderRadius: 8,
            border: "1px solid transparent", background: "transparent",
            color: "#7a7a8c", cursor: "pointer",
            fontSize: 13, textAlign: "left", width: "100%",
          }}
        >
          🗑️ Tozalash
        </button>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{
          padding: "1rem 1.5rem", borderBottom: "1px solid #2a2a38",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{MODES[mode].icon}</span>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{MODES[mode].title}</span>
          </div>
          <span style={{
            fontSize: 11,
            background: "rgba(240,192,64,0.1)",
            border: "1px solid rgba(240,192,64,0.2)",
            color: "#f0c040", padding: "2px 10px", borderRadius: 20,
          }}>
            {MODES[mode].tag}
          </span>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "1.5rem",
          display: "flex", flexDirection: "column", gap: "1rem",
        }}>

          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#7a7a8c" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🤖</div>
              <div style={{ fontWeight: 500, color: "#f0ede8", marginBottom: "0.3rem", fontSize: 15 }}>
                Salom! Men Subject-GPT!
              </div>
              <div style={{ fontSize: 13 }}>
                Savolingizni yozing yoki quyidagi tezkor savollardan birini tanlang
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex", gap: 10,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16,
                flexShrink: 0,
                background: msg.role === "ai"
                  ? "rgba(192,132,252,0.15)"
                  : "rgba(240,192,64,0.15)",
                border: msg.role === "ai"
                  ? "1px solid rgba(192,132,252,0.3)"
                  : "1px solid rgba(240,192,64,0.3)",
              }}>
                {msg.role === "ai" ? "🤖" : "👤"}
              </div>

              {/* Bubble */}
              <div style={{
                background: msg.role === "user"
                  ? "rgba(240,192,64,0.08)"
                  : "#13131a",
                border: msg.role === "user"
                  ? "1px solid rgba(240,192,64,0.15)"
                  : "1px solid #2a2a38",
                borderRadius: 12,
                padding: "0.85rem 1rem",
                fontSize: 14, lineHeight: 1.75,
                whiteSpace: "pre-wrap",
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: "flex", gap: 10, alignSelf: "flex-start", maxWidth: "80%" }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16,
                background: "rgba(192,132,252,0.15)",
                border: "1px solid rgba(192,132,252,0.3)",
              }}>🤖</div>
              <div style={{
                background: "#13131a", border: "1px solid #2a2a38",
                borderRadius: 12, padding: "0.85rem 1rem",
                display: "flex", gap: 5, alignItems: "center",
              }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#7a7a8c",
                    animation: "bounce 1.2s infinite",
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #2a2a38", background: "#0a0a0f" }}>

          {/* Quick prompts */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {(QUICK[mode] || []).map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); textareaRef.current?.focus(); }}
                style={{
                  background: "#13131a", border: "1px solid #2a2a38",
                  color: "#7a7a8c", fontSize: 12,
                  padding: "4px 12px", borderRadius: 20,
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {q}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{
              flex: 1, background: "#13131a",
              border: "1px solid #2a2a38", borderRadius: 12, overflow: "hidden",
            }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); autoResize(); }}
                onKeyDown={handleKey}
                placeholder={MODES[mode].placeholder}
                rows={1}
                style={{
                  width: "100%", background: "transparent",
                  border: "none", color: "#f0ede8",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 14, padding: "0.85rem 1rem",
                  resize: "none", maxHeight: 120,
                  lineHeight: 1.5, outline: "none",
                }}
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? "#2a2a38" : "#f0c040",
                border: "none",
                color: loading || !input.trim() ? "#7a7a8c" : "#000",
                width: 44, height: 44, borderRadius: 10,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                fontSize: 18, flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              ➤
            </button>
          </div>

          <div style={{ fontSize: 11, color: "#7a7a8c", marginTop: 6, textAlign: "center" }}>
            Enter — yuborish · Shift+Enter — yangi qator
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a38; border-radius: 2px; }
      `}</style>
    </div>
  );
}