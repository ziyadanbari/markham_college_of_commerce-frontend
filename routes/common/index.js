const express = require("express");
const router = express.Router();
const { handleResendOtp } = require("../../controller/common/resendOtp");
const { header } = require("express-validator");

// ROUTER: POST /resend-otp
router.post(
  "/resend-otp",
  [header("sessionId").notEmpty().withMessage("Session ID is required")],
  handleResendOtp
);

module.exports = router;
