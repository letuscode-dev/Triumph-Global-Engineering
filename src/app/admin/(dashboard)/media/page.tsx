import { getMedia } from "@/lib/repository";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MediaManager } from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const items = await getMedia();
  return (
    <div>
      <AdminHeader
        title="Media Library"
        description="Drag & drop to upload images and videos to Cloudinary, then organise your gallery."
      />
      <MediaManager initialItems={items} />
    </div>
  );
}
