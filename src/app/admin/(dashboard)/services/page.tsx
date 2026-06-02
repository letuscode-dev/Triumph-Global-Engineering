import { getServices } from "@/lib/repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ContentManager, type Field } from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

const fields: Field[] = [
  { name: "title", label: "Service Title", type: "text", half: true, required: true },
  { name: "shortTitle", label: "Short Title", type: "text", half: true },
  { name: "slug", label: "Slug (auto if blank)", type: "text", half: true },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: ["borehole", "irrigation", "solar", "water"],
    half: true,
  },
  { name: "icon", label: "Icon (lucide name)", type: "text", half: true },
  { name: "excerpt", label: "Short Excerpt", type: "textarea" },
  { name: "description", label: "Full Description", type: "textarea" },
  { name: "benefits", label: "Benefits", type: "tags" },
  { name: "keywords", label: "SEO Keywords", type: "tags" },
  { name: "image", label: "Main Image", type: "image" },
];

export default async function AdminServicesPage() {
  const items = (await getServices()) as unknown as Record<string, unknown>[];
  return (
    <div>
      <AdminHeader
        title="Services"
        description="Manage the services shown across the website."
      />
      <ContentManager
        type="services"
        idField="slug"
        titleField="title"
        subtitleField="excerpt"
        imageField="image"
        fields={fields}
        initialItems={items}
      />
    </div>
  );
}
