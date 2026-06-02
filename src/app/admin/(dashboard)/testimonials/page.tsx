import { getTestimonials } from "@/lib/repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ContentManager, type Field } from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

const fields: Field[] = [
  { name: "name", label: "Client Name", type: "text", half: true, required: true },
  { name: "role", label: "Role", type: "text", half: true },
  { name: "location", label: "Location", type: "text", half: true },
  { name: "rating", label: "Rating (1-5)", type: "number", half: true },
  { name: "quote", label: "Testimonial", type: "textarea" },
];

export default async function AdminTestimonialsPage() {
  const items = (await getTestimonials()) as unknown as Record<string, unknown>[];
  return (
    <div>
      <AdminHeader
        title="Testimonials"
        description="Manage client reviews shown on the website."
      />
      <ContentManager
        type="testimonials"
        idField="id"
        titleField="name"
        subtitleField="quote"
        fields={fields}
        initialItems={items}
      />
    </div>
  );
}
