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

interface LoadingScreenProps {
  onComplete: () => void
  isDark: boolean
}

export default function LoadingScreen({ onComplete, isDark }: LoadingScreenProps) {
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
    // Apply "dark" class here so (&:is(.dark *)) CSS vars resolve correctly
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      } ${isDark ? "dark" : ""}`}
      style={{ background: "var(--background)" }}
    >
      {/* Subtle grid using --border */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-xl px-8">
        {/* Identity block */}
        <div className="mb-8 text-center">
          <div
            className="font-mono font-bold tracking-widest mb-1"
            style={{ fontSize: "1.875rem", color: "var(--foreground)", letterSpacing: "0.2em" }}
          >
            VAN'S
          </div>
          <div
            className="font-mono font-medium tracking-widest mb-1"
            style={{ fontSize: "0.875rem", color: "var(--foreground)", letterSpacing: "0.15em", opacity: 0.7 }}
          >
            PORTFOLIO
          </div>
          <div
            className="font-mono tracking-widest uppercase"
            style={{ fontSize: "0.7rem", color: "var(--foreground)", opacity: 0.4 }}
          >
            Full-Stack Developer · v3.0.0
          </div>
        </div>

        {/* Terminal log */}
        <div
          className="font-mono mb-6 rounded-xl"
          style={{
            fontSize: "0.75rem",
            background: "var(--card)",
            border: "1px solid var(--border)",
            padding: "1rem",
            minHeight: "160px",
          }}
        >
          {visibleLines.map((line, i) => (
            <div
              key={i}
              className="leading-relaxed ls-fade-in"
              style={{
                color: "var(--foreground)",
                opacity: i === visibleLines.length - 1 ? 1 : 0.45,
              }}
            >
              <span style={{ opacity: 0.3 }}>{">"} </span>
              {line}
              {i === visibleLines.length - 1 && (
                <span
                  className="inline-block w-2 h-3 ml-1 align-middle"
                  style={{
                    background: "var(--foreground)",
                    animation: "ls-blink 0.8s step-end infinite",
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
            style={{ height: "3px", background: "var(--border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: "var(--foreground)" }}
            />
          </div>
        </div>

        {/* Progress label */}
        <div
          className="flex justify-between font-mono"
          style={{ fontSize: "0.7rem", color: "var(--foreground)", opacity: 0.35 }}
        >
          <span>Loading...</span>
          <span>{progress}%</span>
        </div>
      </div>

      <style>{`
        @keyframes ls-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes ls-fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ls-fade-in {
          animation: ls-fadeIn 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  )
}