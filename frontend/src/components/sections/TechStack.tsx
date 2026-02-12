import { FaReact, FaNodeJs, FaPhp, FaGitAlt, FaBootstrap } from "react-icons/fa"
import { SiTypescript, SiTailwindcss, SiMysql } from "react-icons/si"
import { VscCode } from "react-icons/vsc"


const stack = [
  { name: "React", icon: FaReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Node.js", icon: FaNodeJs },
  { name: "PHP", icon: FaPhp },
  { name: "MySQL", icon: SiMysql },
  { name: "Git", icon: FaGitAlt },
  { name: "Bootstrap", icon: FaBootstrap },
  { name: "VS Code", icon: VscCode }
]

export default function TechStack() {
  return (
    <section className="p-8 rounded-xl border-2 overflow-hidden">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Tech Stack
      </h2>

      {/* MARQUEE */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-10 animate-marquee w-max">
          {[...stack, ...stack].map((tech, i) => {
            const Icon = tech.icon
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-2 min-w-[90px]"
              >
                <Icon className="text-3xl opacity-80" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {tech.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
