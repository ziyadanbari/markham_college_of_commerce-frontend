const express = require("express");
const {
  handleStudentLogin,
  handleStudentSignup,
} = require("../controller/student/auth");
const router = express.Router();

// Handling request using router
router.post("/login", handleStudentLogin);
router.post("/signup", handleStudentSignup);

// Importing the router
module.exports = router;
