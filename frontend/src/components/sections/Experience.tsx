"use client";

import { useState } from "react";

const milestones = [
  {
    year: "2026",
    title: "System Analyst",
    org: "Datalink Creative Solutions Incorporation",
    description:
      "Bridged the gap between business needs and technical solutions. Analyzing systems, designing flows, and making sure everything actually makes sense.",
  },
  {
    year: "2025",
    title: "Graduated Cum Laude",
    org: "San Pablo Colleges",
    description:
      "Walked across that stage with Latin honors. Four years of late nights, debugging sessions, and cramming transformed into something real.",
  },
  {
    year: "2025",
    title: "MIS Intern",
    org: "Management Information Systems",
    description:
      "Interned and built a full queueing system for the department. First time real users depended on something I built. Terrifying. Thrilling.",
  },
  {
    year: "2023",
    title: "Web Development Spark",
    org: "College Projects & Self-Study",
    description:
      "Fell deep into web development rabbit holes. HTML, CSS, JavaScript — built ugly websites and loved every second of it.",
  },
  {
    year: "2021",
    title: "BS Information Technology",
    org: "San Pablo Colleges",
    description:
      "Walked into college as a gamer, slowly became a curious developer. Started making sense of algorithms, databases, and why things actually work.",
  },
  {
    year: "2020",
    title: "Level 1: Code Noob",
    org: "Curious",
    description:
      "Just a clueless SHS student by day, gamer by night. I stumbled into coding with a gamer mindset—curious, persistent, and ready to level up. Wrote my first line of code and was hooked instantly.",
  },
];

export default function Experience() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="p-4 sm:p-6 rounded-lg border">
      <h2 className="text-base sm:text-lg font-semibold mb-3">Experience</h2>
      <ul className="space-y-3 text-sm">
        {milestones.map((m, i) => (
          <li
            key={i}
            className="cursor-pointer"
            onClick={() => setActive(active === i ? null : i)}
          >
            <strong className="text-xs sm:text-sm">{m.title}</strong>
            <span className="text-xs sm:text-sm"> – {m.org}</span>
            <br />
            <span className="text-slate-500 text-xs">{m.year}</span>
            {active === i && (
              <p className="mt-1 text-slate-400 text-xs leading-relaxed border-l-2 border-slate-400 pl-2 ml-1">
                {m.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
