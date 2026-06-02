import Link from "next/link";
import { SafeImage as Image } from "@/components/SafeImage";
import { Calendar, MapPin, PlayCircle } from "lucide-react";
import type { Project } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  const href = project.slug ? `/projects/${project.slug}` : "/projects";

  return (
    <Link href={href} className="card card-hover group block overflow-hidden">
      <article>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-leaf-600 px-3 py-1 text-xs font-semibold text-white shadow">
            {CATEGORY_LABELS[project.category]}
          </span>
          {project.video && (
            <span className="absolute right-3 top-3 text-white drop-shadow">
              <PlayCircle className="h-7 w-7" />
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="line-clamp-2 font-display text-base font-bold text-slate-900">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{project.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand-500" /> {project.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-brand-500" />
              {new Date(project.completedAt).toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
