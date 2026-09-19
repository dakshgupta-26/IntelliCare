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
   * IntelliCare Master Responsive Email Framework.
   * Features the official IntelliCare SVG Vector Brand Mark, Decision OS badge,
   * high-contrast clinical dark aesthetic, glowing accents, and cross-client compatibility.
   */
  private static wrapTemplate(title: string, bodyContent: string): string {
    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${title}</title>
  <style>
    :root {
      color-scheme: dark;
      supported-color-schemes: dark;
    }
    body, table, td, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #020617;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #E2E8F0;
      width: 100% !important;
      height: 100% !important;
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.9; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.02); }
    }
    .pulse-mark {
      animation: pulseGlow 3s ease-in-out infinite;
    }
    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        padding: 16px 12px !important;
      }
      .email-card {
        padding: 24px 18px !important;
        border-radius: 16px !important;
      }
      .otp-code {
        font-size: 32px !important;
        letter-spacing: 10px !important;
        padding-left: 10px !important;
      }
      .hide-mobile {
        display: none !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; -webkit-font-smoothing: antialiased;">
  <!-- Outer Wrapper Table -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: radial-gradient(circle at 50% 10%, #06152F 0%, #020617 80%); background-color: #020617; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 16px 48px 16px;">
        <!-- Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; margin: 0 auto;">
          <!-- Card Body -->
          <tr>
            <td>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-card" style="background-color: #070E22; border: 1px solid rgba(25, 199, 243, 0.28); border-radius: 20px; padding: 36px 32px; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(25, 199, 243, 0.08); text-align: left;">
                
                <!-- 1. Header with Official IntelliCare Logo Lockup -->
                <tr>
                  <td style="padding-bottom: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Left: Master Logo Mark + Wordmark -->
                        <td align="left" style="vertical-align: middle;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <!-- Vector SVG Mark -->
                              <td style="vertical-align: middle; padding-right: 14px;">
                                <div style="width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, rgba(8, 62, 158, 0.4) 0%, rgba(25, 199, 243, 0.2) 100%); padding: 2px; border: 1px solid rgba(25, 199, 243, 0.35); text-align: center;">
                                  <svg width="36" height="36" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 2px auto 0 auto;">
                                    <defs>
                                      <linearGradient id="em-top" x1="68" y1="90" x2="88" y2="15" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stop-color="#083E9E" />
                                        <stop offset="35%" stop-color="#0066FF" />
                                        <stop offset="70%" stop-color="#00B2FE" />
                                        <stop offset="100%" stop-color="#4DD8FF" />
                                      </linearGradient>
                                      <linearGradient id="em-bottom" x1="92" y1="70" x2="72" y2="145" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stop-color="#083E9E" />
                                        <stop offset="35%" stop-color="#005BEA" />
                                        <stop offset="75%" stop-color="#00C0FF" />
                                        <stop offset="100%" stop-color="#38BDF8" />
                                      </linearGradient>
                                      <linearGradient id="em-left" x1="90" y1="80" x2="20" y2="92" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stop-color="#052B75" />
                                        <stop offset="40%" stop-color="#0055EE" />
                                        <stop offset="85%" stop-color="#0099FF" />
                                        <stop offset="100%" stop-color="#38BDF8" />
                                      </linearGradient>
                                      <linearGradient id="em-right" x1="70" y1="80" x2="140" y2="68" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stop-color="#0A3C9E" />
                                        <stop offset="45%" stop-color="#0077FF" />
                                        <stop offset="85%" stop-color="#00C4FF" />
                                        <stop offset="100%" stop-color="#7DD3FC" />
                                      </linearGradient>
                                      <linearGradient id="em-twist" x1="45" y1="95" x2="115" y2="65" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stop-color="#0044CC" stop-opacity="0.95" />
                                        <stop offset="50%" stop-color="#00B2FE" stop-opacity="0.9" />
                                        <stop offset="100%" stop-color="#7DD3FC" stop-opacity="0.5" />
                                      </linearGradient>
                                    </defs>
                                    <g>
                                      <path d="M74 88 C58 92, 38 102, 24 98 C18 96, 16 88, 22 82 C32 72, 54 68, 76 74 Z" fill="url(#em-left)" opacity="0.96" />
                                      <path d="M72 82 C68 96, 62 120, 68 136 C72 144, 82 146, 88 138 C96 126, 94 100, 86 80 Z" fill="url(#em-bottom)" />
                                      <path d="M84 72 C100 68, 122 58, 136 62 C142 64, 144 72, 138 78 C128 88, 106 92, 84 86 Z" fill="url(#em-right)" opacity="0.96" />
                                      <path d="M88 78 C92 64, 98 40, 92 24 C88 16, 78 14, 72 22 C64 34, 66 60, 74 80 Z" fill="url(#em-top)" />
                                      <path d="M58 84 C68 76, 82 66, 98 62 C104 60, 108 64, 102 70 C88 82, 74 94, 60 98 C54 100, 50 96, 54 88 Z" fill="url(#em-twist)" />
                                    </g>
                                  </svg>
                                </div>
                              </td>
                              <!-- Typographic Wordmark -->
                              <td style="vertical-align: middle;">
                                <div>
                                  <span style="font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    Intelli<span style="color: #19C7F3;">Care</span>
                                  </span>
                                  <span style="display: inline-block; font-size: 10px; font-family: monospace; font-weight: 800; background: rgba(25, 199, 243, 0.15); color: #19C7F3; border: 1px solid rgba(25, 199, 243, 0.35); padding: 2px 7px; border-radius: 9999px; margin-left: 8px; vertical-align: middle; letter-spacing: 0.5px;">
                                    DECISION OS
                                  </span>
                                </div>
                                <div style="font-size: 8px; font-family: monospace; font-weight: 600; color: #64748B; letter-spacing: 1.8px; text-transform: uppercase; margin-top: 3px;">
                                  INTELLIGENCE FOR A HEALTHIER TOMORROW
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>

                        <!-- Right: Live System Status Indicator (Hidden on small mobile) -->
                        <td align="right" class="hide-mobile" style="vertical-align: middle;">
                          <div style="display: inline-block; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 9999px; padding: 4px 10px; font-size: 10px; font-family: monospace; font-weight: 700; color: #34D399; text-transform: uppercase; letter-spacing: 0.5px;">
                            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: #34D399; margin-right: 6px; vertical-align: middle; box-shadow: 0 0 8px #34D399;"></span>
                            SYSTEM LIVE
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- 2. Dynamic Main Body Content Slot -->
                <tr>
                  <td style="padding-top: 28px;">
                    ${bodyContent}
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- 3. Enterprise Zero-Trust Footer -->
          <tr>
            <td style="padding-top: 28px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 11px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #64748B; line-height: 1.7;">
                    <p style="margin: 0 0 6px 0; font-weight: 600; color: #94A3B8;">
                      IntelliCare Enterprise Decision Support OS • Cryptographic Operations Ledger
                    </p>
                    <p style="margin: 0 0 8px 0; font-size: 10px; color: #475569;">
                      HIPAA Compliant • SOC-2 Type II Zero-Trust Architecture • AES-256 GCM
                    </p>
                    <p style="margin: 0; font-size: 10px; color: #475569;">
                      This is an automated system notification dispatched via Mailjet. Never reply with passwords, patient telemetry, or sensitive credentials.
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
</body>
</html>`;
  }

  /**
   * Internal dispatcher for Mailjet REST API v3.1 with local development fallback.
   */
  private static async sendViaMailjet(toEmail: string, toName: string, subject: string, htmlContent: string): Promise<EmailSendResult> {
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
   * 1. Email Verification OTP: High-impact security card with prominent glowing 6-digit code.
   */
  static async sendVerificationEmail(email: string, name: string, otp: string, expiresInMinutes = 10): Promise<EmailSendResult> {
    const subject = 'Verify your IntelliCare email: ' + otp;
    const body = `
      <div style="margin-bottom: 24px;">
        <span style="display: inline-block; font-size: 11px; font-family: monospace; font-weight: 700; color: #19C7F3; background: rgba(25, 199, 243, 0.1); border: 1px solid rgba(25, 199, 243, 0.25); border-radius: 9999px; padding: 3px 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
          CLINICAL IDENTITY CONFIRMATION
        </span>
        <h1 style="font-size: 26px; font-weight: 800; color: #FFFFFF; margin: 0 0 10px 0; letter-spacing: -0.5px;">
          Verify Your Email Address
        </h1>
        <p style="font-size: 14px; line-height: 1.65; color: #94A3B8; margin: 0;">
          Welcome to IntelliCare, <strong style="color: #FFFFFF;">${name}</strong>. Enter the single-use 6-digit verification code below to authorize your clinical decision support identity.
        </p>
      </div>

      <!-- Glowing OTP Code Capsule -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
        <tr>
          <td align="center">
            <div style="background: linear-gradient(180deg, #040916 0%, #030712 100%); border: 2px dashed #19C7F3; border-radius: 16px; padding: 24px 20px; text-align: center; box-shadow: 0 0 30px rgba(25, 199, 243, 0.18), inset 0 0 20px rgba(25, 199, 243, 0.05); max-width: 440px; margin: 0 auto;">
              <div style="font-size: 11px; color: #64748B; font-family: monospace; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px; font-weight: 600;">
                SECURE ONE-TIME PASSWORD
              </div>
              <div class="otp-code" style="font-family: 'SF Mono', 'Courier New', monospace; font-size: 42px; font-weight: 800; letter-spacing: 14px; color: #19C7F3; text-shadow: 0 0 20px rgba(25, 199, 243, 0.6); padding-left: 14px; margin: 6px 0;">
                ${otp}
              </div>
              <div style="font-size: 11px; color: #94A3B8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 14px; display: inline-flex; align-items: center; gap: 6px;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: #F59E0B; margin-right: 5px; vertical-align: middle;"></span>
                <span>Valid for <strong style="color: #F8FAFC;">${expiresInMinutes} minutes</strong> • Single-use cryptographic token</span>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 14px 18px; margin: 24px 0; font-size: 12px; color: #94A3B8; line-height: 1.6;">
        <strong style="color: #E2E8F0;">Zero-Trust Protocol:</strong> IntelliCare never prompts for passwords or OTPs over phone or messaging. If you did not initiate this registration, no action is required and the token will safely self-expire.
      </div>
    `;

    console.log(`\n🔑 [EMAIL VERIFICATION OTP] Email: ${email} | Code: ${otp} (Valid ${expiresInMinutes}m)\n`);
    EmailService.lastSentOtp = { email, otp };
    const res = await this.sendViaMailjet(email, name, subject, this.wrapTemplate(subject, body));
    return res;
  }

  /**
   * 2. Welcome Email: Celebratory onboarding showcase with key clinical platform modules.
   */
  static async sendWelcomeEmail(email: string, name: string): Promise<EmailSendResult> {
    const subject = 'Welcome to IntelliCare Decision OS: Workspace Activated';
    const workspaceUrl = `${config.frontendUrl}/app/dashboard`;
    const body = `
      <div style="text-align: center; margin-bottom: 28px;">
        <div style="width: 52px; height: 52px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); margin: 0 auto 16px auto; display: inline-block; line-height: 52px; text-align: center;">
          <span style="font-size: 24px; vertical-align: middle;">✓</span>
        </div>
        <h1 style="font-size: 26px; font-weight: 800; color: #FFFFFF; margin: 0 0 8px 0; letter-spacing: -0.5px;">
          Welcome to IntelliCare, ${name}!
        </h1>
        <p style="font-size: 14px; color: #38BDF8; font-family: monospace; font-weight: 600; margin: 0;">
          CLINICAL IDENTITY VERIFIED • WORKSPACE PROVISIONED
        </p>
      </div>

      <p style="font-size: 14px; line-height: 1.65; color: #94A3B8; margin: 0 0 24px 0; text-align: center;">
        Your authorized credentials have been authenticated. You now hold zero-trust governance access to hospital operational intelligence.
      </p>

      <!-- 3 Operational Modules Showcase -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0 28px 0;">
        <tr>
          <td style="padding-bottom: 12px;">
            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 14px 16px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="36" style="vertical-align: top; font-size: 20px;">⚡</td>
                  <td style="vertical-align: middle; padding-left: 10px;">
                    <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 2px;">Real-Time Clinical Telemetry</div>
                    <div style="font-size: 11px; color: #94A3B8; line-height: 1.4;">Live ED-to-ICU throughput tracking, digital twin topological mesh, and surge alarms.</div>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 12px;">
            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 14px 16px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="36" style="vertical-align: top; font-size: 20px;">🧠</td>
                  <td style="vertical-align: middle; padding-left: 10px;">
                    <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 2px;">Neural Bed & Acuity Forecasting</div>
                    <div style="font-size: 11px; color: #94A3B8; line-height: 1.4;">LSTM and Temporal Fusion Transformers projecting patient volume up to 72 hours ahead.</div>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 14px 16px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="36" style="vertical-align: top; font-size: 20px;">🎯</td>
                  <td style="vertical-align: middle; padding-left: 10px;">
                    <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 2px;">MILP Operational Optimization</div>
                    <div style="font-size: 11px; color: #94A3B8; line-height: 1.4;">Mixed-Integer Linear Programming rebalancing nurse rosters and ventilator supplies.</div>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>

      <!-- Launch Button -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0 20px 0;">
        <tr>
          <td align="center">
            <a href="${workspaceUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #19C7F3 0%, #0077FF 100%); color: #020617; text-decoration: none; font-weight: 800; font-size: 14px; padding: 15px 36px; border-radius: 12px; text-align: center; box-shadow: 0 4px 25px rgba(25, 199, 243, 0.4); letter-spacing: 0.2px;">
              Launch Operational Workspace →
            </a>
          </td>
        </tr>
      </table>

      <p style="font-size: 11px; color: #64748B; text-align: center; margin: 0;">
        Secure Direct URL: <a href="${workspaceUrl}" style="color: #38BDF8; text-decoration: underline;">${workspaceUrl}</a>
      </p>
    `;

    return this.sendViaMailjet(email, name, subject, this.wrapTemplate(subject, body));
  }

  /**
   * 3. New Sign-In Security Alert: Telemetry-rich receipt for unrecognized logins.
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
    const subject = 'Security Notice: New sign-in to your IntelliCare account';
    const securityUrl = `${config.frontendUrl}/app/settings`;
    const body = `
      <div style="margin-bottom: 24px;">
        <span style="display: inline-block; font-size: 11px; font-family: monospace; font-weight: 700; color: #F59E0B; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 9999px; padding: 3px 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
          AUTHENTICATION TELEMETRY
        </span>
        <h1 style="font-size: 24px; font-weight: 800; color: #FFFFFF; margin: 0 0 8px 0; letter-spacing: -0.4px;">
          New Sign-In Detected
        </h1>
        <p style="font-size: 14px; line-height: 1.6; color: #94A3B8; margin: 0;">
          Hello <strong style="color: #FFFFFF;">${name}</strong>, your IntelliCare account was accessed from a new device or IP session.
        </p>
      </div>

      <!-- Telemetry Spec Sheet -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; margin: 20px 0; font-size: 12px; font-family: monospace;">
        <tr>
          <td style="padding: 10px 14px; color: #64748B; border-bottom: 1px solid rgba(255, 255, 255, 0.05); width: 38%;">Timestamp</td>
          <td style="padding: 10px 14px; color: #F1F5F9; font-weight: 600; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${details.timestamp}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; color: #64748B; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">Device & Hardware</td>
          <td style="padding: 10px 14px; color: #F1F5F9; font-weight: 600; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${details.device}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; color: #64748B; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">Browser & Engine</td>
          <td style="padding: 10px 14px; color: #F1F5F9; font-weight: 600; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${details.browser}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; color: #64748B; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">Operating System</td>
          <td style="padding: 10px 14px; color: #F1F5F9; font-weight: 600; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${details.os}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; color: #64748B; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">IP Address</td>
          <td style="padding: 10px 14px; color: #38BDF8; font-weight: 600; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${details.ip}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; color: #64748B; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">Approx. Location</td>
          <td style="padding: 10px 14px; color: #F1F5F9; font-weight: 600; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${details.location}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; color: #64748B;">Auth Method</td>
          <td style="padding: 10px 14px; color: #34D399; font-weight: 600;">${details.method}</td>
        </tr>
      </table>

      <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 12px; padding: 14px 18px; margin: 24px 0;">
        <div style="color: #FDA4AF; font-size: 13px; font-weight: 700; margin-bottom: 4px;">Don't recognize this sign-in?</div>
        <div style="color: #FECDD3; font-size: 12px; line-height: 1.5;">An unauthorized party may have access to your credentials. Revoke all other active device sessions immediately to lock down your clinical identity.</div>
      </div>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
        <tr>
          <td align="center">
            <a href="${securityUrl}" target="_blank" style="display: inline-block; background: #E11D48; color: #FFFFFF; text-decoration: none; font-weight: 800; font-size: 13px; padding: 13px 28px; border-radius: 10px; text-align: center; box-shadow: 0 4px 20px rgba(225, 29, 72, 0.35);">
              Review Active Sessions →
            </a>
          </td>
        </tr>
      </table>
    `;

    return this.sendViaMailjet(email, name, subject, this.wrapTemplate(subject, body));
  }

  /**
   * 4. Cryptographic Password Reset Request
   */
  static async sendPasswordResetEmail(email: string, name: string, resetUrl: string, expiresInMinutes = 15): Promise<EmailSendResult> {
    const subject = 'Reset your IntelliCare password';
    const body = `
      <div style="margin-bottom: 24px;">
        <span style="display: inline-block; font-size: 11px; font-family: monospace; font-weight: 700; color: #38BDF8; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 9999px; padding: 3px 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
          CREDENTIAL RECOVERY
        </span>
        <h1 style="font-size: 26px; font-weight: 800; color: #FFFFFF; margin: 0 0 10px 0; letter-spacing: -0.5px;">
          Password Reset Request
        </h1>
        <p style="font-size: 14px; line-height: 1.65; color: #94A3B8; margin: 0;">
          Hello <strong style="color: #FFFFFF;">${name}</strong>, we received a request to reset the password for your IntelliCare clinical identity.
        </p>
      </div>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
        <tr>
          <td align="center">
            <a href="${resetUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #19C7F3 0%, #0077FF 100%); color: #020617; text-decoration: none; font-weight: 800; font-size: 14px; padding: 15px 36px; border-radius: 12px; text-align: center; box-shadow: 0 4px 25px rgba(25, 199, 243, 0.4); letter-spacing: 0.2px;">
              Reset Password →
            </a>
          </td>
        </tr>
      </table>

      <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 14px 18px; margin: 24px 0; font-size: 12px; color: #94A3B8; line-height: 1.6;">
        <strong style="color: #E2E8F0;">Security Constraints:</strong> This link is strictly single-use and will expire in <strong>${expiresInMinutes} minutes</strong>. If you did not request this, your password remains completely secure and no action is required.
      </div>
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
      <div style="margin-bottom: 24px;">
        <span style="display: inline-block; font-size: 11px; font-family: monospace; font-weight: 700; color: #34D399; background: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.25); border-radius: 9999px; padding: 3px 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
          SECURITY AUDIT EVENT
        </span>
        <h1 style="font-size: 26px; font-weight: 800; color: #FFFFFF; margin: 0 0 10px 0; letter-spacing: -0.5px;">
          Password Changed Successfully
        </h1>
        <p style="font-size: 14px; line-height: 1.65; color: #94A3B8; margin: 0;">
          Hello <strong style="color: #FFFFFF;">${name}</strong>, the access credentials for your account were updated on <strong style="color: #FFFFFF;">${timestamp}</strong>.
        </p>
      </div>

      <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 14px 18px; margin: 20px 0; font-size: 12px; color: #94A3B8; line-height: 1.6;">
        All existing authentication tokens on other devices have been automatically revoked to enforce zero-trust session integrity.
      </div>

      <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 12px; padding: 14px 18px; margin: 24px 0; font-size: 12px; color: #FDA4AF; line-height: 1.5;">
        <strong>Didn't make this change?</strong> Your account may be compromised. Immediately notify hospital administration or contact security@intellicare.health.
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
      <div style="margin-bottom: 24px;">
        <span style="display: inline-block; font-size: 11px; font-family: monospace; font-weight: 700; color: #38BDF8; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 9999px; padding: 3px 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
          CLINICAL ONBOARDING
        </span>
        <h1 style="font-size: 26px; font-weight: 800; color: #FFFFFF; margin: 0 0 10px 0; letter-spacing: -0.5px;">
          Clinical Workspace Invitation
        </h1>
        <p style="font-size: 14px; line-height: 1.65; color: #94A3B8; margin: 0;">
          Hello <strong style="color: #FFFFFF;">${name}</strong>, <strong style="color: #FFFFFF;">${inviterName}</strong> has invited you to join the clinical decision support workspace at <strong style="color: #FFFFFF;">${organizationName}</strong>.
        </p>
      </div>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; margin: 20px 0; font-size: 12px; font-family: monospace;">
        <tr>
          <td style="padding: 10px 14px; color: #64748B; border-bottom: 1px solid rgba(255, 255, 255, 0.05); width: 38%;">Assigned Role</td>
          <td style="padding: 10px 14px; color: #38BDF8; font-weight: 700; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${roleTitle}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; color: #64748B; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">Department Scope</td>
          <td style="padding: 10px 14px; color: #F1F5F9; font-weight: 600; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${departmentName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; color: #64748B; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">Healthcare Org</td>
          <td style="padding: 10px 14px; color: #F1F5F9; font-weight: 600; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${organizationName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; color: #64748B;">Invitation Validity</td>
          <td style="padding: 10px 14px; color: #34D399; font-weight: 600;">${expiresInDays} Days</td>
        </tr>
      </table>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
        <tr>
          <td align="center">
            <a href="${inviteUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #19C7F3 0%, #0077FF 100%); color: #020617; text-decoration: none; font-weight: 800; font-size: 14px; padding: 15px 36px; border-radius: 12px; text-align: center; box-shadow: 0 4px 25px rgba(25, 199, 243, 0.4); letter-spacing: 0.2px;">
              Activate Clinical Workspace Access →
            </a>
          </td>
        </tr>
      </table>

      <p style="font-size: 12px; line-height: 1.6; color: #64748B; text-align: center; margin: 0;">
        Upon activation, you will configure multi-factor access to view real-time patient bed capacity, AI telemetry, and MILP recommendations.
      </p>
    `;

    console.log(`\n💌 [STAFF INVITATION] Email: ${email} | Role: ${roleTitle} | Org: ${organizationName} | URL: ${inviteUrl}\n`);
    const res = await this.sendViaMailjet(email, name, subject, this.wrapTemplate(subject, body));
    (res as any).devInviteUrl = inviteUrl;
    return res;
  }
}
