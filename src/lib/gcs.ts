import { Storage } from "@google-cloud/storage";
import path from "path";

export const storage = new Storage({
  keyFilename: path.join(process.cwd(), "service-account.json"),
});

export const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET!);
