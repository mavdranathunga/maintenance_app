import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReminderEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");
  const from = process.env.REMINDER_FROM_EMAIL || "onboarding@resend.dev";

  return resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
}
