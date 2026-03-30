const projects = [
  {
    name: "SPC Evaluation System",
    desc: "Teacher performance evaluation platform",
    repoLink: "https://github.com/yourusername/spc-evaluation"
  },
  {
    name: "School Portal System", 
    desc: "Enrollment & tuition payment system",
    repoLink: "https://github.com/yourusername/school-portal"
  }
]

export default function Projects() {
  return (
    <section className="p-8 rounded-3xl border border-black/10 dark:border-white/20 
                       backdrop-blur-xl bg-white/70 dark:bg-black/50">
     <h2 className="text-xl font-semibold mb-3">Recent Projects</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <a
            key={p.name}
            href={p.repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block p-8 border-2 border-black/5 dark:border-white/10 
                       rounded-3xl backdrop-blur-2xl
                       bg-white/80 dark:bg-black/40
                       hover:bg-white dark:hover:bg-white/20
                       transition-all duration-500 
                       hover:scale-105 hover:-translate-y-3
                       hover:border-black/20 dark:hover:border-white/30
                       shadow-xl hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-white/10
                       overflow-hidden"
          >
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-br 
                           from-white/30 dark:from-white/20 
                           to-transparent opacity-0 group-hover:opacity-100
                           transition-all duration-700 rounded-3xl" />
            
            {/* Shine effect */}
            <div className="absolute top-0 left-0 w-full h-1 
                           bg-gradient-to-r from-transparent via-white/80 to-transparent
                           opacity-0 group-hover:opacity-100 
                           transform -translate-x-full group-hover:translate-x-full
                           transition-all duration-1000" />
            
            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                {p.name}
              </h3>
              
              <p className="text-sm text-foreground/70 leading-relaxed mb-6">
                {p.desc}
              </p>
              
              {/* Action link */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100
                            translate-y-2 group-hover:translate-y-0
                            transition-all duration-500">
                <div className="w-2 h-2 bg-black dark:bg-white rounded-full 
                              group-hover:scale-125 transition-transform duration-300" />
                <span className="font-bold text-sm uppercase tracking-wider
                               text-black dark:text-white">
                  View Repository →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}