import { Storage } from "@google-cloud/storage";
import path from "path";

export const storage = new Storage({
  keyFilename: path.join(process.cwd(), "service-account.json"),
});

// Lazily resolved so the bucket name env var isn't required at build time
export function getBucket() {
  const name = process.env.GOOGLE_STORAGE_BUCKET;
  if (!name) throw new Error("GOOGLE_STORAGE_BUCKET env var is not set");
  return storage.bucket(name);
}
