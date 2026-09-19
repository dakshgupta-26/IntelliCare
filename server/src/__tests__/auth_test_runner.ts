process.env.NODE_ENV = 'test';
import http from 'http';

async function runTests() {
  const { app } = await import('../index');
  const { db } = await import('../storage/db');
  const { EmailService } = await import('../services/emailService');
  console.log('🧪 Starting IntelliCare Enterprise Authentication Test Suite...\n');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✓ ${testName}`);
      passedCount++;
    } else {
      console.error(`  ✗ ${testName}${detail ? ` - ${detail}` : ''}`);
      failedCount++;
    }
  }

  // Start HTTP server on a test port
  const testPort = 5099;
  const testServer = http.createServer(app);
  await new Promise<void>((resolve) => {
    testServer.listen(testPort, () => resolve());
  });
  const baseUrl = `http://127.0.0.1:${testPort}`;

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthJson: any = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.status === 'healthy', 'API Health Check returns healthy');

    // 2. Registration - Invalid password (too short / no uppercase)
    const weakPassRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. Test User',
        email: 'dr.test@intellicare.health',
        password: 'weak',
        confirmPassword: 'weak'
      })
    });
    assert(weakPassRes.status === 400, 'Registration rejects weak passwords');

    // 3. Valid Registration
    const testEmail = `dr.neuro_${Date.now()}@intellicare.health`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. Neuro Specialist',
        email: testEmail,
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!'
      })
    });
    const regJson: any = await regRes.json();
    assert(regRes.status === 201 && regJson.success === true, 'User registration succeeds', JSON.stringify(regJson));
    assert(!regJson.devOtp, 'Registration strictly hides OTP from client response');
    const otp = EmailService.lastSentOtp?.otp || '';
    assert(Boolean(otp), 'Registration generated and dispatched secure OTP via email service');

    // 4. Attempt Login Before Email Verification (Should be 403 Forbidden)
    const unverifiedLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'SecurePassword123!'
      })
    });
    const unverifiedJson: any = await unverifiedLoginRes.json();
    assert(
      unverifiedLoginRes.status === 403 && unverifiedJson.code === 'EMAIL_VERIFICATION_REQUIRED',
      'Unverified accounts are strictly blocked from logging in'
    );

    // 5. Verification with Invalid OTP
    const badOtpRes = await fetch(`${baseUrl}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        otp: '000000'
      })
    });
    assert(badOtpRes.status === 400, 'Invalid OTP is rejected');

    // 6. Verification with Valid OTP
    const verifyRes = await fetch(`${baseUrl}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        otp
      })
    });
    const verifyJson: any = await verifyRes.json();
    assert(verifyRes.status === 200 && verifyJson.user.emailVerified === true, 'Valid OTP verifies email and activates user');
    assert(Boolean(verifyJson.accessToken), 'Successful verification returns short-lived access token');

    // Extract cookie from verification response
    const setCookieHeader = verifyRes.headers.get('set-cookie') || '';
    assert(setCookieHeader.includes('ic_refresh_token') && setCookieHeader.includes('HttpOnly'), 'Sets HttpOnly session refresh cookie');

    // 7. Login with Verified Credentials
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'SecurePassword123!'
      })
    });
    const loginJson: any = await loginRes.json();
    assert(loginRes.status === 200 && Boolean(loginJson.accessToken), 'Login with verified credentials succeeds');
    const accessToken = loginJson.accessToken;
    const loginCookie = loginRes.headers.get('set-cookie') || '';

    // 8. Authenticated Route (/auth/me) with Access Token
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const meJson: any = await meRes.json();
    assert(meRes.status === 200 && meJson.user.email === testEmail, 'GET /auth/me returns authenticated user identity');
    assert(!meJson.user.passwordHash, 'User response strictly redacts passwordHash');

    // 9. Active Sessions Listing (/auth/sessions)
    const sessionsRes = await fetch(`${baseUrl}/auth/sessions`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const sessionsJson: any = await sessionsRes.json();
    assert(sessionsRes.status === 200 && sessionsJson.sessions.length >= 1, 'GET /auth/sessions returns active user sessions');
    assert(sessionsJson.sessions[0].browser === 'Google Chrome', 'Session parses User-Agent into Chrome');

    // 10. Refresh Token Rotation (/auth/refresh)
    const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: loginCookie
      }
    });
    const refreshJson: any = await refreshRes.json();
    assert(refreshRes.status === 200 && Boolean(refreshJson.accessToken), 'POST /auth/refresh rotates token and issues new access token');

    const rotatedCookie = refreshRes.headers.get('set-cookie') || '';
    assert(Boolean(rotatedCookie), 'POST /auth/refresh returns rotated HttpOnly refresh cookie');

    // 11. Refresh Token Reuse / Theft Detection
    // Presenting the OLD cookie again must be detected as token reuse!
    const reuseRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: loginCookie
      }
    });
    const reuseJson: any = await reuseRes.json();
    assert(
      reuseRes.status === 401 && reuseJson.code === 'TOKEN_THEFT_DETECTED',
      'Token reuse / replay attack triggers automatic revocation and theft protection'
    );

    // 12. Forgot Password (Anti-Enumeration)
    const forgotRes = await fetch(`${baseUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    const forgotJson: any = await forgotRes.json();
    assert(
      forgotRes.status === 200 && forgotJson.message.includes('password reset instructions have been dispatched'),
      'Forgot password returns generic anti-enumeration message'
    );
    assert(Boolean(forgotJson.devResetUrl), 'Forgot password generates secure single-use reset URL');

    const resetUrl = forgotJson.devResetUrl;
    const urlObj = new URL(resetUrl);
    const resetToken = urlObj.searchParams.get('token')!;

    // 13. Password Reset Execution
    const resetExecRes = await fetch(`${baseUrl}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        newPassword: 'BrandNewPassword456!',
        confirmPassword: 'BrandNewPassword456!'
      })
    });
    const resetExecJson: any = await resetExecRes.json();
    assert(resetExecRes.status === 200 && resetExecJson.success === true, 'Password reset with valid token succeeds');

    // 14. Verify old password no longer works, new password works
    const oldPassLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'SecurePassword123!' })
    });
    assert(oldPassLoginRes.status === 401, 'Old password rejected after password reset');

    const newPassLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'BrandNewPassword456!' })
    });
    assert(newPassLoginRes.status === 200, 'New password accepted after password reset');

    // 15. Security Audit Log Verification
    const auditEvents = db.findAuditEventsByUserId(meJson.user.id);
    assert(auditEvents.length > 0, 'Security audit ledger records all authentication lifecycle events');
    const hasRegEvent = auditEvents.some(e => e.eventType === 'USER_REGISTERED');
    const hasResetEvent = auditEvents.some(e => e.eventType === 'PASSWORD_RESET_COMPLETED');
    assert(hasRegEvent && hasResetEvent, 'Audit ledger contains registration and password reset records');

    // 16. Admin Login & Clinical Staff Directory
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sarah.chen@intellicare.health', password: 'IntelliCare@2026!' })
    });
    const adminLoginJson = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminLoginJson.accessToken, 'Hospital Admin can log in');

    const staffListRes = await fetch(`${baseUrl}/auth/staff`, {
      headers: { Authorization: `Bearer ${adminLoginJson.accessToken}` }
    });
    const staffListJson = await staffListRes.json();
    assert(staffListRes.status === 200 && Array.isArray(staffListJson.staff), 'Hospital Admin can retrieve clinical staff directory');

    // 17. Provision & Invite New Clinical Staff Member
    const staffInviteEmail = `dr.surgeon_${Date.now()}@intellicare.health`;
    const inviteRes = await fetch(`${baseUrl}/auth/staff/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminLoginJson.accessToken}`
      },
      body: JSON.stringify({
        name: 'Dr. Vivek Kapoor',
        email: staffInviteEmail,
        role: 'DEPARTMENT_MANAGER',
        departmentId: 'dept-surgery',
        departmentName: 'Surgical Operations',
        title: 'Chief of Robotic Surgery'
      })
    });
    const inviteJson = await inviteRes.json();
    assert(inviteRes.status === 201 && inviteJson.success === true, 'Admin can invite clinical staff with department scope');
    assert(Boolean(inviteJson.devInviteUrl), 'Staff invite generates cryptographic activation URL');

    const inviteUrlObj = new URL(inviteJson.devInviteUrl);
    const inviteToken = inviteUrlObj.searchParams.get('token')!;
    assert(Boolean(inviteToken), 'Invite URL contains valid secure activation token');

    // 18. Invited Staff Member Activates Account
    const activateRes = await fetch(`${baseUrl}/auth/staff/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: inviteToken,
        password: 'DoctorSecurePassword2026!',
        confirmPassword: 'DoctorSecurePassword2026!'
      })
    });
    const activateJson = await activateRes.json();
    assert(activateRes.status === 200 && activateJson.success === true, 'Invited staff can activate account and set password');
    assert(Boolean(activateJson.accessToken), 'Staff activation returns immediate workspace access token');

    // 19. Activated Staff Login with Permanent Password
    const staffLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: staffInviteEmail,
        password: 'DoctorSecurePassword2026!'
      })
    });
    const staffLoginJson = await staffLoginRes.json();
    assert(staffLoginRes.status === 200 && staffLoginJson.user.role === 'DEPARTMENT_MANAGER', 'Activated staff logs in with assigned role');

    // 20. Admin Suspends Staff Access (Terminates Active Sessions)
    const suspendRes = await fetch(`${baseUrl}/auth/staff/${activateJson.user.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminLoginJson.accessToken}`
      },
      body: JSON.stringify({ status: 'SUSPENDED' })
    });
    const suspendJson = await suspendRes.json();
    assert(suspendRes.status === 200 && suspendJson.user.status === 'SUSPENDED', 'Hospital Admin can suspend staff member');

    // Verify Suspended User Session is Revoked
    const suspendedMeRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${staffLoginJson.accessToken}` }
    });
    assert(suspendedMeRes.status === 401, 'Suspended staff token is rejected immediately');

    console.log(`\n========================================`);
    console.log(`📊 Test Summary: ${passedCount} PASSED, ${failedCount} FAILED`);
    console.log(`========================================\n`);

    if (failedCount > 0) {
      process.exit(1);
    }
  } finally {
    testServer.close();
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
