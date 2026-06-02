import { isCloudinaryConfigured, uploadToCloudinary } from "./cloudinary";
import { isSupabaseConfigured } from "./supabase/config";

// Media uploads work when EITHER Cloudinary OR Supabase Storage is configured.
export const isUploadConfigured = isCloudinaryConfigured || isSupabaseConfigured;

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
 * Uploads a media file and returns its public URL. Prefers Cloudinary when
 * configured, otherwise falls back to Supabase Storage.
 */
export async function uploadMedia(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (isCloudinaryConfigured) {
    return uploadToCloudinary(file, onProgress);
  }
  if (isSupabaseConfigured) {
    return uploadToSupabaseStorage(file, onProgress);
  }
  throw new Error("No media storage configured.");
}
