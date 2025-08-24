

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
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Investor Verification</title>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; min-height: 100vh;">
  
  <!-- Main Container Table -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Email Content Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 640px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 24px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); overflow: hidden;">
          
          <!-- Header Section -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 0 40px; text-align: center; position: relative;">
              <!-- Security Icon -->
              <div style="width: 80px; height: 80px; margin: 0 auto 24px auto; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.3);">
                <div style="width: 40px; height: 40px; background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDFMMjEgNVYxMUMyMSAxNi41NSAxNi4xNiAyMS43NCA5IDIzQzEuODQgMjEuNzQgLTMgMTYuNTUgLTMgMTFWNUwxMiAxWiIgZmlsbD0iI2ZmZmZmZiIvPgo8cGF0aCBkPSJNMTAgMTVMNi41IDExLjVMNy45MSAxMC4wOUwxMCAxMi4xN0wxNi4wOSA2LjA5TDE3LjUgNy41TDEwIDE1WiIgZmlsbD0iIzY2N2VlYSIvPgo8L3N2Zz4K') center/contain no-repeat;"></div>
              </div>
              
              <h1 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 800; color: #ffffff; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                Investor Verification
              </h1>
              <p style="margin: 0 0 40px 0; font-size: 18px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">
                Confirm your participation in this investment opportunity
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              
              <!-- Important Access Code Section -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #ff6b6b, #ee5a6f); padding: 24px; border-radius: 16px; text-align: center; position: relative; overflow: hidden;">
                    <!-- Decorative pattern -->
                    <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+Cjwvc3ZnPg==') repeat; opacity: 0.3; pointer-events: none;"></div>
                    
                    <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: rgba(255, 255, 255, 0.9); position: relative; z-index: 1;">
                      🔑 Your Access Code
                    </p>
                    <div style="background: rgba(255, 255, 255, 0.2); border: 2px dashed rgba(255, 255, 255, 0.4); border-radius: 12px; padding: 16px; margin-bottom: 16px; position: relative; z-index: 1;">
                      <p style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: 4px; font-family: 'Courier New', monospace; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
                        ${accessCode}
                      </p>
                    </div>
                    <p style="margin: 0; font-size: 14px; color: rgba(255, 255, 255, 0.8); position: relative; z-index: 1;">
                      Copy this code and paste it when prompted during verification
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Investor Details Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); border: 1px solid rgba(102, 126, 234, 0.2); border-radius: 16px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #1f2937;">
                      📋 Investor Information
                    </h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td width="30%" style="vertical-align: top; padding-right: 16px;">
                                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #6b7280;">Name:</p>
                              </td>
                              <td width="70%">
                                <p style="margin: 0; font-size: 16px; font-weight: 700; color: #1f2937;">${name}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td width="30%" style="vertical-align: top; padding-right: 16px;">
                                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #6b7280;">Email:</p>
                              </td>
                              <td width="70%">
                                <p style="margin: 0; font-size: 16px; font-weight: 700; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: #667eea;">${email}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Property Information -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <!--[if mso]>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1)); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px;">
                      <tr>
                        <td style="padding: 24px;">
                          <h3 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1f2937;">🏢 ${propertyName}</h3>
                          <p style="margin: 0; font-size: 16px; color: #6b7280;">Click to view detailed property information</p>
                        </td>
                      </tr>
                    </table>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${propertyLink}" style="display: block; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1)); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px; padding: 24px; text-decoration: none; color: inherit; transition: all 0.3s ease; position: relative; overflow: hidden;">
                      <div style="position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; background: linear-gradient(135deg, #10b981, #06b6d4); border-radius: 16px; opacity: 0; transition: opacity 0.3s ease; pointer-events: none;"></div>
                      <div style="position: relative; z-index: 1;">
                        <h3 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1f2937;">🏢 ${propertyName}</h3>
                        <p style="margin: 0; font-size: 16px; color: #6b7280;">Click to view detailed property information →</p>
                      </div>
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
              
              <!-- Investment Stats Grid -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <!-- Contribution Percentage -->
                  <td width="48%" style="vertical-align: top; padding-right: 12px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1)); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px;">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <div style="width: 48px; height: 48px; margin: 0 auto 12px auto; background: linear-gradient(135deg, #10b981, #06b6d4); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 20px;">📊</span>
                          </div>
                          <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Your Contribution</p>
                          <p style="margin: 0; font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #10b981, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: #10b981;">${contributionPercent}%</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  
                  <!-- Investment Value -->
                  <td width="48%" style="vertical-align: top; padding-left: 12px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1)); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 16px;">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <div style="width: 48px; height: 48px; margin: 0 auto 12px auto; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 20px;">💰</span>
                          </div>
                          <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Investment Value</p>
                          <p style="margin: 0; font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: #fbbf24;">$${DollarValueReturn.toLocaleString()}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Call to Action Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${verificationLink}" style="height:56px;v-text-anchor:middle;width:100%;" arcsize="50%" strokecolor="#667eea" fillcolor="#667eea">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:18px;font-weight:700;">🚀 Start Verification Process</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${verificationLink}" style="display: inline-block; width: 100%; max-width: 400px; padding: 18px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 18px; border-radius: 50px; text-align: center; box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3); transition: all 0.3s ease; position: relative; overflow: hidden; border: none;">
                      <span style="position: relative; z-index: 1;">🚀 Start Verification Process</span>
                      <div style="position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent); transition: left 0.5s ease; pointer-events: none;"></div>
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
              
              <!-- Instructions -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05)); border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 16px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h4 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #1f2937;">
                      📋 Verification Steps
                    </h4>
                    <ol style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.6;">
                      <li style="margin-bottom: 8px; font-size: 16px;">Click the "Start Verification Process" button above</li>
                      <li style="margin-bottom: 8px; font-size: 16px;">Enter your access code: <strong style="background: rgba(102, 126, 234, 0.1); padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace;">${accessCode}</strong></li>
                      <li style="margin-bottom: 8px; font-size: 16px;">Complete the verification form</li>
                      <li style="margin: 0; font-size: 16px;">Confirm your participation in the investment</li>
                    </ol>
                  </td>
                </tr>
              </table>
              
              <!-- Footer -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="border-top: 1px solid rgba(156, 163, 175, 0.2); padding-top: 24px; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
                      This verification is required to complete your investment participation.<br>
                      If you have questions, please contact our support team.
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                      © 2025 Investment Platform. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>

  <!-- Dark Mode Styles -->
  <style>
    @media (prefers-color-scheme: dark) {
      .email-content {
        background: rgba(17, 24, 39, 0.95) !important;
        color: #f9fafb !important;
      }
    }
    
    /* Hover Effects (where supported) */
    @media screen and (min-width: 600px) {
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
      }
      
      .property-link:hover {
        transform: translateY(-1px);
      }
    }
  </style>

</body>
</html>`.trim(),
  };
}

function onboardingFinish(
  name: string,
  email: string,
  organizationName: string,
  tempPassword: string,
  fallbackUrl: string,
  userExists: boolean
): { subject: string; html: string } {
  return {
    subject: "🚀 Welcome to Your New Fintech Journey",
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    @media (prefers-color-scheme: dark) {
      .dark-mode { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%) !important; }
      .dark-container { 
        background: rgba(17, 24, 39, 0.9) !important; 
        border-color: rgba(55, 65, 81, 0.8) !important;
      }
      .dark-glass { 
        background: rgba(31, 41, 55, 0.8) !important; 
        border-color: rgba(75, 85, 99, 0.6) !important; 
      }
      .dark-text { color: #f9fafb !important; }
      .dark-muted { color: #d1d5db !important; }
      .dark-border { border-color: rgba(75, 85, 99, 0.4) !important; }
      .dark-notice { background: rgba(34, 197, 94, 0.15) !important; border-color: rgba(34, 197, 94, 0.3) !important; }
    }
    
    .gradient-text {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: #3b82f6;
    }
    
    .glass-container {
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    }
    
    .glass-inner {
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 16px;
    }
    
    .gradient-button {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
      border-radius: 50px;
      padding: 16px 40px;
      color: white;
      font-weight: 700;
      font-size: 18px;
      text-decoration: none;
      display: inline-block;
      box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
    }
    
    .blob-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-image: 
        radial-gradient(circle at 20% 20%, rgba(253, 230, 138, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 40% 70%, rgba(236, 72, 153, 0.4) 0%, transparent 50%);
      border-radius: 24px;
      overflow: hidden;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #fce7f3 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; min-height: 100vh;" class="dark-mode">
  
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: transparent;">
    <tr>
      <td align="center" style="padding: 60px 20px;">
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; position: relative;" class="glass-container dark-container">
          
          <tr>
            <td style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;">
              <div class="blob-bg"></div>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 80px 50px; position: relative; z-index: 10;">
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 40px;">
                    <h1 style="margin: 0; font-size: 56px; font-weight: 900; line-height: 0.9; letter-spacing: -0.02em;" class="gradient-text">
                      Welcome Aboard!
                    </h1>
                    <h2 style="margin: 16px 0 0 0; font-size: 28px; font-weight: 800; color: #374151;" class="dark-muted">
                      ${organizationName}
                    </h2>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 32px; text-align: center;">
                    <p style="margin: 0; font-size: 24px; font-weight: 600; color: #1f2937;" class="dark-text">
                      Hey ${name}! 👋
                    </p>
                    <p style="margin: 16px 0 0 0; font-size: 18px; color: #6b7280;" class="dark-muted">
                      Your fintech journey starts here. Let's get you signed in!
                    </p>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="glass-inner dark-glass" style="margin-bottom: 40px;">
                <tr>
                  <td style="padding: 32px;">
                    <p style="margin: 0 0 24px 0; font-size: 20px; color: #374151; font-weight: 700; text-align: center;" class="dark-text">
                      🔐 Your Access Credentials
                    </p>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 1px solid rgba(156, 163, 175, 0.2);" class="dark-border">
                          <div style="font-size: 14px; color: #6b7280; font-weight: 600; margin-bottom: 4px;" class="dark-muted">EMAIL</div>
                          <div style="font-size: 18px; font-weight: 800;" class="gradient-text">${email}</div>
                        </td>
                      </tr>

                      ${userExists ? (`
                        <tr>
                        <td style="padding: 16px 0;">
                          <div style="font-size: 14px; color: #6b7280; font-weight: 600; margin-bottom: 4px;" class="dark-muted"> PASSWORD</div>
                          <div style="font-size: 18px; font-weight: 800; font-family: 'Monaco', monospace; background: rgba(59, 130, 246, 0.1); padding: 8px 12px; border-radius: 8px; display: inline-block;" class="gradient-text">
                              Sign in with the method you used to create the account.
                          </div>
                        </td>
                      </tr>
                        
                        
                        
                        `) : (`
                          <tr>
                        <td style="padding: 16px 0;">
                          <div style="font-size: 14px; color: #6b7280; font-weight: 600; margin-bottom: 4px;" class="dark-muted">TEMPORARY PASSWORD</div>
                          <div style="font-size: 18px; font-weight: 800; font-family: 'Monaco', monospace; background: rgba(59, 130, 246, 0.1); padding: 8px 12px; border-radius: 8px; display: inline-block;" class="gradient-text">${tempPassword}</div>
                        </td>
                      </tr>
                          
                          
                          
                          `)}
                      
                    </table>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 40px;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${fallbackUrl}" style="height:56px;v-text-anchor:middle;width:240px;" arcsize="50%" fillcolor="#3b82f6">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:18px;font-weight:700;">🚀 Launch Dashboard</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${fallbackUrl}" class="gradient-button">
                      🚀 Launch Dashboard
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="border-top: 1px solid rgba(156, 163, 175, 0.2); padding-top: 32px;" class="dark-border">
                    <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 12px; padding: 20px; text-align: center;" class="dark-notice">
                      <p style="margin: 0; font-size: 16px; color: #059669; font-weight: 600;" class="dark-muted">
                        🔒 <strong>Security First:</strong> Please update your password and verify your email after signing in for enhanced protection.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>
    `.trim()
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
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    @media (prefers-color-scheme: dark) {
      .dark-mode { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%) !important; }
      .dark-container { background: rgba(17,24,39,0.9) !important; border-color: rgba(55,65,81,0.8) !important; }
      .dark-glass { background: rgba(31,41,55,0.8) !important; border-color: rgba(75,85,99,0.6) !important; }
      .dark-text { color: #f9fafb !important; }
      .dark-muted { color: #d1d5db !important; }
      .dark-border { border-color: rgba(75,85,99,0.4) !important; }
      .dark-notice { background: rgba(239,68,68,0.15) !important; border-color: rgba(239,68,68,0.3) !important; }
    }
    .gradient-text {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; color: #3b82f6;
    }
    .glass-container {
      background: rgba(255,255,255,0.85);
      border: 1px solid rgba(255,255,255,0.6);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    }
    .glass-inner {
      background: rgba(255,255,255,0.7);
      border: 1px solid rgba(255,255,255,0.5);
      border-radius: 16px;
    }
    .blob-bg {
      position:absolute; inset:0;
      background-image:
        radial-gradient(circle at 20% 20%, rgba(253,230,138,0.4) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(139,92,246,0.4) 0%, transparent 50%),
        radial-gradient(circle at 40% 70%, rgba(236,72,153,0.4) 0%, transparent 50%);
      border-radius: 24px; overflow: hidden;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 50%,#fce7f3 100%);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;min-height:100vh;" class="dark-mode">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:transparent;">
    <tr>
      <td align="center" style="padding:60px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;position:relative;" class="glass-container dark-container">
          <tr><td style="position:absolute;inset:0;"><div class="blob-bg"></div></td></tr>
          <tr>
            <td style="padding:80px 50px;position:relative;z-index:10;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:40px;">
                    <h1 style="margin:0;font-size:48px;font-weight:900;line-height:1;letter-spacing:-0.02em;" class="gradient-text">Access Updated</h1>
                    <h2 style="margin:16px 0 0 0;font-size:24px;font-weight:800;color:#374151;" class="dark-muted">${organizationName}</h2>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="glass-inner dark-glass" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 8px 0;font-size:20px;font-weight:700;color:#111827;" class="dark-text">Hi ${member},</p>
                    <p style="margin:0;color:#6b7280;font-size:16px;" class="dark-muted">
                      Your membership in <strong>${organizationName}</strong> has been removed by an organization administrator.
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-top:1px solid rgba(156,163,175,0.2);padding-top:24px;" class="dark-border">
                    <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:16px;text-align:center;" class="dark-notice">
                      <p style="margin:0;font-size:14px;color:#991b1b;" class="dark-muted">
                        If you believe this was a mistake, please contact the organization owner or your workspace admin to request reinstatement.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()
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
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    @media (prefers-color-scheme: dark) {
      .dark-mode { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%) !important; }
      .dark-container { background: rgba(17,24,39,0.9) !important; border-color: rgba(55,65,81,0.8) !important; }
      .dark-glass { background: rgba(31,41,55,0.8) !important; border-color: rgba(75,85,99,0.6) !important; }
      .dark-text { color: #f9fafb !important; }
      .dark-muted { color: #d1d5db !important; }
      .dark-border { border-color: rgba(75,85,99,0.4) !important; }
      .dark-notice { background: rgba(59,130,246,0.15) !important; border-color: rgba(59,130,246,0.3) !important; }
    }
    .gradient-text {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; color: #3b82f6;
    }
    .glass-container {
      background: rgba(255,255,255,0.85);
      border: 1px solid rgba(255,255,255,0.6);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    }
    .glass-inner {
      background: rgba(255,255,255,0.7);
      border: 1px solid rgba(255,255,255,0.5);
      border-radius: 16px;
    }
    .blob-bg {
      position:absolute; inset:0;
      background-image:
        radial-gradient(circle at 20% 20%, rgba(253,230,138,0.4) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(139,92,246,0.4) 0%, transparent 50%),
        radial-gradient(circle at 40% 70%, rgba(236,72,153,0.4) 0%, transparent 50%);
      border-radius: 24px; overflow: hidden;
    }
    .pill {
      display:inline-block;padding:6px 12px;border-radius:9999px;
      background:rgba(59,130,246,0.12);border:1px solid rgba(59,130,246,0.25);
      font-weight:700;font-size:12px;letter-spacing:.02em;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 50%,#fce7f3 100%);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;min-height:100vh;" class="dark-mode">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:transparent;">
    <tr>
      <td align="center" style="padding:60px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;position:relative;" class="glass-container dark-container">
          <tr><td style="position:absolute;inset:0;"><div class="blob-bg"></div></td></tr>
          <tr>
            <td style="padding:80px 50px;position:relative;z-index:10;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:40px;">
                    <h1 style="margin:0;font-size:48px;font-weight:900;line-height:1;letter-spacing:-0.02em;" class="gradient-text">Role Updated</h1>
                    <h2 style="margin:16px 0 0 0;font-size:24px;font-weight:800;color:#374151;" class="dark-muted">${organizationName}</h2>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="glass-inner dark-glass" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 8px 0;font-size:20px;font-weight:700;color:#111827;" class="dark-text">Hi ${member},</p>
                    <p style="margin:0;color:#6b7280;font-size:16px;" class="dark-muted">
                      Your role in <strong>${organizationName}</strong> has been changed.
                    </p>
                    <div style="margin-top:16px;text-align:center;">
                      <span class="pill">New role: ${memberRole}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-top:1px solid rgba(156,163,175,0.2);padding-top:24px;" class="dark-border">
                    <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:16px;text-align:center;" class="dark-notice">
                      <p style="margin:0;font-size:14px;color:#1e40af;" class="dark-muted">
                        Changes take effect immediately. If you didn’t expect this update, contact your workspace admin.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()
  };
}


export type TemplateType = | 'VerifyEmail' | 'ResetPassword' | 'Welcome' | 'VerifyExternalInvestor' | 'onboardingFinished' | 'memberRemovedEmail' | 'memberRoleChangedEmail'
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
    tempPassword: string
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
      p.tempPassword,
      p.fallbackUrl,
      p.userExists
    ),
  memberRemovedEmail: (p) => memberRemovedEmail(p.member, p.organizationName),
  memberRoleChangedEmail: (p) => memberRoleChangedEmail(p.member, p.organizationName, p.memberRole),
}
export function generateTemplate<T extends TemplateType>(
  template: T,
  params: TemplateParamMap[T]
): TemplateResult {
  return templates[template](params)
}





