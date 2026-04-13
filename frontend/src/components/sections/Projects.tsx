import React from "react";

const projects = [
  {
    name: "Records System",
    desc: "A system to organize records",
    tag: "Web App",
    year: "2025",
    stack: ["JavaScript", "Node JS", "MySQL"],
    repoLink: "https://github.com/kevinbalocos/records-management-cong-system",
    mockType: "dashboard",
    image: "/rms.jpg",
  },
  {
    name: "Business Permit System",
    desc: "A system to process business permit",
    tag: "Web App",
    year: "2025",
    stack: ["TypeScript", "Node JS", "MySQL"],
    repoLink: "https://github.com/kevinbalocos/business-permit-system", // replace if you have repo
    mockType: "Web App",
    image: "/bps.jpg",
  },
  {
    name: "Project Three",
    desc: "Add your project description here.",
    tag: "Mobile",
    year: "2024",
    stack: ["React Native", "Expo"],
    repoLink: "#",
    mockType: "mobile",
  },
  {
    name: "Project Four",
    desc: "Add your project description here.",
    tag: "Dashboard",
    year: "2023",
    stack: ["React", "Tailwind"],
    repoLink: "#",
    mockType: "cards",
  },
  {
    name: "Project Five",
    desc: "Add your project description here.",
    tag: "API",
    year: "2023",
    stack: ["Node.js", "Express"],
    repoLink: "#",
    mockType: "list",
  },
  {
    name: "Project Six",
    desc: "Add your project description here.",
    tag: "Tool",
    year: "2023",
    stack: ["Python", "FastAPI"],
    repoLink: "#",
    mockType: "chart",
  },
];

type MockUIProps = { type: string };

function MockUI({ type }: MockUIProps) {
  const base = "rounded bg-black/5 dark:bg-white/5";

  if (type === "portal") {
    return (
      <div className="flex flex-col gap-1.5 h-full">
        <div className={`${base} h-2 w-4/5`} />
        <div className="flex gap-1.5 h-5">
          <div className={`${base} flex-1`} />
          <div className={`${base} flex-1`} />
          <div className={`${base} flex-1`} />
          <div className={`${base} flex-1`} />
        </div>
        <div className="flex gap-1.5 flex-1">
          <div className={`${base} flex-[3]`} />
          <div className={`${base} flex-1`} />
        </div>
        <div className={`${base} h-2 w-1/2`} />
      </div>
    );
  }

  if (type === "mobile") {
    return (
      <div className="flex flex-col gap-1.5 h-full">
        <div className="flex gap-2 items-center h-6">
          <div className={`${base} rounded-full w-6 h-6 shrink-0`} />
          <div className="flex flex-col gap-1 flex-1">
            <div className={`${base} h-1.5 w-4/5`} />
            <div className={`${base} h-1.5 w-2/5`} />
          </div>
        </div>
        <div className={`${base} flex-1 rounded-md`} />
        <div className={`${base} h-2 w-full`} />
        <div className={`${base} h-2 w-3/5`} />
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="flex flex-col gap-1.5 h-full">
        <div className="flex gap-1.5 h-5">
          <div className={`${base} flex-1`} />
          <div className={`${base} flex-1`} />
          <div className={`${base} flex-1`} />
        </div>
        <div className={`${base} h-3 w-1/2`} />
        <div className="flex gap-1.5 flex-1">
          <div className={`${base} flex-1`} />
          <div className={`${base} flex-1`} />
        </div>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="flex flex-col gap-1.5 h-full">
        <div className={`${base} h-2.5 w-full`} />
        <div className="flex gap-2 flex-1">
          <div className={`${base} w-2/5`} />
          <div className="flex-1 flex flex-col gap-1.5 justify-center">
            <div className={`${base} h-1.5 w-4/5`} />
            <div className={`${base} h-1.5 w-3/5`} />
            <div className={`${base} h-1.5 w-2/5`} />
          </div>
        </div>
        <div className="flex gap-1.5 h-5">
          <div className={`${base} flex-1`} />
          <div className={`${base} flex-1`} />
        </div>
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="flex flex-col gap-1.5 h-full">
        <div className="flex gap-1.5 items-end flex-1">
          <div className={`${base} w-1/4 h-full`} />
          <div className={`${base} w-1/4 h-3/4`} />
          <div className={`${base} w-1/4 h-[90%]`} />
          <div className={`${base} w-1/4 h-1/2`} />
        </div>
        <div className={`${base} h-2 w-full`} />
        <div className={`${base} h-2 w-3/5`} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 h-full">
      <div className={`${base} h-2 w-3/5`} />
      <div className={`${base} h-2 w-2/5`} />
      <div className="flex gap-1.5 flex-1">
        <div className={`${base} flex-[1.2]`} />
        <div className={`${base} flex-[2]`} />
      </div>
      <div className="flex gap-1.5 h-5">
        <div className={`${base} flex-1`} />
        <div className={`${base} flex-1`} />
        <div className={`${base} flex-1`} />
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section className="p-6 sm:p-8 rounded-3xl border border-black/10 dark:border-white/10">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-xl font-semibold">Recent Projects</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-black/8 dark:divide-white/8 border border-black/8 dark:border-white/8 rounded-2xl overflow-hidden">
        {projects.map((p) => (
          <a
            key={p.name}
            href={p.repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col bg-white dark:bg-neutral-900 hover:bg-black/[0.02] dark:hover:bg-white/5 transition-colors duration-300 overflow-hidden"
          >
            <div className="flex-1 p-4 min-h-[100px] flex items-center justify-center">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <MockUI type={p.mockType} />
              )}
            </div>

            <div className="h-px bg-black/8 dark:bg-white/8" />

            <div className="px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-foreground/35 font-mono mb-1">
                {p.tag}
              </p>
              <p className="text-sm font-medium text-foreground truncate">
                {p.name}
              </p>
            </div>

            <div className="absolute inset-0 flex flex-col justify-center px-4 py-4 bg-white dark:bg-neutral-950 border-l-2 border-foreground/20 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 ease-out">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-mono mb-2">
                {p.tag} · {p.year}
              </p>

              <p className="text-sm font-medium text-foreground mb-1.5">
                {p.name}
              </p>

              <p className="text-xs text-foreground/60 leading-relaxed mb-3">
                {p.desc}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-black/10 dark:border-white/15 text-foreground/50"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <span className="text-xs font-medium text-foreground/80 tracking-wide">
                View repo →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
