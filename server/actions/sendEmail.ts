"use server";

import { generateTemplate, TemplateParamMap, TemplateType } from "@/lib/reSend";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


interface SendEmailInput {
  templateText: TemplateType;
  to: string;
  params: TemplateParamMap[TemplateType];
}

export async function sendEmail(input: SendEmailInput) {
  const { templateText, to, params } = input;

  try {
    // Here you can generate your subject and HTML using your templates
    const { subject, html } = generateTemplate(templateText, { ...params });

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

