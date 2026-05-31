import { storage } from "../lib/gcs";

const bucketName = process.env.GOOGLE_STORAGE_BUCKET!;

async function main() {
  const bucket = storage.bucket(bucketName);
  const [policy] = await bucket.iam.getPolicy({ requestedPolicyVersion: 3 });

  policy.bindings = policy.bindings ?? [];

  const existing = policy.bindings.find(
    (b) => b.role === "roles/storage.objectViewer",
  );

  if (existing) {
    if (!existing.members.includes("allUsers")) {
      existing.members.push("allUsers");
    }
  } else {
    policy.bindings.push({
      role: "roles/storage.objectViewer",
      members: ["allUsers"],
    });
  }

  await bucket.iam.setPolicy(policy);
  console.log(`✓ allUsers granted roles/storage.objectViewer on gs://${bucketName}`);
}

main().catch((err) => {
  console.error("Failed to set public access:", err.message);
  process.exit(1);
});
