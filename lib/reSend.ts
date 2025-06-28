import { Resend } from 'resend';
// 1. Verify Email
function getVerifyEmailHtml(verifyUrl: string): { subject: string, html: string } {
    return {
        subject: "Verify your email address",
        html: `
      <div style="background:#fbfaf9;color:#3d3d3d;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif;border-radius:8px;max-width:420px;margin:32px auto;box-shadow:0 1px 3px 0px rgba(0,0,0,0.05);padding:32px 24px;border:1px solid #e0e0e0;">
        <div style="text-align:center;">
          <h2 style="font-size:1.25rem;font-weight:700;color:#5b51d8;margin-bottom:12px;letter-spacing:-0.01em;">
            Verify your email
          </h2>
          <p style="font-size:1rem;color:#3d3d3d;margin-bottom:24px;margin-top:0;">
            Please confirm your email address to get started.
          </p>
          <a href="${verifyUrl}" style="display:inline-block;background:#5b51d8;color:#fff;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:6px;box-shadow:0 1px 3px 0px rgba(0,0,0,0.07);margin-bottom:24px;font-size:1rem;letter-spacing:0.03em;">
            Verify Email
          </a>
          <p style="color:#888;font-size:0.95rem;margin-top:24px;">
            If you did not request this email, you can safely ignore it.
          </p>
        </div>
      </div>
    `
    }
}

// 2. Reset Password
function getResetPasswordEmailHtml(resetUrl: string): { subject: string, html: string } {
    return {
        subject: "Reset your password",
        html: `
      <div style="background:#fbfaf9;color:#3d3d3d;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif;border-radius:8px;max-width:420px;margin:32px auto;box-shadow:0 1px 3px 0px rgba(0,0,0,0.05);padding:32px 24px;border:1px solid #e0e0e0;">
        <div style="text-align:center;">
          <h2 style="font-size:1.25rem;font-weight:700;color:#f9825f;margin-bottom:12px;letter-spacing:-0.01em;">
            Reset your password
          </h2>
          <p style="font-size:1rem;color:#3d3d3d;margin-bottom:24px;margin-top:0;">
            Need to set a new password? Click below to securely reset it.
          </p>
          <a href="${resetUrl}" style="display:inline-block;background:#f9825f;color:#fff;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:6px;box-shadow:0 1px 3px 0px rgba(0,0,0,0.07);margin-bottom:24px;font-size:1rem;letter-spacing:0.03em;">
            Reset Password
          </a>
          <p style="color:#888;font-size:0.95rem;margin-top:24px;">
            If you did not request this, you can ignore this email.
          </p>
        </div>
      </div>
    `
    }
}

// 3. Welcome Email (Minimal Style)
function getWelcomeEmailHtml(userName: string): { subject: string, html: string } {
    return {
        subject: "Welcome to the platform!",
        html: `
      <div style="background:#fbfaf9;color:#3d3d3d;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif;border-radius:8px;max-width:420px;margin:32px auto;box-shadow:0 1px 3px 0px rgba(0,0,0,0.05);padding:32px 24px;border:1px solid #e0e0e0;">
        <div style="text-align:center;">
          <h2 style="font-size:1.25rem;font-weight:700;color:#32c7a7;margin-bottom:12px;letter-spacing:-0.01em;">
            Welcome, ${userName}!
          </h2>
          <p style="font-size:1rem;color:#3d3d3d;margin-bottom:24px;margin-top:0;">
            We're excited to have you on board. Start exploring and enjoy all the features!
          </p>
          <a href="https://yourapp.com" style="display:inline-block;background:#32c7a7;color:#fff;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:6px;box-shadow:0 1px 3px 0px rgba(0,0,0,0.07);margin-bottom:24px;font-size:1rem;letter-spacing:0.03em;">
            Go to Dashboard
          </a>
        </div>
      </div>
    `
    }
}

// 4. Welcome Email (Variant: Fun, Accent Color)
function getWelcomeAltEmailHtml(userName: string): { subject: string, html: string } {
    return {
        subject: "You’re In! Welcome 🎉",
        html: `
      <div style="background:#f5f7ff;color:#4b5563;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif;border-radius:8px;max-width:420px;margin:32px auto;box-shadow:0 4px 16px 0px rgba(91,81,216,0.08);padding:32px 24px;border:1px solid #d6d9e4;">
        <div style="text-align:center;">
          <h2 style="font-size:1.5rem;font-weight:700;color:#5b51d8;margin-bottom:12px;letter-spacing:-0.01em;">
            Welcome to the community, ${userName}!
          </h2>
          <p style="font-size:1.1rem;color:#6366f1;margin-bottom:24px;margin-top:0;">
            You’re officially a member. Here’s to new beginnings!
          </p>
          <a href="https://yourapp.com" style="display:inline-block;background:#6366f1;color:#fff;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:8px;box-shadow:0 2px 8px 0px rgba(91,81,216,0.13);margin-bottom:24px;font-size:1.05rem;letter-spacing:0.03em;">
            Get Started
          </a>
        </div>
      </div>
    `
    }
}


const resend = new Resend(process.env.RESEND_API_KEY);

const templates = {
    VerifyEmail: getVerifyEmailHtml,
    ResetPassword: getResetPasswordEmailHtml,
    Welcome: getWelcomeEmailHtml,
    WelcomeAlt: getWelcomeAltEmailHtml,
};
type TemplateType = keyof typeof templates;
interface SendEmailParams {
    template: TemplateType;
    to: string;
    params: any; // The object expected by the template function (verifyUrl, resetUrl, userName, etc.)
    from?: string; // Optional override, else default
}

export async function SendEmail({ template, to, params, from = "onboarding@resend.dev" }: SendEmailParams) {
    try {
        // Pick the correct template function:
        const getTemplate = templates[template];
        // Compose subject & html from template:
        const { subject, html } = getTemplate(params);

       return resend.emails.send({ from, to, subject, html });


    } catch (error) {
        console.log(error);
         throw Error("Email sending failed");
    }
}