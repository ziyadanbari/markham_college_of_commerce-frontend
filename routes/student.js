const express = require("express");

const { body, header } = require("express-validator");
const {
  handleStudentSignup,
  handleStudentSignupOtpVerify,
} = require("../controller/student/signup");
const { handleStudentSignIn } = require("../controller/student/sign");
const { verifyStudent } = require("../controller/student/verifyStudent");
const router = express.Router();

// ROUTER: POST /student/signup
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("firstName")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("phoneNumber")
      .isMobilePhone()
      .withMessage("Please enter a valid phone number"),
  ],
  handleStudentSignup
);

// ROUTER: POST /student/sign-up-otp-verify
router.post(
  "/sign-up-otp-verify",
  [
    // Validating otp and sessionId
    body("otp")
      .isLength({ max: 5 }, { min: 5 })
      .withMessage("Please enter a valid OTP")
      .isNumeric()
      .withMessage("Please enter a valid OTP"),

    header("sessionId").notEmpty().withMessage("Session ID is required"),
  ],
  handleStudentSignupOtpVerify
);

// ROUTER: POST /student/signin
router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password").isLength({ min: 8 }).withMessage("Invalid password"),
  ],
  handleStudentSignIn
);

router.get(
  "/verifyStudent",
  [
    header("authorization")
      .isLength({ min: 50 })
      .withMessage("Invalid Authorization")
      .notEmpty()
      .withMessage("Authorization is required"),
  ],
  verifyStudent
);

// Importing the router
module.exports = router;
