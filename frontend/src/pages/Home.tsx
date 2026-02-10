import Profile from "../components/sections/Profile"
import About from "../components/sections/About"
import TechStack from "../components/sections/TechStack"
import Projects from "../components/sections/Projects"
import Experience from "../components/sections/Experience"
import Sidebar from "../components/layout/Sidebar"

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
      
      {/* LEFT / MAIN */}
      <section className="lg:col-span-2 space-y-8">
        <Profile />
        <About />
        <TechStack />
        <Projects />
      </section>

      {/* RIGHT SIDEBAR */}
      <aside className="space-y-6">
        <Sidebar />
        <Experience />
      </aside>

    </div>
  )
}
