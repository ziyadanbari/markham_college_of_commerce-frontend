const { validationResult } = require("express-validator");
const Student = require("../../model/student");
const bcrypt = require("bcrypt");
const { setOtp, verifyOtp } = require("../../services/otp");
const {
  passwordRecoveryEmailTemplate,
} = require("../../services/email/emailHtmlTemplates/otpPasswordRecovery");
const { sendMail } = require("../../services/email/emailSend");
const { createJwtToken, verifyJwtToken } = require("../../auth/jwtToken");
const { default: mongoose } = require("mongoose");

const handlePasswordResetOtpRequest = async (req, res) => {
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
    const { email, role } = req.body; // get email and password from request body

    // Find user on the base of their role and with the help of email

    let user;
    if (role === "student") {
      user = await Student.findOne({ email });
    }
    // else if(role === "admin") {
    //   user = await Admin.findOne({ email });
    // }

    // if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account Doesn't exit with this email",
      });
    }

    // Map user._id with otp and destructure {sessionId, otp}
    const { sessionId, otp } = setOtp({ id: user._id.toString(), role });

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
    return res
      .status(200)
      .header({ sessionId: sessionId }) // Set sessionId as a custom header
      .json({
        success: true,
        message: `OTP sent to your email ${email}`,
        sessionId: sessionId,
      });
  } catch (error) {
    console.log(error);
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
  const { otp } = req.body;

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

    // Create jwt token
    // TODO: change token expiry time to 10 minutes ('10m')
    const token = createJwtToken({ ...userData, isOtpVerified: true }, "10d");

    // Sending the response
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      authorization: "Bearer " + token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//
const handlePasswordChange = async (req, res) => {
  // Checking, Every Details is Valid or Not
  const isEveryDetailsValid = validationResult(req);

  // If Not Valid, Then Send Error
  if (!isEveryDetailsValid.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: isEveryDetailsValid.array()[0].msg,
    });
  }

  // Split token and bearer from authorization header
  const authorizationPart = req.headers.authorization?.split(" ");

  // If authorization header is not valid
  if (
    !authorizationPart ||
    authorizationPart.length !== 2 ||
    authorizationPart[0] !== "Bearer"
  ) {
    return res.status(401).json({
      success: false,
      message: "Authorization is not valid",
    });
  }

  // Verify jwt token
  const userDetails = await verifyJwtToken(authorizationPart[1]);

  if (
    !userDetails ||
    !userDetails.isOtpVerified ||
    !mongoose.Types.ObjectId.isValid(userDetails.id)
  ) {
    return res.status(401).json({
      success: false,
      message: "Authorization is not valid",
    });
  }

  try {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password must be same",
      });
    }

    // hashPassword
    const hashPassword = await bcrypt.hash(password, 10);

    // Update password
    const user = await Student.findByIdAndUpdate(userDetails.id, {
      password: hashPassword,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Exporting the functions
module.exports = {
  handlePasswordResetOtpRequest,
  handlePasswordRecoveryOtpVerify,
  handlePasswordChange,
};
