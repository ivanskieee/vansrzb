import Profile from "../components/sections/Profile"
import About from "../components/sections/About"
import TechStack from "../components/sections/TechStack"
import Projects from "../components/sections/Projects"
import Experience from "../components/sections/Experience"
import Certifications from "../components/sections/Certifications"
import Sidebar from "../components/layout/Sidebar"
import Footer from "../components/layout/Footer"

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 py-4 sm:py-6 lg:py-8">

        {/* LEFT / MAIN */}
        <section className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Profile />
          <About />
          <TechStack />
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-4 sm:space-y-6 order-last lg:order-none">
          <Sidebar />
          <Experience />
        </aside>

        {/* PROJECTS */}
        <section className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Projects />
        </section>

        {/* CERTIFICATIONS (RIGHT OF PROJECTS) */}
        <aside className="space-y-4 sm:space-y-6">
          <Certifications />
        </aside>

      </div>

      <Footer />
    </>
  )
}