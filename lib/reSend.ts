

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
  verificationLink: string
): { subject: string; html: string } {
  return {
    subject: "Verify External Investor - Investment Verification Required",
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
</head>
<body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6;">
  
  <!-- Main Container Table -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f4f8; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 60px 20px;">
        
        <!-- Email Content Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: rgba(255, 255, 255, 0.8); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.6); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden;">
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px; position: relative; z-index: 1;">
              
              <!-- Header -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 32px;">
                    <h1 style="margin: 0; font-size: 40px; font-weight: 800; line-height: 1.1; text-align: center; background-image: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: #3b82f6;">
                      Verify Investor
                    </h1>
                  </td>
                </tr>
              </table>
              
              <!-- Investor Info Section -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.4); margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 8px;">
                          <p style="margin: 0; font-size: 16px; color: #374151;">
                            <span style="font-weight: 600;">Name:</span> ${name}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 16px; color: #374151;">
                            <span style="font-weight: 600;">Email:</span> 
                            <span style="font-weight: 700; background-image: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: #3b82f6;">${email}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Property Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <!--[if mso]>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.4);">
                      <tr>
                        <td style="padding: 20px;">
                          <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #374151;">${propertyName}</h2>
                          <p style="margin: 0; color: #6b7280;">View property details</p>
                        </td>
                      </tr>
                    </table>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${propertyLink}" style="display: block; background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.4); padding: 20px; text-decoration: none; color: inherit; transition: transform 0.3s ease;">
                      <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #374151;">${propertyName}</h2>
                      <p style="margin: 0; color: #6b7280;">View property details</p>
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
              
              <!-- Stats Grid -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <!-- Contribution Stat -->
                  <td width="48%" style="padding-right: 8px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: rgba(255, 255, 255, 0.1); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.3);">
                      <tr>
                        <td style="padding: 16px; text-align: center;">
                          <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #374151;">Contribution</p>
                          <p style="margin: 0; font-size: 22px; font-weight: 700; background-image: linear-gradient(90deg, #10b981, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: #10b981;">${contributionPercent}%</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  
                  <!-- Value Stat -->
                  <td width="48%" style="padding-left: 8px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: rgba(255, 255, 255, 0.1); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.3);">
                      <tr>
                        <td style="padding: 16px; text-align: center;">
                          <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #374151;">Value</p>
                          <p style="margin: 0; font-size: 22px; font-weight: 700; background-image: linear-gradient(90deg, #10b981, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: #10b981;">$${DollarValueReturn.toLocaleString()}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 24px;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${verificationLink}" style="height:48px;v-text-anchor:middle;width:100%;" arcsize="50%" strokecolor="#3b82f6" fillcolor="#3b82f6">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:700;">Confirm Participation</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${verificationLink}" style="display: block; width: 100%; padding: 14px 0; background-image: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); background-color: #3b82f6; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px; border-radius: 50px; text-align: center; line-height: 1.2; box-sizing: border-box;">
                      Confirm Participation
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
              
              <!-- Footer -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="border-top: 1px solid rgba(156, 163, 175, 0.3); padding-top: 24px;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280; text-align: center;">
                      Please verify this investor to complete the investment process.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
        </table>
        
        <!-- Decorative Background Elements (Positioned Absolutely) -->
        <div style="position: absolute; top: -50px; left: -50px; width: 300px; height: 300px; background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJibG9iMSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZkZTY4YSIgc3RvcC1vcGFjaXR5PSIwLjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZGE0YWYiIHN0b3Atb3BhY2l0eT0iMC42Ii8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSIxNTAiIGZpbGw9InVybCgjYmxvYjEpIi8+PC9zdmc+'); background-size: cover; border-radius: 50%; opacity: 0.6; z-index: -1; pointer-events: none;"></div>
        
        <div style="position: absolute; bottom: -60px; right: -60px; width: 250px; height: 250px; background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDI1MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJibG9iMiI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2E1YjRmYyIgc3RvcC1vcGFjaXR5PSIwLjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM2ZWU3YjciIHN0b3Atb3BhY2l0eT0iMC42Ii8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMTI1IiBjeT0iMTI1IiByPSIxMjUiIGZpbGw9InVybCgjYmxvYjIpIi8+PC9zdmc+'); background-size: cover; border-radius: 50%; opacity: 0.6; z-index: -1; pointer-events: none;"></div>
        
        <div style="position: absolute; top: 40%; right: -80px; width: 200px; height: 200px; background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJibG9iMyI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZiYmYyNCIgc3RvcC1vcGFjaXR5PSIwLjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmNDcyYjYiIHN0b3Atb3BhY2l0eT0iMC42Ii8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxMDAiIGZpbGw9InVybCgjYmxvYjMpIi8+PC9zdmc+'); background-size: cover; border-radius: 50%; opacity: 0.6; z-index: -1; pointer-events: none;"></div>
        
      </td>
    </tr>
  </table>

</body>
</html>`.trim(),

  };
}

function onboardingFinish(
  name: string,
  email: string,
  organizationName: string,
  tempPassword: string,
  fallbackUrl: string
): { subject: string; html: string } {
  return {
    subject: "Onboarding Complete",
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
</head>
<body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6;">
  
  <!-- Main Container Table -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f4f8;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Email Content Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: rgba(255, 255, 255, 0.85); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.6); position: relative; overflow: hidden;">
          
          <!-- Decorative Background Blob 1 -->
          <tr>
            <td style="position: absolute; top: -50px; left: -50px; width: 200px; height: 200px; background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJibG9iMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZkZTY4YSIgc3RvcC1vcGFjaXR5PSIwLjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZGE0YWYiIHN0b3Atb3BhY2l0eT0iMC42Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxMDAiIGZpbGw9InVybCgjYmxvYjEpIi8+PC9zdmc+'); background-size: cover; opacity: 0.6; pointer-events: none;"></td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 60px 40px; position: relative; z-index: 1;">
              
              <!-- Header -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 32px;">
                    <h1 style="margin: 0; font-size: 42px; font-weight: 800; line-height: 1.1; background-image: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: #3b82f6;">
                      Welcome to ${organizationName}!
                    </h1>
                  </td>
                </tr>
              </table>
              
              <!-- Greeting -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 24px;">
                    <p style="margin: 0; font-size: 18px; font-weight: 600; color: #374151;">
                      Hi ${name},
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Glass Effect Credentials Container -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: rgba(255, 255, 255, 0.6); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.8); margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; font-weight: 500;">
                      You can sign in using the following credentials:
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 8px;">
                          <span style="font-weight: 700; color: #374151; font-size: 16px;">Email: </span>
                          <span style="font-weight: 700; background-image: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: #3b82f6; font-size: 16px;">${email}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="font-weight: 700; color: #374151; font-size: 16px;">Password: </span>
                          <span style="font-weight: 700; background-image: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: #3b82f6; font-size: 16px;">${tempPassword}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 32px;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${fallbackUrl}" style="height:48px;v-text-anchor:middle;width:140px;" arcsize="50%" strokecolor="#3b82f6" fillcolor="#3b82f6">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:600;">Sign In</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${fallbackUrl}" style="display: inline-block; padding: 14px 32px; background-image: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); background-color: #3b82f6; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 50px; border: none; text-align: center; line-height: 1.2;">
                      Sign In
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
              
              <!-- Footer Note -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="border-top: 1px solid rgba(156, 163, 175, 0.3); padding-top: 24px;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280; text-align: center;">
                      Please verify your email after signing in to access all features.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Decorative Background Blob 2 -->
          <tr>
            <td style="position: absolute; bottom: -50px; right: -50px; width: 200px; height: 200px; background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJibG9iMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2E1YjRmYyIgc3RvcC1vcGFjaXR5PSIwLjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM2ZWU3YjciIHN0b3Atb3BhY2l0eT0iMC42Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxMDAiIGZpbGw9InVybCgjYmxvYjIpIi8+PC9zdmc+'); background-size: cover; opacity: 0.6; pointer-events: none;"></td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
  <!-- Dark Mode Styles -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    [if !mso]><!-->
    <div style="display: none; max-height: 0; overflow: hidden;">
      @media (prefers-color-scheme: dark) {
        .dark-bg { background-color: #1a1a1a !important; }
        .dark-container { background-color: rgba(31, 41, 55, 0.85) !important; border-color: rgba(75, 85, 99, 0.6) !important; }
        .dark-text { color: #f3f4f6 !important; }
        .dark-muted { color: #9ca3af !important; }
      }
    </div>
    <!--<![endif]
  </div>

</body>
</html>
    `.trim()
  };
}




export type TemplateType = | 'VerifyEmail' | 'ResetPassword' | 'Welcome' | 'VerifyExternalInvestor' | 'onboardingFinished'
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
    verificationLink: string
  }
  onboardingFinished: {
    name: string
    email: string
    organizationName: string
    tempPassword: string
    fallbackUrl: string
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
      p.verificationLink
    ),
  onboardingFinished: (p) =>
    onboardingFinish(
      p.name,
      p.email,
      p.organizationName,
      p.tempPassword,
      p.fallbackUrl
    ),
}
export function generateTemplate<T extends TemplateType>(
  template: T,
  params: TemplateParamMap[T]
): TemplateResult {
  return templates[template](params)
}





