const loginEmail = (name = "User") => `
<!DOCTYPE html>
<html>
<body style="margin:0;background:#0b1220;color:#fff;font-family:Arial;padding:40px;">
  <div style="max-width:600px;margin:auto;background:#0f1724;padding:30px;border-radius:14px">
    
    <h2 style="color:#4f46e5;margin-top:0">
      Login Successful
    </h2>

    <p>Hello <b>${name}</b>,</p>

    <p>
      You have successfully logged in to 
      <b>Cloud Security.pk</b>.
    </p>

    <p>
      If this was not you, please contact us immediately:
      <br/>
      📧 <b>sec.sam.786@gmail.com</b>
    </p>

    <a href="https://cloudsecurity.pk"
       style="display:inline-block;margin-top:20px;
       background:#4f46e5;color:#fff;text-decoration:none;
       padding:12px 20px;border-radius:8px;font-weight:bold">
       Go to Dashboard
    </a>

    <hr style="opacity:.2;margin:30px 0"/>

    <p style="font-size:12px;color:#94a3b8">
      © 2025 Cloud Security.pk • All rights reserved
    </p>

  </div>
</body>
</html>
`;

module.exports = loginEmail;
