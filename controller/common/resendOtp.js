const { validationResult } = require("express-validator");
const { getOtp } = require("../../services/otp");

const handleResendOtp = (req, res) => {
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
  const sessionId = req.header.sessionId;

  try {
    // get otp with the help of sessionId
    const { success, message, otp } = getOtp(sessionId);

    // if otp is not found
    if (!success) {
      return res.status(400).json({
        success: false,
        message: message,
      });
    }

    console.log(otp);

    // Sending the response
    return res.status(200).json({
      success: true,
      message: "OTP send on your email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { handleResendOtp };
