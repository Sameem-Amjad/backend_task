export const getVerificationTemplate = (otp: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { text-align: center; background-color: #4A90E2; padding: 20px; border-radius: 8px 8px 0 0; color: white; }
    .content { padding: 30px 20px; text-align: center; color: #333; }
    .button { display: inline-block; padding: 12px 24px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome!</h1>
    </div>
    <div class="content">
      <h2>Verify your email address</h2>
      <p>Thanks for signing up. Please use the OTP below to verify your email address and activate your account.</p>
      <h3 style="font-size: 24px; color: #4A90E2;">${otp}</h3>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">If you did not request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Content Workspace. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;