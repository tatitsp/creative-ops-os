// Admin email check — single source of truth.
// Access is granted ONLY when the logged-in email matches exactly.
// Never derive admin from name, domain, or DB flag.

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const raw = process.env.ADMIN_EMAILS ?? "";
  const adminEmails = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}
