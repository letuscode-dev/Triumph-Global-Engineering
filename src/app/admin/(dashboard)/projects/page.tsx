import { getProjects } from "@/lib/repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ContentManager, type Field } from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

const fields: Field[] = [
  { name: "title", label: "Project Title", type: "text", half: true, required: true },
  { name: "slug", label: "Slug (auto if blank)", type: "text", half: true },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: ["borehole", "irrigation", "solar", "water"],
    half: true,
  },
  { name: "serviceType", label: "Service Type", type: "text", half: true },
  { name: "location", label: "Location", type: "text", half: true },
  { name: "completedAt", label: "Completion Date", type: "date", half: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "cover", label: "Cover Image", type: "image" },
  { name: "video", label: "Video URL (optional)", type: "text" },
  { name: "featured", label: "Featured on homepage", type: "checkbox", half: true },
];

export default async function AdminProjectsPage() {
  const items = (await getProjects()) as unknown as Record<string, unknown>[];
  return (
    <div>
      <AdminHeader
        title="Projects"
        description="Add, edit and remove portfolio projects with photos, locations and dates."
      />
      <ContentManager
        type="projects"
        idField="id"
        titleField="title"
        subtitleField="location"
        imageField="cover"
        fields={fields}
        initialItems={items}
      />
    </div>
  );
}
