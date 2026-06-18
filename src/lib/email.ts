// ─── Email sending via Resend ─────────────────────────────────────────────────
//
// If RESEND_API_KEY is not set, all sends are no-ops and log a warning.
// This lets the admin panel work without email configured.

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM_EMAIL ?? "SCOPE <noreply@thesighteproject.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://creative-ops-os.vercel.app";

function getClient(): Resend | null {
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — email send skipped");
    return null;
  }
  return new Resend(apiKey);
}

// ─── Shared HTML shell ────────────────────────────────────────────────────────

function emailShell(body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SCOPE</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:11px;font-weight:900;letter-spacing:0.2em;color:rgba(255,255,255,0.25);text-transform:uppercase;">SCOPE</p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:36px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.15);text-align:center;letter-spacing:0.15em;text-transform:uppercase;">
                © 2026 The Sighte Project · SCOPE
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const buttonStyle =
  "display:inline-block;background:#7C3AED;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:14px 28px;border-radius:10px;letter-spacing:0.02em;";

const h1Style =
  "margin:0 0 8px;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.02em;";

const bodyStyle =
  "margin:0 0 20px;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.55);";

const pillStyle =
  "display:inline-block;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);";

const dividerStyle =
  "border:none;border-top:1px solid rgba(255,255,255,0.07);margin:24px 0;";

// ─── Workspace invite email ───────────────────────────────────────────────────

export type WorkspaceInviteEmailArgs = {
  to: string;
  inviterName: string;
  workspaceName: string;
  clientName?: string;
  role: string;
  inviteUrl: string;
};

export async function sendWorkspaceInviteEmail(args: WorkspaceInviteEmailArgs) {
  const client = getClient();
  if (!client) return;

  const roleDisplay = args.role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const workspaceLabel = args.clientName
    ? `${args.clientName} — ${args.workspaceName}`
    : args.workspaceName;

  const html = emailShell(`
    <h1 style="${h1Style}">You've been invited to SCOPE</h1>
    <p style="${bodyStyle}">
      <strong style="color:rgba(255,255,255,0.85);">${args.inviterName}</strong>
      has invited you to join the <strong style="color:rgba(255,255,255,0.85);">${workspaceLabel}</strong> workspace on SCOPE.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="padding-right:12px;">
          <p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Workspace</p>
          <span style="${pillStyle}">${workspaceLabel}</span>
        </td>
        <td>
          <p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Role</p>
          <span style="${pillStyle}">${roleDisplay}</span>
        </td>
      </tr>
    </table>

    <hr style="${dividerStyle}" />

    <p style="${bodyStyle}">
      SCOPE is the creative operations platform for managing artist projects, content pipelines,
      approvals, releases, and team collaboration — all in one place.
    </p>

    <p style="margin:0 0 28px;">
      <a href="${args.inviteUrl}" style="${buttonStyle}">Accept Invitation →</a>
    </p>

    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">
      This invite expires in 7 days. If you weren't expecting this, you can safely ignore it.
    </p>
  `);

  await client.emails.send({
    from: FROM,
    to: args.to,
    subject: "You've been invited to SCOPE",
    html,
  });
}

// ─── Platform Partner grant email ─────────────────────────────────────────────

export type PlatformPartnerEmailArgs = {
  to: string;
  inviterName: string;
};

export async function sendPlatformPartnerEmail(args: PlatformPartnerEmailArgs) {
  const client = getClient();
  if (!client) return;

  const signInUrl = `${APP_URL}/sign-in`;

  const html = emailShell(`
    <h1 style="${h1Style}">You're now a Platform Partner on SCOPE</h1>
    <p style="${bodyStyle}">
      <strong style="color:rgba(255,255,255,0.85);">${args.inviterName}</strong>
      has granted you Platform Partner access to SCOPE.
    </p>

    <hr style="${dividerStyle}" />

    <p style="${bodyStyle}">As a Platform Partner, you can:</p>
    <ul style="margin:0 0 24px;padding-left:20px;color:rgba(255,255,255,0.55);font-size:14px;line-height:2;">
      <li>Access the full Command Center across all clients</li>
      <li>View and enter any workspace</li>
      <li>Manage client settings, teams, and workspaces</li>
      <li>View all team members and pending invites</li>
    </ul>

    <p style="margin:0 0 28px;">
      <a href="${signInUrl}" style="${buttonStyle}">Sign In to SCOPE →</a>
    </p>

    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">
      SCOPE is the creative operations platform by The Sighte Project.
    </p>
  `);

  await client.emails.send({
    from: FROM,
    to: args.to,
    subject: "You're now a Platform Partner on SCOPE",
    html,
  });
}
