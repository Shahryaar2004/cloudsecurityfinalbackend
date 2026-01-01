const otpEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
</head>
<body style="background:#0b1220;color:#fff;font-family:Arial;padding:20px;">
  <div style="max-width:600px;margin:auto;background:#121826;padding:30px;border-radius:10px;">
    <h2 style="color:#4f46e5;">Verify Your Email</h2>
    <p>Your One-Time Password (OTP) is:</p>

    <h1 style="letter-spacing:6px;background:#000;padding:15px;border-radius:8px;text-align:center;">
      ${otp}
    </h1>

    <p>This OTP is valid for <b>10 minutes</b>.</p>
    <p>If you did not request this, please ignore this email.</p>

    <hr style="opacity:.2"/>
    <small>© 2025 AMS</small>
  </div>
</body>
</html>
`;

module.exports = otpEmailTemplate;
