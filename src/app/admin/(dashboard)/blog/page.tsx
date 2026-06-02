import { getPosts } from "@/lib/repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ContentManager, type Field } from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

const fields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug (auto if blank)", type: "text", half: true },
  {
    name: "category",
    label: "Category",
    type: "select",
    half: true,
    options: [
      "Borehole Drilling Tips",
      "Water Management",
      "Irrigation Solutions",
      "Solar Energy",
      "Company News",
      "Project Updates",
    ],
  },
  { name: "author", label: "Author", type: "text", half: true },
  { name: "publishedAt", label: "Publish Date", type: "date", half: true },
  { name: "readMinutes", label: "Read Minutes", type: "number", half: true },
  { name: "excerpt", label: "Excerpt", type: "textarea" },
  {
    name: "content",
    label: "Content (use blank lines for paragraphs)",
    type: "textarea",
  },
  { name: "cover", label: "Featured Image", type: "image" },
];

export default async function AdminBlogPage() {
  const items = (await getPosts()) as unknown as Record<string, unknown>[];
  return (
    <div>
      <AdminHeader
        title="Blog & News"
        description="Publish and manage articles, tips and company updates."
      />
      <ContentManager
        type="blog"
        idField="slug"
        titleField="title"
        subtitleField="category"
        imageField="cover"
        fields={fields}
        initialItems={items}
      />
    </div>
  );
}
