import { Resend } from 'resend';
import { createDevTransport } from './devMailer';
import nodemailer from "nodemailer";


// 1. Verify Email - Modern Professional Design
function getVerifyEmailHtml(verifyUrl: string): { subject: string, html: string } {
  return {
    subject: "Verify your email address",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Email</title>
      </head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;">
          <!-- Header with gradient -->
          <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 20px;text-align:center;">
            <div style="background:rgba(255,255,255,0.15);border-radius:50%;width:80px;height:80px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="9"/>
              </svg>
            </div>
            <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0;letter-spacing:-0.5px;">Verify Your Email</h1>
          </div>
          
          <!-- Content -->
          <div style="padding:40px 30px;">
            <p style="color:#374151;font-size:18px;line-height:1.6;margin:0 0 30px;text-align:center;">
              Thanks for signing up! Please verify your email address to complete your account setup and unlock all features.
            </p>
            
            <!-- CTA Button -->
            <div style="text-align:center;margin:40px 0;">
              <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:600;font-size:16px;letter-spacing:0.5px;box-shadow:0 4px 15px rgba(102,126,234,0.4);transition:all 0.3s ease;border:none;">
                Verify Email Address
              </a>
            </div>
            
            <!-- Alternative link -->
            <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:30px 0;">
              <p style="color:#6b7280;font-size:14px;margin:0 0 10px;font-weight:500;">Button not working?</p>
              <p style="color:#374151;font-size:14px;margin:0;word-break:break-all;">
                Copy and paste this link: <span style="color:#667eea;">${verifyUrl}</span>
              </p>
            </div>
            
            <!-- Security notice -->
            <div style="border-left:4px solid #10b981;background:#ecfdf5;padding:16px 20px;margin:30px 0;border-radius:0 8px 8px 0;">
              <p style="color:#047857;font-size:14px;margin:0;font-weight:500;">
                🔒 This link expires in 1 hour for security reasons.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af;font-size:14px;margin:0 0 10px;">
              If you didn't request this verification, you can safely ignore this email.
            </p>
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              © 2025 Your Company Name. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// 2. Reset Password - Modern Professional Design
function getResetPasswordEmailHtml(resetUrl: string): { subject: string, html: string } {
  return {
    subject: "Reset your password",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
      </head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);padding:40px 20px;text-align:center;">
            <div style="background:rgba(255,255,255,0.15);border-radius:50%;width:80px;height:80px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0;letter-spacing:-0.5px;">Reset Password</h1>
          </div>
          
          <!-- Content -->
          <div style="padding:40px 30px;">
            <p style="color:#374151;font-size:18px;line-height:1.6;margin:0 0 30px;text-align:center;">
              We received a request to reset your password. Click the button below to create a new secure password.
            </p>
            
            <!-- CTA Button -->
            <div style="text-align:center;margin:40px 0;">
              <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:600;font-size:16px;letter-spacing:0.5px;box-shadow:0 4px 15px rgba(240,147,251,0.4);transition:all 0.3s ease;border:none;">
                Reset My Password
              </a>
            </div>
            
            <!-- Alternative link -->
            <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:30px 0;">
              <p style="color:#6b7280;font-size:14px;margin:0 0 10px;font-weight:500;">Button not working?</p>
              <p style="color:#374151;font-size:14px;margin:0;word-break:break-all;">
                Copy and paste this link: <span style="color:#f5576c;">${resetUrl}</span>
              </p>
            </div>
            
            <!-- Security notice -->
            <div style="border-left:4px solid #ef4444;background:#fef2f2;padding:16px 20px;margin:30px 0;border-radius:0 8px 8px 0;">
              <p style="color:#dc2626;font-size:14px;margin:0 0 8px;font-weight:500;">
                ⚠️ Important Security Information
              </p>
              <p style="color:#7f1d1d;font-size:13px;margin:0;">
                This reset link expires in 15 minutes. If you didn't request this, please ignore this email and consider changing your password.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af;font-size:14px;margin:0 0 10px;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              © 2025 Your Company Name. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// 3. Welcome Email - Modern Professional Design
function getWelcomeEmailHtml(userName: string): { subject: string, html: string } {
  return {
    subject: `Welcome to the platform, ${userName}!`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome</title>
      </head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);padding:40px 20px;text-align:center;">
            <div style="background:rgba(255,255,255,0.15);border-radius:50%;width:80px;height:80px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
                <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/>
                <path d="M9 7v4"/>
                <path d="M13 7v4"/>
                <path d="M17 7l-8-4-8 4"/>
              </svg>
            </div>
            <h1 style="color:#ffffff;font-size:32px;font-weight:700;margin:0;letter-spacing:-0.5px;">Welcome, ${userName}!</h1>
          </div>
          
          <!-- Content -->
          <div style="padding:40px 30px;">
            <p style="color:#374151;font-size:18px;line-height:1.6;margin:0 0 30px;text-align:center;">
              We're thrilled to have you join our community! Your account is now ready, and you can start exploring all the amazing features we have to offer.
            </p>
            
            <!-- Feature highlights -->
            <div style="margin:40px 0;">
              <div style="display:flex;align-items:center;margin-bottom:20px;padding:15px;background:#f0f9ff;border-radius:8px;border-left:4px solid #0ea5e9;">
                <div style="color:#0ea5e9;margin-right:15px;">✨</div>
                <div>
                  <h3 style="color:#1e293b;font-size:16px;font-weight:600;margin:0 0 5px;">Full Access Unlocked</h3>
                  <p style="color:#64748b;font-size:14px;margin:0;">Access all premium features and tools</p>
                </div>
              </div>
              
              <div style="display:flex;align-items:center;margin-bottom:20px;padding:15px;background:#f0fdf4;border-radius:8px;border-left:4px solid #22c55e;">
                <div style="color:#22c55e;margin-right:15px;">🚀</div>
                <div>
                  <h3 style="color:#1e293b;font-size:16px;font-weight:600;margin:0 0 5px;">Quick Start Guide</h3>
                  <p style="color:#64748b;font-size:14px;margin:0;">Get up and running in just a few minutes</p>
                </div>
              </div>
              
              <div style="display:flex;align-items:center;padding:15px;background:#fefce8;border-radius:8px;border-left:4px solid #eab308;">
                <div style="color:#eab308;margin-right:15px;">💬</div>
                <div>
                  <h3 style="color:#1e293b;font-size:16px;font-weight:600;margin:0 0 5px;">24/7 Support</h3>
                  <p style="color:#64748b;font-size:14px;margin:0;">Our team is here to help whenever you need</p>
                </div>
              </div>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align:center;margin:40px 0;">
              <a href="https://yourapp.com/dashboard" style="display:inline-block;background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:600;font-size:16px;letter-spacing:0.5px;box-shadow:0 4px 15px rgba(79,172,254,0.4);transition:all 0.3s ease;border:none;">
                Go to Dashboard
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af;font-size:14px;margin:0 0 15px;">
              Need help getting started? <a href="https://yourapp.com/help" style="color:#4facfe;text-decoration:none;">Visit our Help Center</a>
            </p>
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              © 2025 Your Company Name. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

const resend = new Resend(process.env.RESEND_API_KEY!);

export const templates = {
  VerifyEmail: getVerifyEmailHtml,
  ResetPassword: getResetPasswordEmailHtml,
  Welcome: getWelcomeEmailHtml,
};

export type TemplateType = keyof typeof templates;

interface SendEmailParams {
  template: TemplateType;
  to: string;
  params: any;
  from?: string;
}
