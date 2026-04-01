import { useEffect, useState } from "react"

const BOOT_LINES = [
  "Initializing runtime environment...",
  "Loading core modules...",
  "Establishing secure connection...",
  "Mounting file system...",
  "Compiling components...",
  "Syncing data streams...",
  "Ready.",
]

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    let lineIndex = 0

    const lineInterval = setInterval(() => {
      if (lineIndex < BOOT_LINES.length) {
        setVisibleLines((prev) => [...prev, BOOT_LINES[lineIndex]])
        setProgress(Math.round(((lineIndex + 1) / BOOT_LINES.length) * 100))
        lineIndex++
      } else {
        clearInterval(lineInterval)
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(onComplete, 700)
        }, 400)
      }
    }, 300)

    return () => clearInterval(lineInterval)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "#0a0e1a" }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,180,0.015) 2px, rgba(0,255,180,0.015) 4px)",
        }}
      />

      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,180,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,180,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-xl px-8">
        {/* Logo / Title */}
        <div className="mb-8 text-center">
          <div
            className="inline-block font-mono text-3xl font-bold tracking-widest mb-1"
            style={{ color: "#00ffb4", letterSpacing: "0.25em" }}
          >
            PORTFOLIO
          </div>
          <div
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "rgba(0,255,180,0.4)" }}
          >
            System Boot v1.0.0
          </div>
        </div>

        {/* Terminal log */}
        <div
          className="font-mono text-xs mb-6 rounded"
          style={{
            background: "rgba(0,255,180,0.04)",
            border: "1px solid rgba(0,255,180,0.15)",
            padding: "1rem",
            minHeight: "160px",
          }}
        >
          {visibleLines.map((line, i) => (
            <div
              key={i}
              className="leading-relaxed animate-fade-in"
              style={{
                color: i === visibleLines.length - 1 ? "#00ffb4" : "rgba(0,255,180,0.45)",
              }}
            >
              <span style={{ color: "rgba(0,255,180,0.3)" }}>{">"} </span>
              {line}
              {i === visibleLines.length - 1 && (
                <span
                  className="inline-block w-2 h-3 ml-1 align-middle"
                  style={{
                    background: "#00ffb4",
                    animation: "blink 0.8s step-end infinite",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div
            className="w-full rounded-full overflow-hidden"
            style={{
              height: "3px",
              background: "rgba(0,255,180,0.1)",
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #00ffb4, #00c8ff)",
                boxShadow: "0 0 8px rgba(0,255,180,0.6)",
              }}
            />
          </div>
        </div>

        {/* Progress label */}
        <div className="flex justify-between font-mono text-xs" style={{ color: "rgba(0,255,180,0.35)" }}>
          <span>Loading...</span>
          <span>{progress}%</span>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  )
}