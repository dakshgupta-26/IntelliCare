import { config } from '../config/env';

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  devResetUrl?: string;
}

export class EmailService {
  public static lastSentOtp?: { email: string; otp: string };

  /**
   * Helper to format the official IntelliCare dark responsive email wrapper.
   */
  private static wrapTemplate(title: string, bodyContent: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #030612; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; }
    .container { max-width: 580px; margin: 0 auto; padding: 36px 20px; }
    .card { background-color: #070D1A; border: 1px solid rgba(25, 199, 243, 0.2); border-radius: 16px; padding: 36px; box-shadow: 0 16px 40px rgba(0,0,0,0.6); }
    .header { text-align: left; padding-bottom: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 24px; }
    .brand-mark { display: inline-block; vertical-align: middle; margin-right: 10px; width: 28px; height: 28px; }
    .brand-title { font-size: 20px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; vertical-align: middle; }
    .brand-badge { display: inline-block; font-size: 10px; font-family: monospace; font-weight: bold; background: rgba(25, 199, 243, 0.15); color: #19C7F3; border: 1px solid rgba(25, 199, 243, 0.3); padding: 2px 6px; border-radius: 4px; margin-left: 8px; vertical-align: middle; }
    .title { font-size: 22px; font-weight: 700; color: #FFFFFF; margin: 0 0 12px 0; letter-spacing: -0.3px; }
    .text { font-size: 14px; line-height: 1.6; color: #94A3B8; margin: 0 0 20px 0; }
    .otp-box { background: #030612; border: 2px dashed #19C7F3; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0; }
    .otp-code { font-family: 'Courier New', monospace; font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #19C7F3; text-shadow: 0 0 12px rgba(25, 199, 243, 0.4); }
    .otp-caption { font-size: 11px; color: #64748B; font-family: monospace; margin-top: 8px; text-transform: uppercase; }
    .btn { display: inline-block; background: linear-gradient(135deg, #19C7F3 0%, #1892E6 100%); color: #030612; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 10px; text-align: center; margin: 20px 0; box-shadow: 0 4px 20px rgba(25, 199, 243, 0.3); }
    .meta-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; font-family: monospace; }
    .meta-table td { padding: 8px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .meta-label { color: #64748B; width: 40%; }
    .meta-value { color: #F1F5F9; font-weight: 600; }
    .alert-banner { background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 8px; padding: 12px 16px; margin: 20px 0; font-size: 12px; color: #FDA4AF; }
    .footer { text-align: center; padding-top: 28px; font-size: 11px; color: #475569; font-family: monospace; line-height: 1.6; }
    .footer a { color: #64748B; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <span class="brand-title">IntelliCare</span>
        <span class="brand-badge">AI OPS</span>
      </div>
      ${bodyContent}
    </div>
    <div class="footer">
      <p>IntelliCare Enterprise Decision Support OS • Cryptographic Operations Ledger</p>
      <p>This is an automated system notification. Never reply with passwords, OTPs, or patient credentials.</p>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Internal dispatcher for Mailjet REST API v3.1 with local development fallback.
   */
  private static async sendViaMailjet(toEmail: string, toName: string, subject: string, htmlContent: string): Promise<EmailSendResult> {
    // If Mailjet is not configured, gracefully output to console and return success
    if (!config.mailjet.isConfigured) {
      console.log('\n================================================================');
      console.log(`📨 [MAILJET SIMULATED DELIVERY] (Configure MAILJET_API_KEY in .env)`);
      console.log(`To: ${toName} <${toEmail}>`);
      console.log(`Subject: ${subject}`);
      console.log('================================================================\n');
      return { success: true };
    }

    try {
      const authHeader = 'Basic ' + Buffer.from(`${config.mailjet.apiKey}:${config.mailjet.secretKey}`).toString('base64');
      const payload = {
        Messages: [
          {
            From: {
              Email: config.mailjet.senderEmail,
              Name: config.mailjet.senderName
            },
            To: [
              {
                Email: toEmail,
                Name: toName
              }
            ],
            Subject: subject,
            HTMLPart: htmlContent
          }
        ]
      };

      const response = await fetch('https://api.mailjet.com/v3.1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Mailjet Error]', response.status, errorText);
        return { success: false, error: `Mailjet API error (${response.status})` };
      }

      const resData: any = await response.json();
      const messageId = resData?.Messages?.[0]?.To?.[0]?.MessageID;
      return { success: true, messageId: String(messageId) };
    } catch (err: any) {
      console.error('[Mailjet Network Exception]', err);
      return { success: false, error: err?.message || 'Mailjet dispatch failed' };
    }
  }

  /**
   * 1. Email Verification OTP
   */
  static async sendVerificationEmail(email: string, name: string, otp: string, expiresInMinutes = 10): Promise<EmailSendResult> {
    const subject = 'Verify your IntelliCare email';
    const body = `
      <h1 class="title">Verify Your Email Address</h1>
      <p class="text">Welcome to IntelliCare, <strong>${name}</strong>. Please enter the single-use 6-digit verification code below to activate your healthcare operational decision support account.</p>
      
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <div class="otp-caption">One-Time Password (Expires in ${expiresInMinutes} minutes)</div>
      </div>

      <p class="text">If you did not register for an account on IntelliCare, please safely disregard this message. This code can only be used once.</p>
    `;

    console.log(`\n🔑 [EMAIL VERIFICATION OTP] Email: ${email} | Code: ${otp} (Valid ${expiresInMinutes}m)\n`);
    EmailService.lastSentOtp = { email, otp };
    const res = await this.sendViaMailjet(email, name, subject, this.wrapTemplate(subject, body));
    return res;
  }

  /**
   * 2. Welcome Email (Sent ONLY after verification)
   */
  static async sendWelcomeEmail(email: string, name: string): Promise<EmailSendResult> {
    const subject = 'Welcome to IntelliCare';
    const workspaceUrl = `${config.frontendUrl}/app/dashboard`;
    const body = `
      <h1 class="title">Welcome to IntelliCare, ${name}</h1>
      <p class="text">Your account has been successfully verified. You now have authorized access to the IntelliCare Decision Support platform.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${workspaceUrl}" class="btn">Launch Workspace →</a>
      </div>

      <p class="text">IntelliCare empowers hospital operations teams with real-time telemetry, neural forecasting, MILP capacity optimization, and clinical governance.</p>

      <div class="alert-banner">
        <strong>Security Notice:</strong> If you did not create this account, please immediately contact your hospital systems administrator or security@intellicare.health.
      </div>
    `;

    return this.sendViaMailjet(email, name, subject, this.wrapTemplate(subject, body));
  }

  /**
   * 3. New Sign-In / Device Notification
   */
  static async sendLoginAlert(
    email: string,
    name: string,
    details: {
      ip: string;
      device: string;
      browser: string;
      os: string;
      location: string;
      timestamp: string;
      method: string;
    }
  ): Promise<EmailSendResult> {
    const subject = 'New sign-in to your IntelliCare account';
    const securityUrl = `${config.frontendUrl}/app/settings`;
    const body = `
      <h1 class="title">New Sign-In Detected</h1>
      <p class="text">Hello <strong>${name}</strong>,</p>
      <p class="text">Your IntelliCare account was just accessed from a new or unrecognized session.</p>

      <table class="meta-table">
        <tr><td class="meta-label">Time:</td><td class="meta-value">${details.timestamp}</td></tr>
        <tr><td class="meta-label">Device Type:</td><td class="meta-value">${details.device}</td></tr>
        <tr><td class="meta-label">Browser:</td><td class="meta-value">${details.browser}</td></tr>
        <tr><td class="meta-label">Operating System:</td><td class="meta-value">${details.os}</td></tr>
        <tr><td class="meta-label">IP Address:</td><td class="meta-value">${details.ip}</td></tr>
        <tr><td class="meta-label">Approximate Location:</td><td class="meta-value">${details.location}</td></tr>
        <tr><td class="meta-label">Method:</td><td class="meta-value">${details.method}</td></tr>
      </table>

      <p class="text"><em>Note: Location is approximate and derived from network routing data.</em></p>

      <p class="text">If this was you, no action is required.</p>

      <div class="alert-banner">
        <strong>Wasn't you?</strong> An unauthorized party may have access to your credentials. Immediately revoke active sessions and change your password.
      </div>

      <div style="text-align: center;">
        <a href="${securityUrl}" class="btn" style="background: #F43F5E; color: white;">Review Active Sessions →</a>
      </div>
    `;

    return this.sendViaMailjet(email, name, subject, this.wrapTemplate(subject, body));
  }

  /**
   * 4. Password Reset Request
   */
  static async sendPasswordResetEmail(email: string, name: string, resetUrl: string, expiresInMinutes = 15): Promise<EmailSendResult> {
    const subject = 'Reset your IntelliCare password';
    const body = `
      <h1 class="title">Password Reset Request</h1>
      <p class="text">Hello <strong>${name}</strong>,</p>
      <p class="text">We received a request to reset the password for your IntelliCare account. Click the secure link below to choose a new password.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="btn">Reset Password →</a>
      </div>

      <p class="text">This link is single-use and will expire in <strong>${expiresInMinutes} minutes</strong>.</p>
      <p class="text">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    `;

    console.log(`\n🔗 [PASSWORD RESET LINK] Email: ${email} | URL: ${resetUrl} (Valid ${expiresInMinutes}m)\n`);
    const res = await this.sendViaMailjet(email, name, subject, this.wrapTemplate(subject, body));
    res.devResetUrl = resetUrl;
    return res;
  }

  /**
   * 5. Password Changed Confirmation
   */
  static async sendPasswordChangedEmail(email: string, name: string, timestamp: string): Promise<EmailSendResult> {
    const subject = 'Your IntelliCare password was changed';
    const body = `
      <h1 class="title">Password Changed Successfully</h1>
      <p class="text">Hello <strong>${name}</strong>,</p>
      <p class="text">The password for your IntelliCare account was changed on <strong>${timestamp}</strong>. For your security, all active sessions on other devices have been invalidated.</p>

      <div class="alert-banner">
        <strong>Important:</strong> If you did NOT make this change, your account has been compromised. Contact hospital security immediately.
      </div>
    `;

    return this.sendViaMailjet(email, name, subject, this.wrapTemplate(subject, body));
  }

  /**
   * 6. Clinical Staff Member Workspace Invitation
   */
  static async sendStaffInviteEmail(
    email: string,
    name: string,
    roleTitle: string,
    departmentName: string,
    organizationName: string,
    inviterName: string,
    inviteUrl: string,
    expiresInDays = 7
  ): Promise<EmailSendResult> {
    const subject = `IntelliCare Access Invitation: Join ${organizationName}`;
    const body = `
      <h1 class="title">Clinical Workspace Invitation</h1>
      <p class="text">Hello <strong>${name}</strong>,</p>
      <p class="text"><strong>${inviterName}</strong> has invited you to join the <strong>${organizationName}</strong> clinical operations and AI decision support workspace.</p>

      <table class="meta-table">
        <tr>
          <td class="meta-label">Assigned Role</td>
          <td class="meta-value">${roleTitle}</td>
        </tr>
        <tr>
          <td class="meta-label">Department Scope</td>
          <td class="meta-value">${departmentName}</td>
        </tr>
        <tr>
          <td class="meta-label">Healthcare Org</td>
          <td class="meta-value">${organizationName}</td>
        </tr>
        <tr>
          <td class="meta-label">Invitation Expiry</td>
          <td class="meta-value">${expiresInDays} Days</td>
        </tr>
      </table>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteUrl}" class="btn">Activate Clinical Workspace Access →</a>
      </div>

      <p class="text">Upon activating your account, you will establish your private multi-factor credentials and receive access to operational dashboards, clinical twin data, and telemetry feeds.</p>
      <p class="text">If you have questions regarding your clinical scope, please reach out to your hospital operations administrator.</p>
    `;

    console.log(`\n💌 [STAFF INVITATION] Email: ${email} | Role: ${roleTitle} | Org: ${organizationName} | URL: ${inviteUrl}\n`);
    const res = await this.sendViaMailjet(email, name, subject, this.wrapTemplate(subject, body));
    (res as any).devInviteUrl = inviteUrl;
    return res;
  }
}
