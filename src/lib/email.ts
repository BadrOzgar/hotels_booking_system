import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends the password-reset OTP email. Uses Resend's shared `onboarding@resend.dev` sender since
 * no custom domain is verified yet — in Resend's default (unverified-domain) mode this can only
 * deliver to the email address the Resend account itself was signed up with. Verify a domain in
 * the Resend dashboard to send to arbitrary recipients.
 */
export async function sendPasswordResetOtpEmail(to: string, code: string): Promise<void> {
  await resend.emails.send({
    from: "Meridian <onboarding@resend.dev>",
    to,
    subject: "Your Meridian password reset code",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:420px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px">Reset your password</h2>
        <p style="color:#4B5563;line-height:1.6">
          Use this code to reset your Meridian account password. It expires in 10 minutes.
        </p>
        <div style="margin:20px 0;padding:16px;background:#F3F5FF;border-radius:12px;text-align:center">
          <span style="font-size:28px;font-weight:700;letter-spacing:6px;color:#4A5AE0">${code}</span>
        </div>
        <p style="color:#9CA3AF;font-size:13px">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
