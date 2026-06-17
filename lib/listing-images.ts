import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

const MAX_FILES = 8;
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);

function isServerlessEnv() {
  return (
    process.env.VERCEL === "1" ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    Boolean(process.env.VERCEL_ENV)
  );
}

function extForType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export function collectListingImageFiles(formData: FormData): File[] {
  const files: File[] = [];
  for (const entry of formData.getAll("images")) {
    if (entry instanceof File && entry.size > 0 && entry.type.startsWith("image/")) {
      files.push(entry);
    }
  }
  return files.slice(0, MAX_FILES);
}

export async function uploadListingImages(files: File[], slug: string): Promise<string[]> {
  if (files.length === 0) return [];

  const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  if (!useBlob && isServerlessEnv()) {
    throw new Error(
      "Fotoğraf yükleme canlıda henüz yapılandırılmadı. İlanı fotoğrafsız gönderebilir veya yönetici Vercel Blob ayarını tamamlayana kadar bekleyebilirsiniz.",
    );
  }

  const urls: string[] = [];

  for (const [index, file] of files.entries()) {
    if (!ALLOWED_TYPES.has(file.type)) {
      throw new Error("Sadece JPG, PNG veya WebP yükleyebilirsiniz.");
    }
    if (file.size > MAX_BYTES) {
      throw new Error("Her fotoğraf en fazla 5 MB olabilir.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = extForType(file.type);
    const filename = `${slug}-${index + 1}-${Date.now()}.${ext}`;

    if (useBlob) {
      const blob = await put(`listings/${filename}`, buffer, {
        access: "public",
        contentType: file.type,
      });
      urls.push(blob.url);
    } else {
      const dir = path.join(process.cwd(), "public", "uploads", "listings");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, filename), buffer);
      urls.push(`/uploads/listings/${filename}`);
    }
  }

  return urls;
}
