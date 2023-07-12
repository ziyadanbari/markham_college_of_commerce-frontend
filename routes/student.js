const express = require("express");

const { body } = require("express-validator");
const { handleStudentSignup } = require("../controller/student/signup");
const router = express.Router();

// Handling request using router
// router.post(
//   "/login",
//   [
//     body("email").isEmail().withMessage("Please enter a valid email address"),
//     body("password")
//       .isLength({ min: 8 })
//       .withMessage("Password must be at least 5 characters long"),
//   ],
//   handleStudentLogin
// );

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

// Importing the router
module.exports = router;
