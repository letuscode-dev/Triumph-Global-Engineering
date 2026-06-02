"use client";

import { useMemo, useState } from "react";
import type { Project, ServiceCategory } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

const FILTERS: { key: ServiceCategory | "all"; label: string }[] = [
  { key: "all", label: "All Projects" },
  { key: "borehole", label: "Borehole & Water" },
  { key: "irrigation", label: "Irrigation" },
  { key: "solar", label: "Solar" },
];

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ServiceCategory | "all">("all");

  const filtered = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category === active)),
    [active, projects]
  );

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActive(f.key)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              active === f.key
                ? "bg-brand-600 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-slate-500">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
