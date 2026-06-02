import { getFaqs } from "@/lib/repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ContentManager, type Field } from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

const fields: Field[] = [
  { name: "question", label: "Question", type: "text", required: true },
  { name: "answer", label: "Answer", type: "textarea" },
];

export default async function AdminFaqsPage() {
  const items = (await getFaqs()) as unknown as Record<string, unknown>[];
  return (
    <div>
      <AdminHeader title="FAQs" description="Manage frequently asked questions." />
      <ContentManager
        type="faqs"
        idField="question"
        titleField="question"
        subtitleField="answer"
        fields={fields}
        initialItems={items}
      />
    </div>
  );
}
