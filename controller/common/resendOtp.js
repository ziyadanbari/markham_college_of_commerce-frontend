const { validationResult } = require("express-validator");
const { getOtp } = require("../../services/otp");
const {
  otpEmailTemplate,
} = require("../../services/email/emailHtmlTemplates/otpEmailTemplate");
const { sendMail } = require("../../services/email/emailSend");

const handleResendOtp = async (req, res) => {
  // Checking, Every Details is Valid or Not
  const isEveryDetailsValid = validationResult(req);

  // If Not Valid, Then Send Error
  if (!isEveryDetailsValid.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: isEveryDetailsValid.array()[0].msg,
    });
  }

  // get auth token from header
  const sessionId = req.headers.sessionid;

  try {
    // get otp with the help of sessionId
    const { success, message, otp, email } = getOtp(sessionId);

    // if otp is not found
    if (!success) {
      return res.status(400).json({
        success: false,
        message: message,
      });
    }

    // Importing email template
    const { html, text } = otpEmailTemplate(otp);

    let mailPayload = {
      sender: `Markham College of commerce Hazaribagh`,
      receiversEmail: email,
      subject: `Your one time password (otp): ${otp}`,
      messageText: text,
      messageHtml: html,
    };

    // Sending Email
    const { success: isEmailSend } = await sendMail(mailPayload);

    // If Email is not send, Then Send Error
    if (!isEmailSend) {
      return res.status(500).json({
        success: false,
        message: "Unable to send Email",
      });
    }

    // Sending the response
    return res.status(200).json({
      success: true,
      message:
        "OTP send on your email again, Please check your spam folder too",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { handleResendOtp };
