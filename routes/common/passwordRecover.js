const express = require("express");
const { body, header } = require("express-validator");
const {
  handlePasswordRecoveryOtpVerify,
  handlePasswordChange,
  handlePasswordResetOtpRequest,
} = require("../../controller/common/passwordReset");
const router = express.Router();

// ROUTER: POST /password-recovery/password-recovery-otp-request
router.post(
  "/password-recovery-otp-request",
  [
    body("email").isEmail().withMessage("Enter a valid Email"),
    body("role").isIn(["student", "admin"]).withMessage("Enter a valid role"),
  ],
  handlePasswordResetOtpRequest
);

// ROUTER: POST /password-recovery/password-recovery-otp-verify
router.post(
  "/password-recovery-otp-verify",
  [
    // Validating otp and sessionId
    body("otp")
      .isLength({ max: 5 }, { min: 5 })
      .withMessage("Please enter a valid OTP")
      .isNumeric()
      .withMessage("Please enter a valid OTP"),
    header("sessionId").notEmpty().withMessage("Session ID is required"),
  ],
  handlePasswordRecoveryOtpVerify
);

// ROUTER: POST /password-recovery/password-change
router.post(
  "/password-change",
  [
    body("password").isStrongPassword().withMessage("Enter a strong password"),
    body("confirmPassword")
      .isStrongPassword()
      .withMessage("Enter a strong password"),
    header("Authorization").notEmpty().withMessage("Authorization is required"),
  ],
  handlePasswordChange
);
module.exports = router;
