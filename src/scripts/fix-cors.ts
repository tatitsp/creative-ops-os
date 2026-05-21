import { storage } from "../lib/gcs";

const bucketName = process.env.GOOGLE_STORAGE_BUCKET!;

const corsConfig = [
  {
    origin: ["http://localhost:3003"],
    method: ["PUT", "GET", "HEAD"],
    responseHeader: ["Content-Type", "Content-Length"],
    maxAgeSeconds: 3600,
  },
];

async function main() {
  const bucket = storage.bucket(bucketName);
  await bucket.setCorsConfiguration(corsConfig);
  console.log(`✓ CORS policy set on gs://${bucketName}`);
  console.log(JSON.stringify(corsConfig, null, 2));
}

main().catch((err) => {
  console.error("Failed to set CORS:", err.message);
  process.exit(1);
});
