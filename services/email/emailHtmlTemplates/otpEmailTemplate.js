const signInEmailOtpVerificationTemplateHtml = (otp) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email OTP</title>
      <style>
        body {
          background-color: #f2f2f2;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 10px;
        }
        .container {
          margin: auto;
          background-color: #fff;
          padding: 30px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .container h1 {
          text-align: center;
          color: blue;
        }
        .message {
          text-align: center;
          margin-bottom: 20px;
        }
        .otp {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Markham College of commerce, Hazaribagh</h1>
        <div class="message">
          <h2>One-Time Password (OTP)</h2>
          <p>Please use the following OTP to verify your email:</p>
        </div>
        <div class="otp">
          <span>${otp}</span>
        </div>
        <div class="footer">
          <p>OTP will expire in 10 minutes.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
          <p>This OTP is requested from <a href="https://mcchzb.in">https://mcchzb.in</a></p>
          <p>&copy; 2023 MCCHZB All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
};

const signInEmailOtpVerificationTemplateText = (otp) => {
  return `
  Markham college of commerce, Hazaribagh
  Your One-Time Password is ${otp}

  OTP will expire in 10 minutes.
  this opt is requested from https://mcchzb.in
  `;
};

const otpEmailTemplate = (otp) => {
  if (!otp) {
    throw new Error("OTP is required");
  }

  return {
    html: signInEmailOtpVerificationTemplateHtml(otp),
    text: signInEmailOtpVerificationTemplateText(otp),
  };
};

module.exports = {
  otpEmailTemplate,
};
