const stack = {
  Frontend: ["React", "TypeScript", "Tailwind CSS"],
  Backend: ["PHP", "Node.js", "MySQL", "PDO"],
  Tools: ["Git", "VS Code", "Bootstrap"]
}

export default function TechStack() {
  return (
    <section className="p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(stack).map(([key, items]) => (
          <div key={key}>
            <h3 className="font-medium mb-2">{key}</h3>
            <div className="flex flex-wrap gap-2">
              {items.map(i => (
                <span key={i} className="px-2 py-1 text-sm border rounded">
                  {i}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
