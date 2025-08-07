exports.verifyEmail = (name, otp, expiry, verifyLink) => {
    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Verify Your Email Address</title>
    <style>
      body {
        background: #f6f8fa;
        font-family: 'Segoe UI', Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 480px;
        background: #fff;
        margin: 40px auto;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(60, 60, 60, 0.12);
        padding: 32px 24px;
      }
      .logo {
        display: block;
        margin: 0 auto 24px auto;
        width: 72px;
      }
      h2 {
        text-align: center;
        color: #2a2a2a;
        margin-bottom: 16px;
      }
      p {
        color: #434343;
        font-size: 16px;
        line-height: 1.7;
        margin-bottom: 20px;
      }
      .button {
        display: block;
        width: 80%;
        margin: 0 auto 18px auto;
        background: linear-gradient(90deg, #4f8cff 0%, #38c9ff 100%);
        color: #fff;
        text-decoration: none;
        font-weight: bold;
        text-align: center;
        padding: 15px 0;
        border-radius: 8px;
        font-size: 18px;
        box-shadow: 0 2px 4px rgba(60, 60, 60, 0.13);
        transition: background 0.2s;
      }
      .button:hover {
        background: linear-gradient(90deg, #38c9ff 0%, #4f8cff 100%);
      }
      .footer {
        text-align: center;
        color: #8a8a8a;
        font-size: 13px;
        margin-top: 22px;
      }
      .otp-box {
        display: inline-block;
        font-size: 22px;
        font-weight: bold;
        letter-spacing: 2px;
        background: #f5f5fa;
        color: #3a3a3a;
        padding: 12px 24px;
        border-radius: 6px;
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .expiry {
        text-align: center;
        color: #e74c3c;
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 14px;
      }
      .link {
        color: #4f8cff;
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Optional: Insert your logo below -->
      <!-- <img src="https://yourdomain.com/logo.png" alt="Logo" class="logo"> -->
      <h2>Welcome to Clicon- The E-commerce Platform</h2>
      <p>
        Hi ${name},<br>
        Thank you for joining <strong>Clicon- The E-commerce Platform</strong>! To activate your account, please verify your email address by clicking the button below.
      </p>
      <a href="${verifyLink}" class="button">Verify Email</a>
      <div class="expiry">
        This code/link will expire on <strong>${expiry.toLocaleString()}</strong>
      </div>
      <p style="text-align: center;">
        Or copy and paste this OTP code into your browser or app:<br>
        <span class="otp-box">${otp}</span>
      </p>
      <p class="footer">
        If you did not sign up for this account, you can safely ignore this email.<br><br>
        &copy; 2025 Clicon. All rights reserved.
      </p>
    </div>
  </body>
</html>
    `
}