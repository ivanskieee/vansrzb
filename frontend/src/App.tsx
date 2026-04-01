import { useState, useCallback, useEffect } from "react"
import Home from "./pages/Home"
import Header from "./components/layout/Header"
import Chatbot from "./components/chatbot/Chatbot"
import LoadingScreen from "./components/loadingsc/LoadingScreen"
import SkeletonLoader from "./components/loadingsc/SkeletonLoader"

const SESSION_KEY = "portfolio_booted"

type LoadState = "boot" | "skeleton" | "ready"

function getInitialLoadState(): LoadState {
  try {
    return sessionStorage.getItem(SESSION_KEY) ? "skeleton" : "boot"
  } catch {
    return "boot"
  }
}

function detectDarkMode(): boolean {
  try {
    if (document.documentElement.classList.contains("dark")) return true
    if (document.documentElement.classList.contains("light")) return false
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  } catch {
    return false
  }
}

export default function App() {
  const [loadState, setLoadState] = useState<LoadState>(getInitialLoadState)
  const [isDark, setIsDark] = useState(detectDarkMode)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onMqChange = () => setIsDark(detectDarkMode())
    mq.addEventListener("change", onMqChange)

    const observer = new MutationObserver(() => setIsDark(detectDarkMode()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      mq.removeEventListener("change", onMqChange)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (loadState === "skeleton") {
      const t = setTimeout(() => setLoadState("ready"), 1800)
      return () => clearTimeout(t)
    }
  }, [loadState])

  const handleBootComplete = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1")
    } catch { /* ignore */ }
    setLoadState("ready")
  }, [])

  return (
    <div className="min-h-screen">

      {/* ── FIRST OPEN: full tech boot screen ── */}
      {loadState === "boot" && (
        <LoadingScreen onComplete={handleBootComplete} isDark={isDark} />
      )}

      {/* ── REFRESH: skeleton placeholder ── */}
      {loadState === "skeleton" && (
        <>
          <Header />
          <SkeletonLoader isDark={isDark} />
        </>
      )}

      {/* ── READY: real content ── */}
      {loadState === "ready" && (
        <div style={{ animation: "pageReveal 0.5s ease-out forwards" }}>
          <Header />
          <main className="max-w-6xl mx-auto px-4">
            <Home />
          </main>
        </div>
      )}

      {/* Chatbot is ALWAYS mounted — never affected by loading states */}
      <Chatbot />

      <style>{`
        @keyframes pageReveal {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}