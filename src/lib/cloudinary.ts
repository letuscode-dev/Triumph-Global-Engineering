export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export const isCloudinaryConfigured = Boolean(
  CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET
);

// Uploads a file directly to Cloudinary using an unsigned upload preset.
// Returns the secure URL of the uploaded asset.
export async function uploadToCloudinary(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary is not configured.");
  }

  const resourceType = file.type.startsWith("video") ? "video" : "image";
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText).secure_url);
        } catch {
          reject(new Error("Invalid Cloudinary response."));
        }
      } else {
        reject(new Error("Upload failed."));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed."));
    xhr.send(form);
  });
}
