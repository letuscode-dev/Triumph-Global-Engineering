import { isCloudinaryConfigured, uploadToCloudinary } from "./cloudinary";
import { isSupabaseConfigured } from "./supabase/config";

// Media uploads use Supabase Storage when configured; Cloudinary is an optional fallback.
export const isUploadConfigured = isSupabaseConfigured || isCloudinaryConfigured;

// Uploads via Supabase Storage through the protected admin route. Uses XHR so
// we can report progress to the UI.
function uploadToSupabaseStorage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText).url);
        } catch {
          reject(new Error("Invalid upload response."));
        }
      } else {
        let msg = "Upload failed.";
        try {
          msg = JSON.parse(xhr.responseText).error || msg;
        } catch {
          /* keep default */
        }
        reject(new Error(msg));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed."));
    xhr.send(form);
  });
}

/**
 * Uploads a media file and returns its public URL. Uses Supabase Storage by default;
 * Cloudinary is only used when Supabase is not configured.
 */
export async function uploadMedia(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (isSupabaseConfigured) {
    return uploadToSupabaseStorage(file, onProgress);
  }
  if (isCloudinaryConfigured) {
    return uploadToCloudinary(file, onProgress);
  }
  throw new Error("No media storage configured. Connect Supabase to enable uploads.");
}
