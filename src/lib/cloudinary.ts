import { v2 as cloudinary } from "cloudinary";

const isConfigured =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function isCloudinaryConfigured(): boolean {
  return isConfigured;
}

export async function uploadImage(
  file: Buffer | string,
  folder = "rasoiverse/recipes",
): Promise<{ url: string; publicId: string } | null> {
  if (!isConfigured) return null;

  const result = await cloudinary.uploader.upload(
    typeof file === "string" ? file : `data:image/jpeg;base64,${file.toString("base64")}`,
    { folder, resource_type: "image" },
  );

  return { url: result.secure_url, publicId: result.public_id };
}

export async function uploadAudio(
  file: Buffer | string,
  folder = "rasoiverse/audio",
): Promise<{ url: string; publicId: string; duration?: number } | null> {
  if (!isConfigured) return null;

  const result = await cloudinary.uploader.upload(
    typeof file === "string" ? file : `data:audio/mpeg;base64,${file.toString("base64")}`,
    { folder, resource_type: "video" },
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    duration: result.duration ? Math.round(result.duration) : undefined,
  };
}

export async function deleteAsset(publicId: string): Promise<void> {
  if (!isConfigured) return;
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
