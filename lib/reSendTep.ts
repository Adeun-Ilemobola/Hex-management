

// 1. Verify Email - Modern Professional Design
function getVerifyEmailHtml(verifyUrl: string): { subject: string, html: string } {
  return {
    subject: "Verify your email address",
    html: `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Verify Email</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    
    /* Dark Mode Overrides */
    @media (prefers-color-scheme: dark) {
      .body-bg {
        background: #0f172a !important;
        background-image: linear-gradient(135deg, #0f172a 0%, #312e81 100%) !important;
      }
      .glass-card {
        background-color: #1e293b !important; /* Outlook Fallback */
        background: rgba(30, 41, 59, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5) !important;
      }
      .inner-glass {
        background-color: #334155 !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
      }
      .text-primary {
        color: #e2e8f0 !important;
      }
      .text-secondary {
        color: #94a3b8 !important;
      }
      .text-accent {
        color: #d8b4fe !important;
      }
      .footer-text {
        color: #64748b !important;
      }
      .icon-circle {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .security-box {
        background: rgba(6, 78, 59, 0.3) !important;
        border-left-color: #34d399 !important;
      }
      .security-text {
        color: #34d399 !important;
      }
    }
  </style>
</head>
<body class="body-bg" style="margin:0;padding:0;word-spacing:normal;background-color:#eff6ff;background-image:linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%);-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        
        <table role="presentation" class="glass-card" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:600px;width:100%;margin:0 auto;background-color:#ffffff;background:rgba(255, 255, 255, 0.65);border:1px solid rgba(255, 255, 255, 0.6);border-radius:16px;box-shadow:0 8px 32px 0 rgba(31, 38, 135, 0.15);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);">
          
          <tr>
            <td align="center" style="padding:40px 40px 20px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td class="icon-circle" width="80" height="80" align="center" valign="middle" style="background:rgba(37, 99, 235, 0.1);border-radius:50%;border:1px solid rgba(255, 255, 255, 0.4);">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </td>
                </tr>
              </table>
              <h1 class="text-primary" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:28px;font-weight:700;letter-spacing:-0.5px;color:#1e293b;">
                Verify your email
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 40px 40px;">
              <p class="text-secondary" style="margin:0 0 32px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#475569;text-align:center;">
                Thanks for signing up! We're excited to have you on board. Please verify your email address to unlock your full experience.
              </p>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg, #2563eb 0%, #9333ea 100%);color:#ffffff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;text-decoration:none;padding:16px 36px;border-radius:12px;box-shadow:0 4px 15px rgba(37, 99, 235, 0.3);text-shadow:0 1px 2px rgba(0,0,0,0.1);border:1px solid rgba(255,255,255,0.2);">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:40px;">
                <tr>
                  <td class="inner-glass" style="background-color:#f8fafc;background:rgba(255, 255, 255, 0.5);border:1px solid rgba(255, 255, 255, 0.6);border-radius:8px;padding:20px;">
                    <p class="text-secondary" style="margin:0 0 8px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">
                      Button not working?
                    </p>
                    <p class="text-secondary" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#475569;word-break:break-all;">
                      Copy this link: <span class="text-accent" style="color:#2563eb;font-weight:500;">${verifyUrl}</span>
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                <tr>
                  <td class="security-box" style="background-color:#ecfdf5;border-left:4px solid #10b981;border-radius:4px;padding:16px;">
                    <p class="security-text" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#047857;font-weight:500;">
                      🔒 This link expires in 1 hour.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 30px 40px;border-top:1px solid rgba(0,0,0,0.05);">
              <p class="footer-text" style="margin:20px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#94a3b8;">
                If you didn't request this verification, simply ignore this email.
              </p>
              <p class="footer-text" style="margin:8px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#94a3b8;">
                © 2025 Your Company Name. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
        
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" height="40"><tr><td>&nbsp;</td></tr></table>
        
      </td>
    </tr>
  </table>
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
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Reset Password</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    /* Dark Mode Overrides */
    @media (prefers-color-scheme: dark) {
      .body-bg {
        background: #0f172a !important;
        background-image: linear-gradient(135deg, #0f172a 0%, #312e81 100%) !important;
      }
      .glass-card {
        background-color: #1e293b !important; /* Fallback */
        background: rgba(15, 23, 42, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5) !important;
      }
      .text-primary {
        color: #f1f5f9 !important;
      }
      .text-secondary {
        color: #cbd5e1 !important;
      }
      .text-highlight {
        color: #d8b4fe !important; /* Primary Dark Token */
      }
      .link-text {
        color: #f472b6 !important; /* Highlight Dark Token */
      }
      .icon-circle {
        background: rgba(255, 255, 255, 0.08) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
      }
      .inner-glass-box {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
      }
      .security-box {
        background: rgba(127, 29, 29, 0.4) !important;
        border-left: 4px solid #f87171 !important;
      }
      .security-text {
        color: #fca5a5 !important;
      }
      .footer-text {
        color: #64748b !important;
      }
    }
  </style>
</head>
<body class="body-bg" style="margin:0;padding:0;word-spacing:normal;background-color:#eff6ff;background-image:linear-gradient(135deg, #dbeafe 0%, #fae8ff 100%);-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        
        <table role="presentation" class="glass-card" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:600px;width:100%;margin:0 auto;background-color:#ffffff;background:rgba(255, 255, 255, 0.7);border:1px solid rgba(255, 255, 255, 0.8);border-radius:16px;box-shadow:0 8px 32px 0 rgba(31, 38, 135, 0.1);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);">
          
          <tr>
            <td align="center" style="padding:45px 40px 20px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td class="icon-circle" width="80" height="80" align="center" valign="middle" style="background:rgba(37, 99, 235, 0.1);border-radius:50%;border:1px solid rgba(255, 255, 255, 0.5);box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor"></path>
                    </svg>
                  </td>
                </tr>
              </table>
              <h1 class="text-primary" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:28px;font-weight:700;letter-spacing:-0.5px;color:#1e293b;">
                Reset Password
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 40px 40px;">
              <p class="text-secondary" style="margin:0 0 32px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#475569;text-align:center;">
                We received a request to reset your password. Click the button below to create a new secure password.
              </p>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg, #2563eb 0%, #9333ea 100%);color:#ffffff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;text-decoration:none;padding:16px 36px;border-radius:12px;box-shadow:0 4px 15px rgba(37, 99, 235, 0.35);text-shadow:0 1px 2px rgba(0,0,0,0.1);border:1px solid rgba(255,255,255,0.2);">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:40px;">
                <tr>
                  <td class="inner-glass-box" style="background-color:#f8fafc;background:rgba(255, 255, 255, 0.5);border:1px solid rgba(255, 255, 255, 0.6);border-radius:8px;padding:20px;">
                    <p class="text-secondary" style="margin:0 0 8px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">
                      Button not working?
                    </p>
                    <p class="text-secondary" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#475569;word-break:break-all;">
                      Copy this link: <span class="link-text" style="color:#db2777;font-weight:500;">${resetUrl}</span>
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                <tr>
                  <td class="security-box" style="background-color:#fef2f2;border-left:4px solid #ef4444;border-radius:4px;padding:16px;">
                    <p class="security-text" style="margin:0 0 4px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#b91c1c;font-weight:600;">
                      ⚠️ Important Security Information
                    </p>
                    <p class="security-text" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#b91c1c;line-height:1.4;">
                      This reset link expires in 15 minutes. If you didn't request this, please ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 30px 40px;border-top:1px solid rgba(0,0,0,0.05);">
              <p class="footer-text" style="margin:20px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#94a3b8;">
                If you didn't request a password reset, you can safely ignore this email.
              </p>
              <p class="footer-text" style="margin:8px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#94a3b8;">
                © 2025 Your Company Name. All rights reserved.
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" height="40"><tr><td>&nbsp;</td></tr></table>
        
      </td>
    </tr>
  </table>
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
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Welcome</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    /* Dark Mode Overrides */
    @media (prefers-color-scheme: dark) {
      .body-bg {
        background: #0f172a !important;
        background-image: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%) !important;
      }
      .glass-card {
        background-color: #1e293b !important; /* Outlook Fallback */
        background: rgba(30, 41, 59, 0.6) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5) !important;
      }
      .text-heading {
        color: #f1f5f9 !important;
      }
      .text-body {
        color: #cbd5e1 !important;
      }
      .feature-card {
        background-color: #334155 !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
      }
      .feature-title {
        color: #e2e8f0 !important;
      }
      .feature-desc {
        color: #94a3b8 !important;
      }
      .icon-circle {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .footer-text {
        color: #64748b !important;
      }
      .link-text {
        color: #d8b4fe !important;
      }
    }
  </style>
</head>
<body class="body-bg" style="margin:0;padding:0;word-spacing:normal;background-color:#eff6ff;background-image:linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%);-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        
        <table role="presentation" class="glass-card" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:600px;width:100%;margin:0 auto;background-color:#ffffff;background:rgba(255, 255, 255, 0.65);border:1px solid rgba(255, 255, 255, 0.8);border-radius:16px;box-shadow:0 8px 32px 0 rgba(31, 38, 135, 0.15);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);">
          
          <tr>
            <td align="center" style="padding:45px 40px 20px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td class="icon-circle" width="80" height="80" align="center" valign="middle" style="background:rgba(37, 99, 235, 0.1);border-radius:50%;border:1px solid rgba(255, 255, 255, 0.5);box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                       <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                       <path d="M2 17l10 5 10-5"/>
                       <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </td>
                </tr>
              </table>
              <h1 class="text-heading" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:32px;font-weight:700;letter-spacing:-0.5px;color:#1e293b;">
                Welcome, ${userName}!
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 10px 40px;">
              <p class="text-body" style="margin:0 0 30px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;line-height:1.6;color:#475569;text-align:center;">
                We're thrilled to have you join our community! Your account is ready. Here is a quick overview of what awaits you.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 20px 40px;">
              
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td class="feature-card" bgcolor="#f0f9ff" style="padding:16px;border-radius:12px;background-color:#f0f9ff;background:rgba(255, 255, 255, 0.4);border:1px solid rgba(255, 255, 255, 0.6);">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="40" valign="top" style="font-size:24px;line-height:1;">✨</td>
                        <td>
                          <h3 class="feature-title" style="margin:0 0 4px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;color:#1e293b;">Full Access Unlocked</h3>
                          <p class="feature-desc" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#64748b;">Access all premium features and tools immediately.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td class="feature-card" bgcolor="#f0fdf4" style="padding:16px;border-radius:12px;background-color:#f0fdf4;background:rgba(255, 255, 255, 0.4);border:1px solid rgba(255, 255, 255, 0.6);">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="40" valign="top" style="font-size:24px;line-height:1;">🚀</td>
                        <td>
                          <h3 class="feature-title" style="margin:0 0 4px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;color:#1e293b;">Quick Start Guide</h3>
                          <p class="feature-desc" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#64748b;">Get up and running in just a few minutes.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td class="feature-card" bgcolor="#fefce8" style="padding:16px;border-radius:12px;background-color:#fefce8;background:rgba(255, 255, 255, 0.4);border:1px solid rgba(255, 255, 255, 0.6);">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="40" valign="top" style="font-size:24px;line-height:1;">💬</td>
                        <td>
                          <h3 class="feature-title" style="margin:0 0 4px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;color:#1e293b;">24/7 Support</h3>
                          <p class="feature-desc" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#64748b;">Our team is here to help whenever you need.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px 40px 40px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://yourapp.com/dashboard" style="display:inline-block;background:linear-gradient(135deg, #2563eb 0%, #9333ea 100%);color:#ffffff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;text-decoration:none;padding:16px 36px;border-radius:12px;box-shadow:0 4px 15px rgba(37, 99, 235, 0.35);text-shadow:0 1px 2px rgba(0,0,0,0.1);border:1px solid rgba(255,255,255,0.2);">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 30px 40px;border-top:1px solid rgba(0,0,0,0.05);">
              <p class="footer-text" style="margin:20px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#9ca3af;">
                Need help getting started? <a href="https://yourapp.com/help" class="link-text" style="color:#2563eb;text-decoration:none;font-weight:500;">Visit our Help Center</a>
              </p>
              <p class="footer-text" style="margin:10px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#9ca3af;">
                © 2025 Your Company Name. All rights reserved.
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" height="40"><tr><td>&nbsp;</td></tr></table>
        
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }
}
function VerifyExternalInvestor(
  name: string,
  email: string,
  contributionPercent: number,
  propertyName: string,
  DollarValueReturn: number,
  propertyLink: string,
  verificationLink: string,
  accessCode: string
): { subject: string; html: string } {
  return {
    subject: "🔐 Investor Verification Required - Action Needed",
    html: `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Investor Verification</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    
    /* Dark Mode Overrides */
    @media (prefers-color-scheme: dark) {
      .body-bg {
        background: #0f172a !important;
        background-image: linear-gradient(135deg, #0f172a 0%, #312e81 100%) !important;
      }
      .glass-card {
        background-color: #1e293b !important; /* Outlook Fallback */
        background: rgba(30, 41, 59, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5) !important;
      }
      .inner-glass {
        background-color: #334155 !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
      }
      .access-box {
        background: rgba(216, 180, 254, 0.1) !important; /* Dark Primary Tint */
        border: 1px dashed rgba(216, 180, 254, 0.3) !important;
      }
      .text-primary {
        color: #f1f5f9 !important;
      }
      .text-secondary {
        color: #94a3b8 !important;
      }
      .text-label {
        color: #cbd5e1 !important;
      }
      .text-value {
        color: #f8fafc !important;
      }
      .text-accent {
        color: #d8b4fe !important;
      }
      .text-highlight {
        color: #f472b6 !important;
      }
      .icon-circle {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .divider {
        border-color: rgba(255, 255, 255, 0.1) !important;
      }
    }
  </style>
</head>
<body class="body-bg" style="margin:0;padding:0;word-spacing:normal;background-color:#f0f9ff;background-image:linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%);-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        
        <table role="presentation" class="glass-card" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:640px;width:100%;margin:0 auto;background-color:#ffffff;background:rgba(255, 255, 255, 0.65);border:1px solid rgba(255, 255, 255, 0.6);border-radius:24px;box-shadow:0 8px 32px 0 rgba(31, 38, 135, 0.15);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);">
          
          <tr>
            <td align="center" style="padding:40px 40px 20px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td class="icon-circle" width="80" height="80" align="center" valign="middle" style="background:rgba(37, 99, 235, 0.1);border-radius:50%;border:1px solid rgba(255, 255, 255, 0.5);box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </td>
                </tr>
              </table>
              <h1 class="text-primary" style="margin:0 0 10px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:-0.5px;color:#1e293b;">
                Investor Verification
              </h1>
              <p class="text-secondary" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;color:#64748b;font-weight:500;">
                Confirm your participation in this opportunity
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 30px 40px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="access-box" style="padding:24px;background:rgba(37, 99, 235, 0.05);border:1px dashed rgba(37, 99, 235, 0.2);border-radius:16px;text-align:center;">
                    <p class="text-secondary" style="margin:0 0 12px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:1px;">
                      Your Access Code
                    </p>
                    <div class="text-accent" style="font-family:'Courier New', monospace;font-size:32px;font-weight:700;letter-spacing:4px;color:#2563eb;">
                      ${accessCode}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 20px 40px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="inner-glass" style="padding:24px;border-radius:16px;background-color:#f8fafc;background:rgba(255, 255, 255, 0.4);border:1px solid rgba(255, 255, 255, 0.6);">
                    
                    <h3 class="text-primary" style="margin:0 0 16px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#1e293b;">📋 Investor Information</h3>
                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="30%" class="text-label" style="padding-bottom:8px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#64748b;">Name:</td>
                        <td width="70%" class="text-value" style="padding-bottom:8px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#334155;">${name}</td>
                      </tr>
                      <tr>
                        <td width="30%" class="text-label" style="padding-bottom:8px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#64748b;">Email:</td>
                        <td width="70%" class="text-value" style="padding-bottom:8px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#334155;">${email}</td>
                      </tr>
                    </table>

                    <div class="divider" style="height:1px;background-color:rgba(0,0,0,0.05);border-bottom:1px solid rgba(255,255,255,0.5);margin:16px 0;"></div>

                    <h3 class="text-primary" style="margin:0 0 8px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#1e293b;">🏢 ${propertyName}</h3>
                     <a href="${propertyLink}" class="text-accent" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#2563eb;text-decoration:none;font-weight:500;">
                       View Property Details &rarr;
                     </a>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 30px 40px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" valign="top" style="padding-right:8px;">
                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                       <tr>
                         <td class="inner-glass" align="center" style="padding:20px;border-radius:16px;background-color:#f8fafc;background:rgba(255, 255, 255, 0.4);border:1px solid rgba(255, 255, 255, 0.6);">
                           <p class="text-label" style="margin:0 0 8px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;text-transform:uppercase;color:#64748b;">Contribution</p>
                           <p class="text-highlight" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:#db2777;">${contributionPercent}%</p>
                         </td>
                       </tr>
                    </table>
                  </td>
                  <td width="48%" valign="top" style="padding-left:8px;">
                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                       <tr>
                         <td class="inner-glass" align="center" style="padding:20px;border-radius:16px;background-color:#f8fafc;background:rgba(255, 255, 255, 0.4);border:1px solid rgba(255, 255, 255, 0.6);">
                           <p class="text-label" style="margin:0 0 8px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;text-transform:uppercase;color:#64748b;">Value</p>
                           <p class="text-highlight" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:#db2777;">$${DollarValueReturn.toLocaleString()}</p>
                         </td>
                       </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 40px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${verificationLink}" style="display:inline-block;background:linear-gradient(135deg, #2563eb 0%, #9333ea 100%);color:#ffffff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;font-weight:600;text-decoration:none;padding:18px 40px;border-radius:50px;box-shadow:0 4px 15px rgba(37, 99, 235, 0.35);text-shadow:0 1px 2px rgba(0,0,0,0.1);border:1px solid rgba(255,255,255,0.2);">
                      🚀 Start Verification Process
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
             <td style="padding:0 40px 30px 40px;">
                <p class="text-label" style="margin:0 0 8px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;color:#475569;">Verification Steps:</p>
                <p class="text-secondary" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#64748b;">
                  1. Click the button above<br>
                  2. Enter access code: <strong>${accessCode}</strong><br>
                  3. Confirm details
                </p>
             </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 30px 40px;border-top:1px solid rgba(0,0,0,0.05);">
              <p class="text-secondary" style="margin:20px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#94a3b8;">
                This verification is required to complete your investment participation.
              </p>
              <p class="text-secondary" style="margin:8px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#94a3b8;">
                © 2025 Investment Platform. All rights reserved.
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" height="40"><tr><td>&nbsp;</td></tr></table>
        
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };
}

function onboardingFinish(
  name: string,
  email: string,
  organizationName: string,
  fallbackUrl: string,
  userExists: boolean
): { subject: string; html: string } {
  return {
    subject: "🚀 Welcome to Your New Fintech Journey",
    html: `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Welcome Aboard</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    /* Dark Mode Overrides */
    @media (prefers-color-scheme: dark) {
      .body-bg {
        background: #0f172a !important;
        background-image: linear-gradient(135deg, #0f172a 0%, #312e81 100%) !important;
      }
      .glass-card {
        background-color: #1e293b !important; /* Outlook Fallback */
        background: rgba(30, 41, 59, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5) !important;
      }
      .inner-glass {
        background-color: #334155 !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
      }
      .text-primary {
        color: #f1f5f9 !important;
      }
      .text-secondary {
        color: #94a3b8 !important;
      }
      .text-accent {
        color: #d8b4fe !important; /* Primary Dark Token */
      }
      .text-highlight {
        color: #f472b6 !important; /* Highlight Dark Token */
      }
      .icon-circle {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .security-box {
        background: rgba(6, 78, 59, 0.3) !important;
        border: 1px solid rgba(52, 211, 153, 0.2) !important;
      }
      .security-text {
        color: #34d399 !important;
      }
      .divider {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
    }
  </style>
</head>
<body class="body-bg" style="margin:0;padding:0;word-spacing:normal;background-color:#eff6ff;background-image:linear-gradient(135deg, #dbeafe 0%, #fae8ff 100%);-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        
        <table role="presentation" class="glass-card" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:600px;width:100%;margin:0 auto;background-color:#ffffff;background:rgba(255, 255, 255, 0.65);border:1px solid rgba(255, 255, 255, 0.8);border-radius:24px;box-shadow:0 8px 32px 0 rgba(31, 38, 135, 0.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);">
          
          <tr>
            <td align="center" style="padding:45px 40px 10px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td class="icon-circle" width="80" height="80" align="center" valign="middle" style="background:rgba(37, 99, 235, 0.1);border-radius:50%;border:1px solid rgba(255, 255, 255, 0.5);box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </td>
                </tr>
              </table>

              <h1 class="text-primary" style="margin:0 0 12px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:36px;font-weight:800;letter-spacing:-1px;line-height:1;color:#1e293b;">
                Welcome Aboard!
              </h1>
              
              <p class="text-accent" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;font-weight:600;color:#2563eb;letter-spacing:0.5px;text-transform:uppercase;">
                ${organizationName}
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 30px 40px;">
              <p class="text-secondary" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;line-height:1.6;color:#475569;">
                Hey <strong>${name}</strong>! 👋 Your fintech journey starts here. Let's get you signed in and ready to go.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 30px 40px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="inner-glass" style="padding:24px;border-radius:16px;background-color:#f8fafc;background:rgba(255, 255, 255, 0.4);border:1px solid rgba(255, 255, 255, 0.6);">
                    
                    <p class="text-primary" style="margin:0 0 20px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:1px;text-align:center;">
                      🔐 Your Access Credentials
                    </p>

                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:16px;border-bottom:1px solid rgba(0,0,0,0.05);" class="divider">
                          <p class="text-secondary" style="margin:0 0 4px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;">Email</p>
                          <p class="text-primary" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;color:#1e293b;">${email}</p>
                        </td>
                      </tr>
                    </table>

                    ${userExists ? `
                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                      <tr>
                        <td>
                           <p class="text-secondary" style="margin:0 0 4px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;">Sign-in Method</p>
                           <div style="background:rgba(37, 99, 235, 0.1);border-radius:8px;padding:8px 12px;display:inline-block;">
                              <p class="text-accent" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#2563eb;">
                                Use your existing account method
                              </p>
                           </div>
                        </td>
                      </tr>
                    </table>
                    ` : ``}
                    
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 40px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${fallbackUrl}" style="display:inline-block;background:linear-gradient(135deg, #2563eb 0%, #9333ea 100%);color:#ffffff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;font-weight:600;text-decoration:none;padding:16px 40px;border-radius:50px;box-shadow:0 4px 15px rgba(37, 99, 235, 0.35);text-shadow:0 1px 2px rgba(0,0,0,0.1);border:1px solid rgba(255,255,255,0.2);">
                      🚀 Launch Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
             <td style="padding:0 40px 30px 40px;">
               <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                 <tr>
                   <td class="security-box" align="center" style="background-color:#f0fdf4;padding:16px;border-radius:12px;border:1px solid #d1fae5;">
                     <p class="security-text" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#059669;font-weight:500;">
                       🔒 <strong>Security First:</strong> Please verify your settings after signing in for enhanced protection.
                     </p>
                   </td>
                 </tr>
               </table>
             </td>
          </tr>

        </table>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding-top:30px;">
              <p class="text-secondary" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#94a3b8;">
                © 2025 ${organizationName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
        
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" height="40"><tr><td>&nbsp;</td></tr></table>

      </td>
    </tr>
  </table>
</body>
</html>
    `
  };
}

function memberRemovedEmail(
  member: string,
  organizationName: string
): { subject: string; html: string } {
  return {
    subject: `👋 ${member}, your access to ${organizationName} has been removed`,
    html: `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Access Removed</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    /* Dark Mode Overrides */
    @media (prefers-color-scheme: dark) {
      .body-bg {
        background: #0f172a !important;
        background-image: linear-gradient(135deg, #0f172a 0%, #312e81 100%) !important;
      }
      .glass-card {
        background-color: #1e293b !important; /* Outlook Fallback */
        background: rgba(30, 41, 59, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5) !important;
      }
      .inner-glass {
        background-color: #334155 !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
      }
      .text-primary {
        color: #f1f5f9 !important;
      }
      .text-secondary {
        color: #94a3b8 !important;
      }
      .text-accent {
        color: #d8b4fe !important; /* Primary Dark Token */
      }
      .icon-circle {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .danger-box {
        background: rgba(127, 29, 29, 0.4) !important;
        border: 1px solid rgba(248, 113, 113, 0.2) !important;
      }
      .danger-text {
        color: #fca5a5 !important;
      }
    }
  </style>
</head>
<body class="body-bg" style="margin:0;padding:0;word-spacing:normal;background-color:#eff6ff;background-image:linear-gradient(135deg, #dbeafe 0%, #fae8ff 100%);-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        
        <table role="presentation" class="glass-card" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:600px;width:100%;margin:0 auto;background-color:#ffffff;background:rgba(255, 255, 255, 0.65);border:1px solid rgba(255, 255, 255, 0.8);border-radius:24px;box-shadow:0 8px 32px 0 rgba(31, 38, 135, 0.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);">
          
          <tr>
            <td align="center" style="padding:45px 40px 10px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td class="icon-circle" width="80" height="80" align="center" valign="middle" style="background:rgba(37, 99, 235, 0.1);border-radius:50%;border:1px solid rgba(255, 255, 255, 0.5);box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                  </td>
                </tr>
              </table>

              <h1 class="text-primary" style="margin:0 0 12px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:32px;font-weight:800;letter-spacing:-1px;line-height:1;color:#1e293b;">
                Access Updated
              </h1>
              
              <p class="text-accent" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;font-weight:600;color:#2563eb;letter-spacing:0.5px;text-transform:uppercase;">
                ${organizationName}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px 40px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="inner-glass" style="padding:24px;border-radius:16px;background-color:#f8fafc;background:rgba(255, 255, 255, 0.4);border:1px solid rgba(255, 255, 255, 0.6);">
                    <p class="text-primary" style="margin:0 0 12px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;color:#1e293b;">
                      Hi ${member},
                    </p>
                    <p class="text-secondary" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#475569;">
                      Your membership in <strong>${organizationName}</strong> has been removed by an organization administrator. You no longer have access to this workspace's resources.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
             <td style="padding:0 40px 30px 40px;">
               <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                 <tr>
                   <td class="danger-box" align="center" style="background-color:#fef2f2;padding:16px;border-radius:12px;border:1px solid #fee2e2;">
                     <p class="danger-text" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#991b1b;font-weight:500;">
                       If you believe this was a mistake, please contact the organization owner or your workspace admin to request reinstatement.
                     </p>
                   </td>
                 </tr>
               </table>
             </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 30px 40px;border-top:1px solid rgba(0,0,0,0.05);">
              <p class="text-secondary" style="margin:20px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#94a3b8;">
                © 2025 ${organizationName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" height="40"><tr><td>&nbsp;</td></tr></table>

      </td>
    </tr>
  </table>
</body>
</html>
    `
  };
}
function memberRoleChangedEmail(
  member: string,
  organizationName: string,
  memberRole: string
): { subject: string; html: string } {
  return {
    subject: `🔧 ${member}, your role was updated to ${memberRole}`,
    html: `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Role Updated</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    /* Dark Mode Overrides */
    @media (prefers-color-scheme: dark) {
      .body-bg {
        background: #0f172a !important;
        background-image: linear-gradient(135deg, #0f172a 0%, #312e81 100%) !important;
      }
      .glass-card {
        background-color: #1e293b !important; /* Outlook Fallback */
        background: rgba(30, 41, 59, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5) !important;
      }
      .inner-glass {
        background-color: #334155 !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
      }
      .text-primary {
        color: #f1f5f9 !important;
      }
      .text-secondary {
        color: #94a3b8 !important;
      }
      .text-accent {
        color: #d8b4fe !important; /* Primary Dark Token */
      }
      .icon-circle {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .info-box {
        background: rgba(30, 58, 138, 0.3) !important;
        border: 1px solid rgba(96, 165, 250, 0.2) !important;
      }
      .info-text {
        color: #60a5fa !important;
      }
      .role-pill {
        background: rgba(168, 85, 247, 0.2) !important;
        border: 1px solid rgba(168, 85, 247, 0.3) !important;
        color: #e9d5ff !important;
      }
    }
  </style>
</head>
<body class="body-bg" style="margin:0;padding:0;word-spacing:normal;background-color:#eff6ff;background-image:linear-gradient(135deg, #dbeafe 0%, #fae8ff 100%);-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        
        <table role="presentation" class="glass-card" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:600px;width:100%;margin:0 auto;background-color:#ffffff;background:rgba(255, 255, 255, 0.65);border:1px solid rgba(255, 255, 255, 0.8);border-radius:24px;box-shadow:0 8px 32px 0 rgba(31, 38, 135, 0.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);">
          
          <tr>
            <td align="center" style="padding:45px 40px 10px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td class="icon-circle" width="80" height="80" align="center" valign="middle" style="background:rgba(37, 99, 235, 0.1);border-radius:50%;border:1px solid rgba(255, 255, 255, 0.5);box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                    </svg>
                  </td>
                </tr>
              </table>

              <h1 class="text-primary" style="margin:0 0 12px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:32px;font-weight:800;letter-spacing:-1px;line-height:1;color:#1e293b;">
                Role Updated
              </h1>
              
              <p class="text-accent" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;font-weight:600;color:#2563eb;letter-spacing:0.5px;text-transform:uppercase;">
                ${organizationName}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px 40px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="inner-glass" align="center" style="padding:32px 24px;border-radius:16px;background-color:#f8fafc;background:rgba(255, 255, 255, 0.4);border:1px solid rgba(255, 255, 255, 0.6);">
                    <p class="text-primary" style="margin:0 0 12px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;color:#1e293b;">
                      Hi ${member},
                    </p>
                    <p class="text-secondary" style="margin:0 0 24px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#475569;">
                      Your role has been changed. You have been assigned the following permissions level:
                    </p>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td class="role-pill" style="padding:8px 24px;border-radius:50px;background-color:#f3e8ff;background:rgba(147, 51, 234, 0.1);border:1px solid rgba(147, 51, 234, 0.25);color:#9333ea;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.5px;">
                          ${memberRole}
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
             <td style="padding:0 40px 30px 40px;">
               <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                 <tr>
                   <td class="info-box" align="center" style="background-color:#eff6ff;padding:16px;border-radius:12px;border:1px solid #bfdbfe;">
                     <p class="info-text" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#2563eb;font-weight:500;">
                       Changes take effect immediately. If you didn’t expect this update, contact your workspace admin.
                     </p>
                   </td>
                 </tr>
               </table>
             </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 30px 40px;border-top:1px solid rgba(0,0,0,0.05);">
              <p class="text-secondary" style="margin:20px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#94a3b8;">
                © 2025 ${organizationName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" height="40"><tr><td>&nbsp;</td></tr></table>

      </td>
    </tr>
  </table>
</body>
</html>
    `
  };
}

function generateMagicLinkEmail({ email, url }: { email: string; url: string }): { subject: string, html: string } {
  return {
    subject: "Verify your email address",
    html: `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Verify Email</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    /* Dark Mode Overrides */
    @media (prefers-color-scheme: dark) {
      .body-bg {
        background: #0f172a !important;
        background-image: linear-gradient(135deg, #0f172a 0%, #312e81 100%) !important;
      }
      .glass-card {
        background-color: #1e293b !important; /* Outlook Fallback */
        background: rgba(30, 41, 59, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5) !important;
      }
      .inner-glass {
        background-color: #334155 !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
      }
      .text-primary {
        color: #f1f5f9 !important;
      }
      .text-secondary {
        color: #94a3b8 !important;
      }
      .text-link {
        color: #d8b4fe !important; /* Primary Dark Token */
      }
      .icon-circle {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .email-badge {
        background: rgba(147, 51, 234, 0.2) !important;
        border: 1px solid rgba(168, 85, 247, 0.3) !important;
        color: #e9d5ff !important;
      }
    }
  </style>
</head>
<body class="body-bg" style="margin:0;padding:0;word-spacing:normal;background-color:#eff6ff;background-image:linear-gradient(135deg, #dbeafe 0%, #fae8ff 100%);-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        
        <table role="presentation" class="glass-card" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:600px;width:100%;margin:0 auto;background-color:#ffffff;background:rgba(255, 255, 255, 0.65);border:1px solid rgba(255, 255, 255, 0.8);border-radius:24px;box-shadow:0 8px 32px 0 rgba(31, 38, 135, 0.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);">
          
          <tr>
            <td align="center" style="padding:45px 40px 10px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td class="icon-circle" width="80" height="80" align="center" valign="middle" style="background:rgba(37, 99, 235, 0.1);border-radius:50%;border:1px solid rgba(255, 255, 255, 0.5);box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </td>
                </tr>
              </table>

              <h1 class="text-primary" style="margin:0 0 16px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:32px;font-weight:800;letter-spacing:-1px;line-height:1;color:#1e293b;">
                Verify Your Email
              </h1>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                 <tr>
                   <td class="email-badge" style="background:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.6);border-radius:50px;padding:6px 16px;">
                     <p class="text-secondary" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#475569;">
                       ${email}
                     </p>
                   </td>
                 </tr>
               </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 30px 40px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="inner-glass" align="center" style="padding:32px 24px;border-radius:16px;background-color:#f8fafc;background:rgba(255, 255, 255, 0.4);border:1px solid rgba(255, 255, 255, 0.6);">
                    <p class="text-secondary" style="margin:0 0 24px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#475569;">
                      We received a request to verify your email address. Click the button below to complete the process.
                    </p>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center">
                          <a href="${url}" style="display:inline-block;background:linear-gradient(135deg, #2563eb 0%, #9333ea 100%);color:#ffffff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;text-decoration:none;padding:16px 36px;border-radius:12px;box-shadow:0 4px 15px rgba(37, 99, 235, 0.35);text-shadow:0 1px 2px rgba(0,0,0,0.1);border:1px solid rgba(255,255,255,0.2);">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
             <td align="center" style="padding:0 40px 30px 40px;">
               <p class="text-secondary" style="margin:0 0 8px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#64748b;">
                 Button not working? Copy and paste this link:
               </p>
               <p style="margin:0;word-break:break-all;">
                 <a href="${url}" class="text-link" style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#2563eb;text-decoration:none;">${url}</a>
               </p>
             </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 30px 40px;border-top:1px solid rgba(0,0,0,0.05);">
              <p class="text-secondary" style="margin:20px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#94a3b8;">
                This link expires in 24 hours. If you didn't request this, you can ignore this email.
              </p>
            </td>
          </tr>

        </table>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" height="40"><tr><td>&nbsp;</td></tr></table>

      </td>
    </tr>
  </table>
</body>
</html>
    `
  };
}
function generateOrganizationInviteEmail({
  organizationName,
  userEmail,
  inviteLink,
  role
}: {
  organizationName: string;
  userEmail: string;
  inviteLink: string;
  role: 'member' | 'admin' | 'owner';
}): { subject: string; html: string } {
  const subject = `You've been invited to join ${organizationName}`;

  // Map roles to Design System Tokens
  // Member -> Primary, Admin -> Accent, Owner -> Highlight
  const roleConfig = {
    member: {
      title: "Member",
      description: "You'll have access to collaborate and contribute to projects.",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 21-3-3m0 0-3-3m3 3 3 3m-3-3V8"/></svg>`,
      colorLight: "#2563eb", // Primary Base Light
      colorDark: "#d8b4fe",  // Primary Base Dark
      bgLight: "rgba(37, 99, 235, 0.1)",
      borderLight: "rgba(37, 99, 235, 0.2)"
    },
    admin: {
      title: "Administrator",
      description: "You'll have administrative privileges to manage the organization.",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>`,
      colorLight: "#9333ea", // Accent Base Light
      colorDark: "#a855f7",  // Accent Base Dark
      bgLight: "rgba(147, 51, 234, 0.1)",
      borderLight: "rgba(147, 51, 234, 0.2)"
    },
    owner: {
      title: "Owner",
      description: "You'll have full control and ownership of the organization.",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><path d="M21 12c.552 0 1-.449 1-1V8c0-.551-.448-1-1-1-.551 0-1-.449-1-1V3c0-.551-.448-1-1-1H4c-.552 0-1 .449-1 1v3c0 .551-.449 1-1 1-.552 0-1 .449-1 1v3c0 .551.448 1 1 1 .551 0 1 .449 1 1v3c0 .551.448 1 1 1h15c.552 0 1-.449 1-1v-3c0-.551.449-1 1-1z"/></svg>`,
      colorLight: "#db2777", // Highlight Base Light
      colorDark: "#f472b6",  // Highlight Base Dark
      bgLight: "rgba(219, 39, 119, 0.1)",
      borderLight: "rgba(219, 39, 119, 0.2)"
    }
  };

  const currentRole = roleConfig[role] || roleConfig.member;

  return {
    subject,
    html: `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Organization Invitation</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    /* Dark Mode Overrides */
    @media (prefers-color-scheme: dark) {
      .body-bg {
        background: #0f172a !important;
        background-image: linear-gradient(135deg, #0f172a 0%, #312e81 100%) !important;
      }
      .glass-card {
        background-color: #1e293b !important; /* Outlook Fallback */
        background: rgba(30, 41, 59, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5) !important;
      }
      .inner-glass {
        background-color: #334155 !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
      }
      .text-primary {
        color: #f1f5f9 !important;
      }
      .text-secondary {
        color: #94a3b8 !important;
      }
      .text-link {
        color: #d8b4fe !important;
      }
      .icon-circle {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      /* Dynamic Role Colors for Dark Mode */
      .role-icon-container {
        color: ${currentRole.colorDark} !important;
      }
      .role-title {
        color: #f1f5f9 !important;
      }
      .role-box {
        background: rgba(255, 255, 255, 0.05) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }
    }
  </style>
</head>
<body class="body-bg" style="margin:0;padding:0;word-spacing:normal;background-color:#eff6ff;background-image:linear-gradient(135deg, #dbeafe 0%, #fae8ff 100%);-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        
        <table role="presentation" class="glass-card" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:600px;width:100%;margin:0 auto;background-color:#ffffff;background:rgba(255, 255, 255, 0.65);border:1px solid rgba(255, 255, 255, 0.8);border-radius:24px;box-shadow:0 8px 32px 0 rgba(31, 38, 135, 0.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);">
          
          <tr>
            <td align="center" style="padding:45px 40px 10px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td class="icon-circle" width="80" height="80" align="center" valign="middle" style="background:rgba(255, 255, 255, 0.4);border-radius:50%;border:1px solid rgba(255, 255, 255, 0.5);box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    <div class="role-icon-container" style="color:${currentRole.colorLight};display:block;line-height:0;">
                       ${currentRole.icon}
                    </div>
                  </td>
                </tr>
              </table>

              <h1 class="text-primary" style="margin:0 0 12px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:32px;font-weight:800;letter-spacing:-1px;line-height:1;color:#1e293b;">
                You've been invited
              </h1>
              
              <p class="text-secondary" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;font-weight:500;color:#64748b;">
                to join <span style="color:${currentRole.colorLight};font-weight:700;">${organizationName}</span>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px 40px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="role-box" align="center" style="padding:24px;border-radius:16px;background-color:#f8fafc;background:${currentRole.bgLight};border:1px solid ${currentRole.borderLight};">
                    
                    <h3 class="role-title" style="margin:0 0 8px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;color:#1e293b;">
                      ${currentRole.title}
                    </h3>
                    
                    <p class="text-secondary" style="margin:0 0 20px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#475569;">
                      ${currentRole.description}
                    </p>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                         <td style="background:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.6);border-radius:50px;padding:6px 16px;">
                           <p class="text-secondary" style="margin:0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#64748b;">
                             Invited as: ${userEmail}
                           </p>
                         </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
             <td align="center" style="padding:0 40px 40px 40px;">
               <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                 <tr>
                   <td align="center">
                     <a href="${inviteLink}" style="display:inline-block;background:linear-gradient(135deg, #2563eb 0%, #9333ea 100%);color:#ffffff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;text-decoration:none;padding:16px 36px;border-radius:12px;box-shadow:0 4px 15px rgba(37, 99, 235, 0.35);text-shadow:0 1px 2px rgba(0,0,0,0.1);border:1px solid rgba(255,255,255,0.2);">
                       Accept Invitation
                     </a>
                   </td>
                 </tr>
               </table>
             </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 30px 40px;">
               <p class="text-secondary" style="margin:0 0 8px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#64748b;">
                 Or copy this link:
               </p>
               <p style="margin:0;word-break:break-all;">
                 <a href="${inviteLink}" class="text-link" style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#2563eb;text-decoration:none;">${inviteLink}</a>
               </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 40px 30px 40px;border-top:1px solid rgba(0,0,0,0.05);">
              <p class="text-secondary" style="margin:20px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#94a3b8;">
                This invitation expires in 7 days.
              </p>
              <p class="text-secondary" style="margin:8px 0 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#94a3b8;">
                © 2025 ${organizationName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" height="40"><tr><td>&nbsp;</td></tr></table>

      </td>
    </tr>
  </table>
</body>
</html>
    `
  };
}


export type TemplateType = 'generateOrganizationInviteEmail'| 'VerifyEmail' | 'ResetPassword' | 'Welcome' | 'VerifyExternalInvestor' | 'onboardingFinished' | 'memberRemovedEmail' | 'memberRoleChangedEmail' | 'generateMagicLinkEmail'
export interface TemplateParamMap {
  VerifyEmail: { verifyUrl: string }
  ResetPassword: { resetUrl: string }
  Welcome: { userName: string }
  VerifyExternalInvestor: {
    name: string
    email: string
    contributionPercent: number
    propertyName: string
    DollarValueReturn: number
    propertyLink: string
    verificationLink: string,
    accessCode: string
  }
  onboardingFinished: {
    name: string
    email: string
    organizationName: string

    fallbackUrl: string,
    userExists: boolean
  }

  memberRemovedEmail: {
    member: string
    organizationName: string
  }
  memberRoleChangedEmail: {
    organizationName: string
    member: string
    memberRole: string
  },
  generateMagicLinkEmail: { email: string; url: string },
  generateOrganizationInviteEmail: {
    organizationName: string;
    userEmail: string;
    inviteLink: string;
    role: "member" | "owner" | "admin";
  }



}
type TemplateResult = { subject: string; html: string }
const templates: { [K in TemplateType]: (params: TemplateParamMap[K]) => TemplateResult } = {
  VerifyEmail: ({ verifyUrl }) => getVerifyEmailHtml(verifyUrl),
  ResetPassword: ({ resetUrl }) => getResetPasswordEmailHtml(resetUrl),
  Welcome: ({ userName }) => getWelcomeEmailHtml(userName),
  VerifyExternalInvestor: (p) =>
    VerifyExternalInvestor(
      p.name,
      p.email,
      p.contributionPercent,
      p.propertyName,
      p.DollarValueReturn,
      p.propertyLink,
      p.verificationLink,
      p.accessCode
    ),
  onboardingFinished: (p) =>
    onboardingFinish(
      p.name,
      p.email,
      p.organizationName,
      p.fallbackUrl,
      p.userExists
    ),
  memberRemovedEmail: (p) => memberRemovedEmail(p.member, p.organizationName),
  memberRoleChangedEmail: (p) => memberRoleChangedEmail(p.member, p.organizationName, p.memberRole),
  generateMagicLinkEmail: (p) => generateMagicLinkEmail(p),
  generateOrganizationInviteEmail: (p) => generateOrganizationInviteEmail(p),

}
export function generateTemplate<T extends TemplateType>(
  template: T,
  params: TemplateParamMap[T]
): TemplateResult {
  return templates[template](params)
}





