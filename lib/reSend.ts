

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
  fallbackUrl: string,
  userExists:boolean
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
    verificationLink: string
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
      p.verificationLink
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





