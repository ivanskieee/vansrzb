const projects = [
  {
    name: "SPC Evaluation System",
    desc: "Teacher performance evaluation platform"
  },
  {
    name: "School Portal System",
    desc: "Enrollment & tuition payment system"
  }
]

export default function Projects() {
  return (
    <section className="p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map(p => (
          <div key={p.name} className="p-4 border rounded">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
