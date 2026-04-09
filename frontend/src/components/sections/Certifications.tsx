export default function Certifications() {
  const certifications = [
    { title: "Responsive Web Design", issuer: "freeCodeCamp", year: "2024" },
    { title: "JavaScript Algorithms and Data Structures", issuer: "freeCodeCamp", year: "2024" },
    { title: "React Frontend Development", issuer: "Self Study", year: "2025" },
    { title: "Node.js Backend Fundamentals", issuer: "Self Study", year: "2025" },
    { title: "Git & Version Control", issuer: "Coursera", year: "2024" },
    { title: "Database Design with MySQL", issuer: "Self Study", year: "2023" },
  ]

  return (
    <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-black p-5">

      {/* Title */}
      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
        Certifications
      </h3>

      {/* Certifications List */}
      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div key={index}>
            <p className="font-medium text-black dark:text-white">
              {cert.title}
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              {cert.issuer} – {cert.year}
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}