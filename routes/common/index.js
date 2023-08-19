const express = require("express");
const router = express.Router();
const { handleResendOtp } = require("../../controller/common/resendOtp");
const { header } = require("express-validator");
const welcomeMessage = require("../../controller/welcomeMessage");
const {
  handleDownloadNotice,
} = require("../../controller/common/downloadNotice");

// Set a welcome message for the '/' endpoint for all the methods
router.get("/", welcomeMessage);
router.post("/", welcomeMessage);
router.put("/", welcomeMessage);
router.delete("/", welcomeMessage);

// ROUTER: POST /resend-otp
router.post(
  "/resend-otp",
  [header("sessionId").notEmpty().withMessage("Session ID is required")],
  handleResendOtp
);

router.get("/notice/download", handleDownloadNotice);

router.use("/password-recovery", require("./passwordRecover"));

module.exports = router;
