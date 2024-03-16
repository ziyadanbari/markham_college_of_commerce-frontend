const express = require("express");
const { body, header } = require("express-validator");
const verifyAdmin = require("../controller/admin/verifyAdmin.js");
const login = require("../controller/admin/login.js");
const adminRouter = express.Router();

adminRouter.post(
  "/login",
  [
    body("username").notEmpty().trim().withMessage("Username missed!"),
    body("password").notEmpty().trim().withMessage("Password missed!"),
  ],
  login
);
adminRouter.get(
  "/verifyAdmin",
  [
    header("authorization")
      .isLength({ min: 50 })
      .withMessage("Invalid Authorization")
      .notEmpty()
      .withMessage("Authorization is required"),
  ],
  verifyAdmin
);

module.exports = adminRouter;
