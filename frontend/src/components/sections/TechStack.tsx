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
    <section className="p-8 rounded-xl overflow-hidden">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Tech Stack
      </h2>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
          cursor: default;
        }
      `}</style>

      <div className="relative w-full overflow-hidden group">
        {/* The track: duplicated stack to ensure seamless loop */}
        <div className="flex gap-10 w-max animate-scroll">
          {[...stack, ...stack].map((tech, i) => {
            const Icon = tech.icon
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-2 min-w-[90px]"
              >
                <Icon className="text-3xl opacity-80 text-slate-700 dark:text-slate-300" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
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