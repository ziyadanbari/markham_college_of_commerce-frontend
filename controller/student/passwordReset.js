const { validationResult } = require("express-validator");
const Student = require("../../model/student");
const bcrypt = require("bcrypt");
const { setOtp, verifyOtp } = require("../../services/otp");
const {
  passwordRecoveryEmailTemplate,
} = require("../../services/email/emailHtmlTemplates/otpPasswordRecovery");
const { sendMail } = require("../../services/email/emailSend");

const handleStudentPasswordReset = async (req, res) => {
  // Checking, Every Details is Valid or Not
  const isEveryDetailsValid = validationResult(req);

  // If Not Valid, Then Send Error
  if (!isEveryDetailsValid.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: isEveryDetailsValid.array()[0].msg,
    });
  }

  try {
    const { email } = req.body; // get email and password from request body

    // check if user exist or not
    const user = await Student.findOne({ email });

    // if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account Doesn't exit with this email",
      });
    }

    // Map user._id with otp and destructure {sessionId, otp}
    // TODO: save user._id as string
    const { sessionId, otp } = setOtp({ id: user._id });

    // Importing email template
    const { html, text } = passwordRecoveryEmailTemplate(otp);

    // Set mail payload to send otp on mail
    let mailPayload = {
      sender: `Markham College of commerce`,
      receiversEmail: user.email,
      subject: `Password reset OTP is ${otp}`,
      messageText: text,
      messageHtml: html,
    };

    // send mail using mailPayload
    const send = await sendMail(mailPayload);

    // Check if email sending was not successful
    if (!send.success) {
      return res.status(500).send({
        success: false,
        message: "Unable to send OTP",
      });
    }

    // Sending the response
    return res.status(200).json({
      success: true,
      message: `OTP send on your email ${email}`,
      sessionId: sessionId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const handlePasswordRecoveryOtpVerify = async (req, res) => {
  // Checking, Every Details is Valid or Not
  const isEveryDetailsValid = validationResult(req);

  // If Not Valid, Then Send Error
  if (!isEveryDetailsValid.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: isEveryDetailsValid.array()[0].msg,
    });
  }

  const sessionId = req.headers.sessionid;
  const { otp, password } = req.body;

  try {
    // Verifying the otp
    const { success, message, userData } = await verifyOtp(sessionId, otp);

    // If otp is not verified, Then Send Error
    if (!success) {
      return res.status(401).json({
        success: false,
        message: message,
      });
    }

    // hashPassword
    const hashPassword = await bcrypt.hash(password, 10);

    console.log(userData);

    // If otp is success then update password
    const student = await Student.findByIdAndUpdate(userData, {
      password: hashPassword,
    });

    console.log(student);

    // Sending the response
    return res.status(200).json({
      success: true,
      message: "Password change successfully! Go back and login",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

module.exports = {
  handleStudentPasswordReset,
  handlePasswordRecoveryOtpVerify,
};
