"use server";

import { templates } from "@/lib/reSend";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailTemplate = "VerifyEmail" | "ResetPassword" | "Welcome";

interface SendEmailInput {
  templateText: EmailTemplate;
  to: string;
  params: Record<string, any>;
}

export async function sendEmail(input: SendEmailInput) {
  const { templateText, to, params } = input;

  try {
    // Here you can generate your subject and HTML using your templates
    const { subject, html } = generateTemplate(templateText, params);

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    return { success: true, response };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: "Email sending failed" };
  }
}

/**
 * Example template generator function.
 * Replace with your actual template logic.
 */
function generateTemplate( templateText: EmailTemplate, params: Record<string, any>) {
  return templates[templateText](params as any);
}
