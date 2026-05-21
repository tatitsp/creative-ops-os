import { Storage } from "@google-cloud/storage";

// Newlines in the private key are escaped as \n in the env var
const privateKey = process.env.GOOGLE_STORAGE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const storage = new Storage({
  projectId: process.env.GOOGLE_STORAGE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_STORAGE_CLIENT_EMAIL,
    private_key: privateKey,
  },
});

export const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET!);
